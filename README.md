# Simple IG Bot
Facebook Instagram Messaging API Framework for Node.js based on Express and Typescript.

## Installing
※ The package has not yet been deployed to npm. You need download it.
<br>
<br>
Download from github or use [degit](https://www.npmjs.com/package/degit) that will not downloading the entire git history.

```bash
$ npx degit Lastor-Chen/simple_ig_bot
```

Main module is `src/lib`, or `build/lib` for Javascript.
- If you use Typescript, copy `src/lib` to your project.
- If you use Javascript, copy `build/lib` to your project.

#### Dependencies
[axios](https://github.com/axios/axios) and [express](https://github.com/expressjs/express) is required.

## Quick Start

- Import module, then receive Instagram Messaging Webhook and Reply a text message.

```ts
// Typescript file
import { IGReceiver, IGSender } from './lib'

const receiver = new IGReceiver({
  verifyToken: 'Your Verify Token',
  appSecret: 'Your FB App Secret',
})
const sender = new IGSender('Your FB Access Token')

// Listen "text" Event
receiver.on('text', (event, userId) => {
  const text = event.message.text
  sender.sendText(userId, `You said: ${text}`)
})

// Listen "quickReply" Event
receiver.on('quickReply', (event, userId) => {
  // Do something
})

// Start the express server. Default port is 3000
receiver.start()
```

> NOTE: You can get all event types through IntelliSense provided by Typescript

- Use `@ts-check` comment to allow Typescript check in Javascript

```js
// Javascript file
// @ts-check

const { IGReceiver, IGSender } = require('./lib')
```

- Specify a custom conversation "step" as a Event to start a conversation

```ts
// When received a postback event or other, start a conversation
receiver.on('postback', (event, userId) => {
  const payload = event.postback.payload
  if (payload === 'custom_flag') {
    // Specify a custom conversation "step" keyword
    const nextStep = 'beginning'

    // This user will enter into target step
    receiver.gotoStep(userId, nextStep)

    // Send your question
    sender.sendTemplate(userId, [
      {
        title: 'Choose a button',
        buttons: [
          {
            type: 'postback',
            title: 'Button A',
            payload: nextStep,  // Use payload as a flag
          },
          {
            type: 'postback',
            title: 'Button B',
            payload: nextStep,
          },
        ],
      },
    ])
  }
})
```

- After specified a custom conversation "step" as Event, now you can listen it

```ts
receiver.on('beginning', async (event, userId, userState) => {
  // We cannot know the Webhook event is "message", "postback" or other
  // Use "in" operator to help typescript narrow down potential types
  if ('postback' in event && event.postback.payload === 'beginning') {
    // Save user's answer
    userState.foo = event.postback.title

    // Set next step
    const nextStep = 'xxx'
    receiver.gotoStep(userId, nextStep)

    // You can send a new question to repeat the conversation flow
    // Or end the conversation
    await sender.sendText(userId, 'This conversation is over')
    receiver.endConversation(userId)
  } else {
    // Handle unexpected events...
  }
})
```

- Use [ngrok](https://ngrok.com/) to test the bot locally

```bash
$ ngrok http 3000
```

## IGReceiver Class
IGReceiver is responsible for receive [Webhook](https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook) from Instagram Messaging.

#### new IGReceiver(options)
#### .start([port])
#### .gotoStep(userId, eventName)
#### .endConversation(userId)
#### .app
#### .state

## IGSender Class
IGReceiver is responsible for pass request to Messenger Platform via [Facebook Send API](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message).
It's based on axios.

#### new IGSender(options)
#### .sendText(receiver, text [, quickReplies])
#### .sendAttachment(receiver, type, url)
#### .sendTemplate(receiver, elements)
#### .setIceBreakers(iceBreakers)
#### .getIceBreakers()
#### .getUserProfile(userId [, fields])
