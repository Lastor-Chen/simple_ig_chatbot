/// <reference types="./msger" />

// 開發環境, 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import Bot from '@/lib/Bot'
import api from '@/apis'

const PORT = process.env.PORT || 3000
const bot = new Bot({
  accessToken: process.env.PAGE_ACCESS_TOKEN!,
  verifyToken: process.env.VERIFY_TOKEN!,
  appSecret: process.env.APP_SECRET!,
})

// log request for dev mode
bot.app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.path}`)
  next()
})

bot.on('text', (event: msgerEvent) => {
  const senderMsg = event.message.text
  if (event.sender.id === 'mock') {
    console.log(`sender: ${senderMsg}`)
    console.log(`bot: ${senderMsg}`)
  } else {
    api.sendAPI(event.sender.id, `Auto reply: ${senderMsg}`)
  }
})

bot.start(PORT)
