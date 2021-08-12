// Reusable messages

export const opening: TemplateElement[] = [
  {
    title: 'Please choose one to demo Instagram Messaging API',
    buttons: [
      {
        type: 'postback',
        title: 'Basic Sending',
        payload: 'basic_send',
      },
      {
        type: 'postback',
        title: 'Manual Conversation',
        payload: 'manual_conversation',
      },
      {
        type: 'postback',
        title: 'Routeful Conversation',
        payload: 'routeful_conversation',
      },
    ],
  },
]