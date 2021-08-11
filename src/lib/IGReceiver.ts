import Events from 'events'
import express from 'express'
import type { Request, Response } from 'express'

interface IGReceiverOptions {
  verifyToken: string
  appSecret: string
  /** Default is "/webhook" */
  webhook?: string
}

interface IGReceiver {
  on(event: 'text', cb: (event: MsgerTextEvent, userId: string) => void): this
  on(event: 'quickReply', cb: (event: MsgerQuickReplyEvent, userId: string) => void): this
  on(event: 'attachments', cb: (event: MsgerAttachmentsEvent, userId: string) => void): this
  on(event: 'postback', cb: (event: MsgerPostbackEvent, userId: string) => void): this
  on<T>(step: string, cb: (event: MsgerEventType, userState: T, userId: string) => void): this
}

class IGReceiver extends Events {
  #verifyToken: string
  #appSecret: string
  #webhook: string

  app = express()
  state = new Map<string, { step: string }>()

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
    this.app.use(express.json()) // 解析 request json body
    this.app.use(express.urlencoded({ extended: true })) // 解析 queryString
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

        if (this.state.has(sid)) {
          // Intercept the event to continue a conversation
          const userState = this.state.get(sid)!
          this.emit(userState.step, event, userState, sid)
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

  startConversation(userId: string, eventName: string) {
    this.state.set(userId, { step: eventName })
  }

  /** End the conversation by delete user's state */
  endConversation(userId: string) {
    if (this.state.has(userId)) {
      console.log("Can't found user in conversation")
      return false
    }

    return this.state.delete(userId)
  }
}

export default IGReceiver
