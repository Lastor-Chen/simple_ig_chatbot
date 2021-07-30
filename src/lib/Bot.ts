import Events from 'events'
import express, { Request, Response } from 'express'

interface BotOptions {
  accessToken: string
  verifyToken: string
  appSecret: string
}

class Bot extends Events {
  accessToken: string
  verifyToken: string
  appSecret: string

  app = express()

  constructor(options: BotOptions) {
    super()
    if (!options.accessToken || !options.verifyToken || !options.appSecret) {
      throw new Error('accessToken, verifyToken or appSecret is required')
    }
    this.accessToken = options.accessToken
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
    this.app.get('/webhook', this.verifyWebhook)
    // Receive messaging
    this.app.post('/webhook', (req, res) => this.postWebhook(req, res))
  }

  verifyWebhook(req: Request, res: Response) {
    const {
      'hub.mode': mode,
      'hub.verify_token': token,
      'hub.challenge': challenge,
    } = req.query

    if (mode !== 'subscribe' || token !== this.verifyToken) {
      console.log('Failed validation. Make sure the validation tokens match')
      return res.sendStatus(403)
    }

    res.status(200).send(challenge)
    console.log('Validation Succeeded')
  }

  postWebhook(req: Request, res: Response) {
    console.log('postWebhook')
    const body: msgerBody = req.body
    if (body.object === 'instagram') {
      this.handleMsgerData(body)
    }

    // Must send back a 200 within 20 seconds or the request will time out.
    res.sendStatus(200)
  }

  handleMsgerData(body: msgerBody) {
    console.log('\nbody', body)
    // Iterate over each entry. There may be multiple if batched.
    body.entry.forEach((entry) => {
      console.log('messaging', entry.messaging)
      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if (event.message?.is_echo) return void 0

        if (event.message?.text) {
          this.emit('text', event)
        }
      })
    })
  }
}

export default Bot