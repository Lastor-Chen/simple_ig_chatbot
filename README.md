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

### `new IGReceiver(options)`
| Property | Type | Default |
| -------- | -------- | -------- |
| verifyToken | string | |
| appSecret | string | |
| webhook? | string | "/wbhook" |

### `.start([port])`
| Params | Type | Default |
| -------- | -------- | -------- |
| port? | string \| number | 3000 |

### `.on(event, callback)`
Listen Instagram Webhook
| Params | Type | Default |
| -------- | -------- | -------- |
| event | string | |
| callback | (event, userId) => this | |

Webhook Event. ([See more](https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook#webhook-events))
| Event | Description | Interface |
| -------- | -------- | --------- |
| beforeEvent | Received a any message from user. Emit this event before check what type | MsgerEvent |
| text | Received a text message from user | MsgerTextEvent |
| quickReply | Received a quick reply from user | MsgerQuickReplyEvent |
| attachments | Received a attachments from user | MsgerAttachmentsEvent |
| postback | Received a postback from user | MsgerPostbackEvent |

Callback Params
| Params | Description | Type |
| -------- | -------- | ----- |
| event | The request data from Instagram | MsgerEvent |
| userId | The sender's [IGSID](https://developers.facebook.com/docs/messenger-platform/instagram/overview#igsid) | string |

### `.on<T>(step, callback)`
Listen custom conversation `step` Event. You can use `.gotoStep()` to specify it.
| Params | Type | Default |
| -------- | -------- | -------- |
| step | string | |
| callback | (step, userId, userState\<T>) => this | |

Callback Params
| Params | Description | Type |
| -------- | -------- | ----- |
| step | Custom event for conversation | string |
| userId | The sender's [IGSID](https://developers.facebook.com/docs/messenger-platform/instagram/overview#igsid) | string |
| userState | A javascript Map object for save user's state | UserState |

You can specify a custom user's state Interface. `step` prop is required.
```ts
// Typescript
interface UserState {
  step: string
  job: string
  // ...any more
}

receiver.on<UserState>('customStep', (event, userId, userState) => {
  user.job  // OK
  user.foo  // Error, prop does not exist on type UserState
})
```

### `.gotoStep(userId, eventName)`
Assigns custom `step` Event to user's state. It will start a conversation.
| Params | Type | Default |
| -------- | -------- | -------- |
| userId | string | |
| eventName | string | |

### `.endConversation(userId)`
Ends a conversation by delete user's state.
| Params | Type | Default |
| -------- | -------- | -------- |
| userId | string | |

### `.state`
A javascript Map object for save user's state.
```ts
// Set conversation "step" event to user
receiver.state.set('userId', { step: eventName })

// Get user's state then add a new one
const userState = receiver.state.get('userId')
userState.foo = 'new state value'
```

### `.app`
[Express Application](https://expressjs.com/zh-tw/4x/api.html#app).

## IGSender Class
IGReceiver is responsible for pass request to Messenger Platform via [Facebook Send API](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message). It's based on axios.

### `new IGSender(accessToken)`
| Params | Type | Default |
| -------- | -------- | -------- |
| accessToken | string | |

### `.sendText(receiver, text [, quickReplies])`
Send text message or quick replies. QuickReply payload is English and numbers only.
| Params | Type | Default |
| -------- | -------- | -------- |
| receiver | string | |
| text | string | |
| quickReplies? | Array<string \| QuickReply> | |

See [Quick Replies](https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies).
```ts
Interface QuickReply {
  content_type?: 'text'
  title: string
  payload: string
  image_url?: string
}

sender.sendText('userId', 'textContent', [
  {
    // QuickReply Interface
  }
])
```

### `.sendAttachment(receiver, type, url)`
Send attachment. Attachment type is different from Messenger.
| Params | Type | Default |
| -------- | -------- | -------- |
| receiver | string | |
| type | "image" \| "like_heart" \| "media_share" | |
| url? | string | " " |

#### .sendTemplate(receiver, elements)
Send Template that supports a maximum of 10 elements per message and 3 buttons per element.
| Params | Type | Default |
| -------- | -------- | -------- |
| receiver | string | |
| elements | Array\<TemplateElement> | |

```ts
interface TemplateElement {
  /** 80 character limit */
  title: string
  /** 80 character limit */
  subtitle?: string
  image_url?: string
  /** The default action executed when the template is tapped */
  default_action?: {
    type: 'web_url'
    url: string
  }
  /** A maximum of 3 buttons per element is supported */
  buttons?: TemplateButton[]
}
```

Type TemplateButton is reference from [Buttons](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons)

#### .setIceBreakers(iceBreakers)
Set opening questions. A maximum of 4 questions can be set. See [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers).
| Params | Type | Default |
| -------- | -------- | -------- |
| iceBreakers | Array\<IceBreaker> | |

```ts
interface IceBreaker {
  question: string
  payload: string
}
```

#### .getIceBreakers()
Get current Ice Breakers. See [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers).

```ts
// Response
interface IceBreakerRes {
  data: {
    ice_breakers: IceBreaker[]
  }[]
}
```

#### .getUserProfile(userId [, fields])
Get Instagram user's profile information. See [User Profile](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
| Params | Type | Default |
| -------- | -------- | -------- |
| userID | string | |
| fields? | Array<"name" \| "profile_pci"> | ["name"] |

## Examples
See more demo from `./examples` directory. To run example files, make sure configure the `.env` file with Facebook's token.

##### watch mode in typescript
```bash
$ npm run dev
```

##### run it in javascript
```bash
$ npm run build
$ npm start
```