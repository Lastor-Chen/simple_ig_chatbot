/// <reference types="./msger" />

// 開發環境, 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import Bot from '@/lib/Bot'
import msgerAPI from '@/msgerAPI'

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
  console.log('接收 text')
  const senderMsg = event.message.text
  if (event.sender.id === 'mock') {
    // mock 測試用
    console.log(`sender: ${senderMsg}`)
    console.log(`bot: ${senderMsg}`)
  } else {
    // 文字訊息
    // msgerAPI.sendText(event.sender.id, `Auto reply: ${senderMsg}`)

    // 圖片
    // msgerAPI.sendAttachment(
    //   event.sender.id,
    //   'https://i.gyazo.com/5f23b5bfdf8f11078275bc0a954471c2.png'
    // )

    // quick reply text
    msgerAPI.sendText(event.sender.id, '快速回覆', [
      '按鈕A',
      { title: '按鈕B', payload: 'testB' },
      { title: '按鈕C', payload: 'customQR' },
    ])
  }
})

bot.on('quickReply', (event: msgerEvent) => {
  console.log('\n接收 quickReply')
})

bot.start(PORT)
