// Declare Instagram webhook events
// https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook

interface MsgerBody {
  object: 'instagram'
  entry: {
    time: number
    id: string
    messaging: Array<MsgerEventType>
  }[]
}

interface MsgerEvent {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
}

type MsgerEventType =
  | MsgerTextEvent
  | MsgerQuickReplyEvent
  | MsgerAttachmentsEvent
  | MsgerPostbackEvent

interface MsgerTextEvent extends MsgerEvent {
  message: {
    mid: string
    text: string
    is_echo?: boolean
  }
}

interface MsgerQuickReplyEvent extends MsgerEvent {
  message: {
    mid: string
    text: string
    quick_reply: { payload: string }
    is_echo?: boolean
  }
}

interface MsgerAttachmentsEvent extends MsgerEvent {
  message: {
    mid: string
    attachments: {
      type: 'image' | 'story_mention'
      payload: { url: string }
    }[]
    is_echo?: boolean
  }
}

interface MsgerPostbackEvent extends MsgerEvent {
  postback: {
    mid: string
    title: string
    payload: string
  }
}
