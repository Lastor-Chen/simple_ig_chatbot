/// <reference types="./index" />

// 開發環境, 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import express from 'express'
import api from '@/apis'

const app = express()
const PORT = process.env.PORT || 3000
const VERIFY_TOKEN = process.env.VERIFY_TOKEN

app.use(express.json()) // 解析 body json
app.use(express.urlencoded({ extended: true })) // 解析 queryString

// log request for dev mode
app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.path}`)
  next()
})

// Verify webhook callback URL
app.get('/webhook', (req, res) => {
  const {
    'hub.mode': mode,
    'hub.verify_token': token,
    'hub.challenge': challenge,
  } = req.query

  if (mode !== 'subscribe' || token !== VERIFY_TOKEN) {
    console.log('Failed validation. Make sure the validation tokens match')
    return res.sendStatus(403)
  }

  res.status(200).send(challenge)
  console.log('Validation Succeeded')
})

// Receive messaging
app.post('/webhook', (req, res) => {
    const body = req.body
    console.log('body', body)

    if (body.object === 'instagram') {
      console.log('messaging', body.entry[0].messaging)

      body.entry.forEach((entry: any) => {
        if (entry.messaging) {
          const webhook_event: message = entry.messaging[0]
          if (webhook_event.message.is_echo) return void 0
          const senderMsg = webhook_event.message.text
          api.sendAPI(webhook_event.sender.id, `Auto reply: ${senderMsg}`)
        }
      })
    }

    res.send('ok')
})

app.listen(PORT, () => {
  console.log(`Chatbot is running on localhost:${PORT}/webhook`)
})
