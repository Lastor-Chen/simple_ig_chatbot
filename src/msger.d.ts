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

/**
 * IG Generic Template
 * @see {@link SendAPI}
 */
interface TemplateMsg extends SendAPI {
  message: {
    attachment: {
      type: 'template'
      payload: {
        template_type: 'generic'
        /** 最大 10 個, 除了 title 之外, 至少需再設置一個屬性 */
        elements: TemplateElement[]
      }
    }
  }
}

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
  buttons?: ButtonType[]
}

type ButtonType =
  | URLButton
  | PostbackButton
  | CallButton
  | LoginButton
  | LoginButton
  | GamePlayButton

interface URLButton {
  type: 'web_url'
  title: string
  url: string
}

interface PostbackButton {
  type: 'postback'
  title: string
  payload: string
}

interface CallButton {
  type: 'phone_number'
  title: string
  /** phone number */
  payload: string
}

interface LoginButton {
  type: 'account_link'
  url: string
}

interface LoginButton {
  type: 'account_unlink'
}

interface GamePlayButton {
  type: 'game_play'
  title: string
  /**  This data will be sent to the game */
  payload: string
  /** Only one of the below */
  game_metadata: {
    player_id: string
    context_id: string
  }
}