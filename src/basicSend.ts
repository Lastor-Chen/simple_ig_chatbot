import type { IGSender } from "./lib"

export async function basicSend(event: MsgerPostbackEvent, sender: IGSender) {
  const senderMsg = event.postback.title
  const senderId = event.sender.id

  // 文字訊息
  const user = await sender.getUserProfile(event.sender.id)
  await sender.sendText(senderId, `${user?.name} chose: ${senderMsg}`)

  // 圖片
  await sender.sendAttachment(
    senderId,
    'image',
    'https://i.gyazo.com/5f23b5bfdf8f11078275bc0a954471c2.png'
  )

  // Buttons
  await sender.sendTemplate(senderId, [
    {
      title: 'Template',
      subtitle: '副標題',
      image_url: 'https://via.placeholder.com/150x100',
      buttons: [
        {
          type: 'web_url',
          title: '按鈕A',
          url: 'https://www.google.com',
        },
        {
          type: 'postback',
          title: '按鈕B',
          payload: '測試',
        },
      ],
    },
  ])

  // quick reply text
  await sender.sendText(senderId, '快速回覆', [
    '按鈕A',
    { title: '按鈕B', payload: 'testB' },
    { title: '按鈕C', payload: 'customQR' },
  ])
}