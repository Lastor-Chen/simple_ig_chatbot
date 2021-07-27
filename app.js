// 載入 dev 環境變數
if (process.env.NODE_ENV !== 'production') {
  console.log('LOG, dotenv in')
  require('dotenv').config()
}

const BootBot = require('bootbot')
const api = require('./apis.js')

const PORT = process.env.PORT || 3000

// BootBot config
const bot = new BootBot({
  accessToken: process.env.PAGE_ACCESS_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET,
  graphApiVersion: 'v11.0',
})

console.log('bot config')

/**
 * @typedef message
 * @property {{id: string}} sender
 * @property {{id: string}} recipient
 * @property {number} timestamp
 * @property {{mid: string, text: string}} message
 */

// Routes
bot.app.post('/webhook', async (req, res) => {
  console.log('\nPOST /webhook')
  const body = req.body

  console.log(body)

  if (body.object === 'page') {
    body.entry.forEach(function (entry) {
      if (entry.messaging) {
        /** @type {message} */
        const webhook_event = entry.messaging[0]
        const senderMsg = webhook_event.message.text
        api.sendAPI(webhook_event.sender.id, `Auto reply: ${senderMsg}`)
      }
    })
  }

  if (body.object === 'instagram') {
    console.log(body.entry[0].changes[0])
    const text = body.entry[0].messaging?.message.text
    console.log(text)
  }

  res.send('ok')
})

bot.app.get('/', (req, res) => res.send('Server is running'))

// bot.on('message', (payload, chat) => {
//   const text = payload.message.text
//   console.log('in')
//   console.log(payload)
//   chat.say(`Hello World. You said: ${text}`)
// })

bot.start(PORT)