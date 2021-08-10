// 複用訊息

export const opening: TemplateElement[] = [
  {
    title: '請選擇',
    buttons: [
      {
        type: 'postback',
        title: '常用訊息範例',
        payload: 'basic_send',
      },
      {
        type: 'postback',
        title: '連續對話A',
        payload: 'convo',
      },
      {
        type: 'postback',
        title: '連續對話B',
        payload: 'convo_b'
      }
    ],
  },
]
