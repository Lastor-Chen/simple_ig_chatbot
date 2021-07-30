interface msgerBody {
  object: 'instagram'
  entry: {
    time: number
    id: string
    messaging: msgerEvent[]
  }[]
}

interface msgerEvent {
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
interface sendAPI {
  messaging_type: 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG'
  recipient: { id: string }
  message: {}
}

/**
 * ```
 * message: {
 *   text: string
 *   quick_replies?: quickReply[]
 * }
 * ```
 * @see {@link sendAPI}
 * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
 */
interface textMsg extends sendAPI {
  message: {
    text: string
    quick_replies?: quickReply[]
  }
}

/** @see {@link sendAPI} */
interface attachmentMsg extends sendAPI {
  message: {
    attachment: {
      type: 'image' | 'audio' | 'video' | 'file'
      payload: {
        url: string
        is_reusable?: boolean
      }
    }
  }
}

/**
 * Facebook Quick Replies
 * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
 * @see {@link sendAPI}
 */
interface quickReply {
  content_type?: 'text' | 'user_phone_number' | 'user_email'
  title: string
  payload: string
  image_url?: string
}
