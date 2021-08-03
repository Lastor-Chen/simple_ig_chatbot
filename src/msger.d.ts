interface MsgerBody {
  object: 'instagram'
  entry: {
    time: number
    id: string
    messaging: MsgerEvent[]
  }[]
}

interface MsgerEvent {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message: {
    mid: string
    text: string
    is_echo?: boolean
    quick_reply?: { payload: string }
  }
}

// Send API
// =================

/**
 * Facebook SendAPI
 * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/send-api Send API}
 * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
 */
interface SendAPI {
  messaging_type: 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG'
  recipient: { id: string }
  message: {}
}

/**
 * ```
 * message: {
 *   text: string
 *   quick_replies?: QuickReply[]
 * }
 * ```
 * @see {@link SendAPI}
 * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
 */
interface TextMsg extends SendAPI {
  message: {
    text: string
    quick_replies?: QuickReply[]
  }
}

/** @see {@link SendAPI} */
interface AttachmentMsg extends SendAPI {
  message: {
    attachment: Attachment
  }
}

type Attachment = AttachmentImage | AttachmentHeart | AttachmentShare
type AttachmentType = 'image' | 'like_heart' | 'media_share'

interface AttachmentImage {
  type: 'image'
  payload: { url: string }
}

interface AttachmentHeart {
  type: 'like_heart'
}

/** 用法待確認 */
interface AttachmentShare {
  type: 'media_share'
  payload: { id: string }
}

/**
 * Facebook Quick Replies
 * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
 * @see {@link SendAPI}
 */
interface QuickReply {
  content_type?: 'text'
  title: string
  payload: string
  image_url?: string
}
