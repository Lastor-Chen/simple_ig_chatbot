import { sender } from '@/examples/modules/senderAPI'
import type { IGReceiver } from '@/lib'

const errMsg = '錯誤輸入，請重新選擇'

interface UserState {
  step: string
  race?: string
  job?: string
  gender?: string
}

export function convoB(receiver: IGReceiver) {
  receiver.on<UserState>('step_a', (event, userState, userId) => {
    const nextStep = 'step_b'

    // Webhook event is expected to be "postback" or other
    // Use payload as a flag to check whether it is expected answer
    if ('postback' in event && event.postback.payload === 'step_a') {
      // Send next question
      sender.sendTemplate(userId, [
        {
          title: 'Choose a job',
          buttons: [
            {
              type: 'postback',
              title: 'Warrior',
              payload: nextStep,
            },
            {
              type: 'postback',
              title: 'Sorcerer',
              payload: nextStep,
            },
            {
              type: 'postback',
              title: 'Healer',
              payload: nextStep,
            },
          ],
        },
      ])

      // Record data
      userState.race = event.postback.title
      userState.step = nextStep
    } else {
      sender.sendText(userId, errMsg)
    }
  })

  receiver.on<UserState>('step_b', (event, userState, userId) => {
    const nextStep = 'step_fin'

    if ('postback' in event && event.postback.payload === 'step_b') {
      // Send next question
      sender.sendTemplate(userId, [
        {
          title: 'Choose a gender',
          buttons: [
            {
              type: 'postback',
              title: 'male',
              payload: nextStep,
            },
            {
              type: 'postback',
              title: 'female',
              payload: nextStep,
            },
          ],
        },
      ])

      // Recode data
      userState.job = event.postback.title
      userState.step = nextStep
    } else {
      sender.sendText(userId, errMsg)
    }
  })

  receiver.on<UserState>('step_fin', async (event, userState, userId) => {
    if ('postback' in event && event.postback.payload === 'step_fin') {
      // Recode data
      userState.gender = event.postback.title

      const msgs = [
        'You chose,', //
        `  race: ${userState.race}`,
        `  job: ${userState.job}`,
        `  gender: ${userState.gender}`,
      ]

      await sender.sendText(userId, msgs.join('\n'))
      sender.sendText(userId, 'This conversation is over')

      // Delete userState to end this conversation
      receiver.endConversation(userId)
    } else {
      sender.sendText(userId, errMsg)
    }
  })
}
