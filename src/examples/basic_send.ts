import { sender } from '@/examples/apis/senderAPI'

export async function basicSend(event: MsgerPostbackEvent) {
  const sid = event.sender.id
  const [_, val] = event.postback.payload.split(':')

  if (!val) {
    sender.sendTemplate(sid, [
      {
        title: 'Message',
        subtitle: 'To send a basic text message or http link',
        image_url: 'https://via.placeholder.com/150x100',
        buttons: [
          {
            type: 'postback',
            title: 'Text',
            payload: 'basic_send:text',
          },
          {
            type: 'postback',
            title: 'Link',
            payload: 'basic_send:text_link',
          },
        ],
      },
      {
        title: 'Attachment',
        subtitle: 'The Instagram Messaging allows you to attach assets to messages, including images and like-heart',
        image_url: 'https://via.placeholder.com/150x100',
        buttons: [
          {
            type: 'postback',
            title: 'Image',
            payload: 'basic_send:image',
          },
          {
            type: 'postback',
            title: 'Like Heart',
            payload: 'basic_send:like_heart',
          },
        ],
      },
      {
        title: 'Quick Replies',
        subtitle: 'Quick replies provide a way to present a set of buttons in-conversation for users to reply with',
        image_url: 'https://via.placeholder.com/150x100',
        buttons: [
          {
            type: 'postback',
            title: 'Quick Replies',
            payload: 'basic_send:quick_replies',
          },
        ],
      },
      {
        title: 'Generic Template',
        subtitle:
          'The generic template allows you to send a structured message that includes an image, text and buttons',
        image_url: 'https://via.placeholder.com/150x100',
        buttons: [
          {
            type: 'web_url',
            title: 'Web Link (Google)',
            url: 'https://www.google.com',
          },
          {
            type: 'postback',
            title: 'Buttons',
            payload: 'basic_send:template',
          },
        ],
      },
    ])
  } else if (val === 'text') {
    const senderMsg = event.postback.title
    const user = await sender.getUserProfile(event.sender.id)
    sender.sendText(sid, `Morning ${user?.name}! Nice day for fishing ain't it!`)
  } else if (val === 'text_link') {
    sender.sendText(sid, 'https://www.google.com')
  } else if (val === 'image') {
    sender.sendAttachment(sid, 'image', 'https://i.gyazo.com/5f23b5bfdf8f11078275bc0a954471c2.png')
  } else if (val === 'like_heart') {
    sender.sendAttachment(sid, 'like_heart')
  } else if (val === 'quick_replies') {
    sender.sendText(sid, 'Quick Replies', [
      'Button A',
      { title: 'Button B', payload: 'null' },
      { title: 'Button C', payload: 'null' },
    ])
  } else if (val === 'template') {
    sender.sendTemplate(sid, [
      {
        title: 'Generic Template',
        subtitle:
          'The generic template allows you to send a structured message that includes an image, text and buttons',
        image_url: 'https://via.placeholder.com/150x100',
        buttons: [
          {
            type: 'web_url',
            title: 'Web Link (Google)',
            url: 'https://www.google.com',
          },
          {
            type: 'postback',
            title: 'Buttons',
            payload: 'null',
          },
        ],
      },
    ])
  }
}
