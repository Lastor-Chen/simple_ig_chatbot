// 開發環境, 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { IGReceiver, IGSender } from './lib'

const PORT = process.env.PORT || 3000
const receiver = new IGReceiver({
  verifyToken: process.env.VERIFY_TOKEN!,
  appSecret: process.env.APP_SECRET!,
})
const sender = new IGSender(process.env.PAGE_ACCESS_TOKEN!)

// Set IG Messaging home page
sender.setIceBreakers([
  {
    question: 'test btnA',
    payload: '測試A',
  },
  {
    question: 'test btnB',
    payload: '測試B',
  },
])

// log request for dev mode
receiver.app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.path}`)
  next()
})

receiver.on('text', async (event) => {
  console.log('\n接收 text')
  const senderMsg = event.message.text
  const senderId = event.sender.id
  console.log('sid', senderId)

  const user = await sender.getUserProfile(senderId)

  // 文字訊息
  sender.sendText(senderId, `${user?.name} said: ${senderMsg}`)

  // 圖片
  // sender.sendAttachment(
  //   senderId,
  //   'image',
  //   'https://i.gyazo.com/5f23b5bfdf8f11078275bc0a954471c2.png'
  // )

  // quick reply text
  // sender.sendText(senderId, '快速回覆', [
  //   '按鈕A',
  //   { title: '按鈕B', payload: 'testB' },
  //   { title: '按鈕C', payload: 'customQR' },
  // ])

  // Buttons
  // sender.sendTemplate(senderId, [
  //   {
  //     title: 'Template',
  //     subtitle: '副標題',
  //     buttons: [
  //       {
  //         type: 'web_url',
  //         title: '按鈕A',
  //         url: 'https://www.google.com',
  //       },
  //       {
  //         type: 'postback',
  //         title: '按鈕B',
  //         payload: '測試',
  //       },
  //     ],
  //   },
  // ])
})

receiver.on('quickReply', (event) => {
  console.log('\n接收 quickReply')
  console.log(event)
})

receiver.on('postback', (event) => {
  console.log('\n接收 postback')
  console.log(event)
})

receiver.on('attachments', (event) => {
  console.log('\n接收 attachments')
  console.log(event.message.attachments)
})

receiver.start(PORT)
