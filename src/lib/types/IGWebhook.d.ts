// Declare Instagram webhook events
// https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook

interface MsgerBody {
  object: 'instagram'
  entry: {
    time: number
    id: string
    messaging: Array<MsgerEvent>
  }[]
}

type MsgerEvent = MsgerTextEvent | MsgerQuickReplyEvent | MsgerAttachmentsEvent | MsgerPostbackEvent

interface MsgerEventBase {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
}

interface MsgerTextEvent extends MsgerEventBase {
  message: {
    mid: string
    text: string
    is_echo?: boolean
  }
}

interface MsgerQuickReplyEvent extends MsgerEventBase {
  message: {
    mid: string
    text: string
    quick_reply: { payload: string }
    is_echo?: boolean
  }
}

interface MsgerAttachmentsEvent extends MsgerEventBase {
  message: {
    mid: string
    attachments: {
      type: 'image' | 'story_mention'
      payload: { url: string }
    }[]
    is_echo?: boolean
  }
}

interface MsgerPostbackEvent extends MsgerEventBase {
  postback: {
    mid: string
    title: string
    payload: string
  }
}
