import type { IGReceiver, IGSender } from '@/lib'

const errMsg = '錯誤輸入，請重新選擇'

interface UserState {
  step: string
  race?: string
  job?: string
  gender?: string
}

export function convoB(receiver: IGReceiver, sender: IGSender) {
  receiver.on<UserState>('step_a', (event, userState, userId) => {
    const nextStep = 'step_b'

    // 限定回答類型為 postback
    if ('postback' in event && event.postback.payload === 'step_a') {
      // Send next question
      sender.sendTemplate(userId, [
        {
          title: '請選擇職業',
          buttons: [
            {
              type: 'postback',
              title: '戰士',
              payload: nextStep,
            },
            {
              type: 'postback',
              title: '法師',
              payload: nextStep,
            },
            {
              type: 'postback',
              title: '牧師',
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
          title: '請選擇性別',
          buttons: [
            {
              type: 'postback',
              title: '男',
              payload: nextStep,
            },
            {
              type: 'postback',
              title: '女',
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
      const gender = event.postback.title

      const msgs = [
        '您選擇了:', //
        `種族: ${userState.race}`,
        `職業: ${userState.job}`,
        `性別: ${gender}`,
      ]

      await sender.sendText(userId, msgs.join('\n'))
      sender.sendText(userId, '連續對話結束')

      // 對話結束, delete userState
      receiver.endConversation(userId)
    } else {
      sender.sendText(userId, errMsg)
    }
  })
}

