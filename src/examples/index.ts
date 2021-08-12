if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

import { receiver } from '@/examples/apis/receiverAPI'
import { sender } from '@/examples/apis/senderAPI'
import { basicSend } from '@/examples/basic_send'
import { convoA, users } from '@/examples/manual_conversation'
import { opening } from '@/examples/assets/message'

// Set Instagram Ice Breakers
sender.setIceBreakers([
  {
    question: 'Button A',
    payload: 'get_started',
  },
  {
    question: 'Button B',
    payload: 'get_started',
  },
])

// Invoke express app
receiver.app.use((req, res, next) => {
  // log all request path for dev
  console.log(`\n${req.method} ${req.path}`)
  next()
})

receiver.on('beforeEvent', (event) => {
  console.log('Webhook Event', event)
})

receiver.on('text', async (event, userId) => {
  const hasConvo = users.some((user) => user.id === userId)
  if (hasConvo) {
    // Intercept the event to continue a conversation
    convoA(event)
  } else {
    sender.sendTemplate(userId, opening)
  }
})

receiver.on('attachments', async (event, userId) => {
  const hasConvo = users.some((user) => user.id === userId)
  if (hasConvo) {
    // Intercept the event to continue a conversation
    convoA(event)
  } else {
    sender.sendTemplate(userId, opening)
  }
})

receiver.on('postback', (event, userId) => {
  // If continue a manual conversation
  const hasConvo = users.some((user) => user.id === userId)
  if (hasConvo) return convoA(event)

  // Get custom payload type
  const [type] = event.postback.payload.split(':')

  if (type === 'get_started') {
    sender.sendTemplate(userId, opening)
  } else if (type === 'basic_send') {
    // Show Instagram basic messaging demo
    basicSend(event)
  } else if (type === 'manual_conversation' || type === 'convo') {
    // Start a manual conversation
    convoA(event)
  } else if (type === 'routeful_conversation') {
    // Start a routeful conversation by set user's conversation step name
    // The step name will be used as event name
    const nextStep = 'step_a'
    receiver.gotoStep(userId, nextStep)

    // Send the first question to user.
    // Use payload as flag. Help us to verify the conversation step
    sender.sendTemplate(userId, [
      {
        title: 'Choose a race',
        buttons: [
          {
            type: 'postback',
            title: 'Human',
            payload: nextStep,
          },
          {
            type: 'postback',
            title: 'Elf',
            payload: nextStep,
          },
          {
            type: 'postback',
            title: 'Orc',
            payload: nextStep,
          },
        ],
      },
    ])
  } else {
    sender.sendText(userId, 'invalid message')
  }
})

// Load split listener file
require('@/examples/routeful_conversation')

// Start express server
receiver.start(process.env.PORT || 3000)
