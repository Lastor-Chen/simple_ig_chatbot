// 開發環境, 載入環境變數
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { IGReceiver, IGSender } from '@/lib'
import { basicSend } from '@/basicSend'
import { convoA, users } from '@/convoA'
import { opening } from '@/services/messages'
import { convoB } from '@/convoB'

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
    question: '測試連續對話',
    payload: 'convo',
  },
])

// log request for dev mode
receiver.app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.path}`)
  next()
})

receiver.on('text', async (event, userId) => {
  const hasConvo = users.some((user) => user.id === userId)
  if (hasConvo) {
    convoA(event, sender)
  } else {
    sender.sendTemplate(userId, opening)
  }
})

receiver.on('postback', (event, userId) => {
  const [type] = event.postback.payload.split(':')
  if (type === 'basic_send') {
    basicSend(event, sender)
  } else if (type === 'convo') {
    convoA(event, sender)
  } else if (type === 'convo_b') {
    // convo B
    receiver.state.set(userId, { step: 'step_a' })

    // question
    console.log('start conversation B')
    sender.sendTemplate(userId, [
      {
        title: '請選擇種族',
        buttons: [
          {
            type: 'postback',
            title: '人類',
            payload: 'step_a',
          },
          {
            type: 'postback',
            title: '精靈',
            payload: 'step_a',
          },
          {
            type: 'postback',
            title: '半獸人',
            payload: 'step_a',
          },
        ],
      },
    ])
  } else {
    sender.sendText(userId, '無效按鈕')
  }
})

convoB(receiver, sender)

receiver.start(PORT)
