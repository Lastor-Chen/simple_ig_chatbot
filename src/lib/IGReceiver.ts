import Events from 'events'
import express from 'express'
import crypto from 'crypto'
import type { Request, Response } from 'express'
import type { IncomingMessage, ServerResponse } from 'http'

interface IGReceiverOptions {
  verifyToken: string
  appSecret: string
  /** Default is "/webhook" */
  webhook?: string
}

interface UserState {
  /** required in conversation */
  step: string
  [x:string]: any
}

// Declaring events in a Typescript class - Stackoverflow
// https://stackoverflow.com/questions/39142858/declaring-events-in-a-typescript-class-which-extends-eventemitter
interface IGReceiverEvent {
  beforeEvent: (event: any, userId: string) => void
  text: (event: MsgerTextEvent, userId: string) => void
  quickReply: (event: MsgerQuickReplyEvent, userId: string) => void
  attachments: (event: MsgerAttachmentsEvent, userId: string) => void
  postback: (event: MsgerPostbackEvent, userId: string) => void
}

type StepCallback<T = UserState> = (event: MsgerEventType, userId: string, userState: T) => void

interface IGReceiver {
  on<U extends keyof IGReceiverEvent>(event: U, cb: IGReceiverEvent[U]): this
  emit<U extends keyof IGReceiverEvent>(eventName: U, ...args: Parameters<IGReceiverEvent[U]>): boolean
  on<T extends UserState>(step: string, cb: StepCallback<T>): this
  emit(eventName: string, ...args: Parameters<StepCallback>): boolean
}

class IGReceiver extends Events {
  #verifyToken: string
  #appSecret: string
  #webhook: string

  app = express()
  state = new Map<string, UserState>()

  constructor(options: IGReceiverOptions) {
    super()
    if (!options.verifyToken || !options.appSecret) {
      throw new Error('verifyToken or appSecret is required')
    }
    this.#verifyToken = options.verifyToken
    this.#appSecret = options.appSecret
    this.#webhook = options.webhook || '/webhook'
    this.#configExpress()
  }

  #configExpress() {
    // Parse application/json
    this.app.use(
      this.#webhook,
      express.json({
        verify: (req, res, buf) => this.#verifyRequestSignature(req, res, buf),
      })
    )
    // Parse queryString application/x-www-form-urlencoded
    this.app.use(express.urlencoded({ extended: true }))
  }

  /** Verify that callback came from Facebook */
  #verifyRequestSignature(req: IncomingMessage, res: ServerResponse, buf: Buffer) {
    const signature = req.headers['x-hub-signature'] as string
    if (!signature) {
      throw new Error("Couldn't validate the request signature")
    } else {
      const elements = signature.split('=')
      const signatureHash = elements[1]
      const expectedHash = crypto
        .createHmac('sha1', this.#appSecret)
        .update(buf)
        .digest('hex')

      if (signatureHash !== expectedHash) {
        throw new Error("Couldn't validate the request signature. Confirm your App Secret")
      }
    }
  }

  /** Start express server, default port is 3000 */
  start(port: number | string = 3000) {
    this.#initWebhook()
    this.app.listen(port, () => {
      console.log(`Chatbot is running`)
      console.log(`Webhook running on localhost:${port}/webhook`)
    })
  }

  #initWebhook() {
    // Verify webhook callback URL
    const webhookPath = this.#webhook[0] !== '/' ? `/${this.#webhook}` : this.#webhook
    this.app.get(webhookPath, (req, res) => {
      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']

      if (mode !== 'subscribe' || token !== this.#verifyToken) {
        console.log('Failed validation. Make sure the validation tokens match')
        return res.sendStatus(403)
      }

      res.status(200).send(challenge)
      console.log('Validation Succeeded')
    })

    // Receive messaging
    this.app.post('/webhook', (req, res) => {
      this.#postWebhook(req, res)
    })
  }

  #postWebhook(req: Request, res: Response) {
    // Must send back a 200 within 20 seconds or the request will time out.
    res.sendStatus(200)

    const body: MsgerBody = req.body
    if (body.object === 'instagram') {
      this.#handleMsgerData(body)
    } else {
      console.log("Received a webhook, but it's not Instagram Messaging")
    }
  }

  #handleMsgerData(body: MsgerBody) {
    // Iterate over each entry. There may be multiple if batched.
    body.entry.forEach((entry) => {
      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if ((<MsgerTextEvent>event).message?.is_echo) return void 0
        const sid = event.sender.id

        this.emit('beforeEvent', event, sid)

        if (this.state.has(sid)) {
          // Intercept the event to continue a conversation
          const userState = this.state.get(sid)!
          this.emit(userState.step, event, sid, userState)
        } else if ('message' in event) {
          if ('quick_reply' in event.message) {
            this.emit('quickReply', <MsgerQuickReplyEvent>event, sid)
          } else if ('attachments' in event.message) {
            this.emit('attachments', <MsgerAttachmentsEvent>event, sid)
          } else if ('text' in event.message) {
            this.emit('text', <MsgerTextEvent>event, sid)
          }
        } else if ('postback' in event) {
          this.emit('postback', event, sid)
        } else {
          console.log('Received a unhandled webhook event', event)
        }
      })
    })
  }

  /** Set which conversation step is user at */
  gotoStep(userId: string, eventName: string) {
    const user = this.state.get(userId)
    if (user) {
      user.step = eventName
    } else {
      this.state.set(userId, { step: eventName })
    }
  }

  /** End the conversation by delete user's state */
  endConversation(userId: string) {
    if (this.state.has(userId)) {
      return this.state.delete(userId)
    } else {
      console.log("Can't found user in conversation")
      return false
    }
  }
}

export default IGReceiver
