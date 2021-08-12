import { receiver } from '@/examples/apis/receiverAPI'
import { sender } from '@/examples/apis/senderAPI'

interface UserState {
  step: string
  race?: string
  job?: string
  gender?: string
}

const errMsg = 'Please choose a button from current question'

receiver.on<UserState>('step_a', (event, userId, userState) => {
  const nextStep = 'step_b'

  // Webhook event is expected to be "postback" or other
  // Verify the payload whether match conversation step name
  if ('postback' in event && event.postback.payload === 'step_a') {
    // Record data
    userState.race = event.postback.title
    receiver.gotoStep(userId, nextStep)

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
  } else {
    sender.sendText(userId, errMsg)
  }
})

receiver.on<UserState>('step_b', (event, userId, userState) => {
  const nextStep = 'step_fin'

  if ('postback' in event && event.postback.payload === 'step_b') {
    // Recode data
    userState.job = event.postback.title
    receiver.gotoStep(userId, nextStep)

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
  } else {
    sender.sendText(userId, errMsg)
  }
})

receiver.on<UserState>('step_fin', async (event, userId, userState) => {
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
    const isSuccess = await sender.sendText(userId, 'This conversation is over')

    // Delete userState to end this conversation
    if (isSuccess) {
      receiver.endConversation(userId)
    }
  } else {
    sender.sendText(userId, errMsg)
  }
})
