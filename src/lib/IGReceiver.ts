import Events from 'events'
import express from 'express'
import type { Request, Response } from 'express'

interface IGReceiverOptions {
  verifyToken: string
  appSecret: string
}

interface IGReceiver {
  on(event: 'text', cb: (event: MsgerTextEvent) => void): this
  on(event: 'quickReply', cb: (event: MsgerQuickReplyEvent) => void): this
  on(event: 'attachments', cb: (event: MsgerAttachmentsEvent) => void): this
  on(event: 'postback', cb: (event: MsgerPostbackEvent) => void): this
  on<T>(step: string, cb: (event: MsgerEventType, userState: T, userId: string) => void): this
}

class IGReceiver extends Events {
  verifyToken: string
  appSecret: string

  app = express()
  state = new Map()

  constructor(options: IGReceiverOptions) {
    super()
    if (!options.verifyToken || !options.appSecret) {
      throw new Error('verifyToken or appSecret is required')
    }
    this.verifyToken = options.verifyToken
    this.appSecret = options.appSecret
    this.configExpress()
  }

  configExpress() {
    this.app.use(express.json()) // 解析 request json body
    this.app.use(express.urlencoded({ extended: true })) // 解析 queryString
  }

  start(port: number | string) {
    this.initWebhook()
    this.app.listen(port, () => {
      console.log(`Chatbot is running on localhost:${port}/webhook`)
    })
  }

  initWebhook() {
    // Verify webhook callback URL
    this.app.get('/webhook', (req, res) => {
      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']

      if (mode !== 'subscribe' || token !== this.verifyToken) {
        console.log('Failed validation. Make sure the validation tokens match')
        return res.sendStatus(403)
      }

      res.status(200).send(challenge)
      console.log('Validation Succeeded')
    })

    // Receive messaging
    this.app.post('/webhook', (req, res) => {
      this.postWebhook(req, res)
    })
  }

  postWebhook(req: Request, res: Response) {
    const body: MsgerBody = req.body
    if (body.object === 'instagram') {
      // Must send back a 200 within 20 seconds or the request will time out.
      res.sendStatus(200)
      this.handleMsgerData(body)
    }
  }

  handleMsgerData(body: MsgerBody) {
    // Iterate over each entry. There may be multiple if batched.
    body.entry.forEach((entry) => {
      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if ((<MsgerTextEvent>event).message?.is_echo) return void 0
        console.log('\nmessaging', entry.messaging)

        const sid = event.sender.id

        if (this.state.has(sid)) {
          const userState = this.state.get(sid)
          return this.emit(userState.step, event, userState, sid)
        } else if ('message' in event) {
          if ('quick_reply' in event.message) {
            return this.emit('quickReply', <MsgerQuickReplyEvent>event)
          } else if ('attachments' in event.message) {
            return this.emit('attachments', <MsgerAttachmentsEvent>event)
          } else if ('text' in event.message) {
            return this.emit('text', <MsgerTextEvent>event)
          }
        } else if ('postback' in event) {
          return this.emit('postback', event)
        }
      })
    })
  }

  /** Delete user's state to end a conversation */
  endConversation(userId: string) {
    if (this.state.has(userId)) {
      console.log("Can't found user in conversation")
      return false
    }

    return this.state.delete(userId)
  }
}

export default IGReceiver
