import axios from 'axios'
import type { AxiosInstance } from 'axios'

/** Instagram Messaging sender API */
class IGSender {
  #accessToken: string
  graphAPI: AxiosInstance

  constructor(accessToken: string) {
    if (!accessToken) throw new Error('accessToken is required')
    this.#accessToken = accessToken
    this.graphAPI = this.#initAxios()
  }

  #initAxios() {
    return axios.create({
      baseURL: 'https://graph.facebook.com/v11.0',
      params: { access_token: this.#accessToken },
    })
  }

  #handleError(err: any): false {
    console.log(err.message)
    if (axios.isAxiosError(err)) {
      console.log(err.response?.data)
    }
    return false
  }

  /**
   * Send text message or quick replies. QuickReply payload is English and numbers only.
   * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/send-api#message Send Message API}
   * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
   * @see {@link https://developers.facebook.com/docs/messenger-platform/reference/buttons/quick-replies Quick Replies}
   */
  async sendText(
    receiver: string,
    text: string,
    quickReplies?: Array<string | QuickReply>
  ) {
    try {
      const body: TextMsg = {
        messaging_type: 'RESPONSE',
        recipient: { id: receiver },
        message: { text: text },
      }

      if (quickReplies?.length) {
        const newQuickReplies = this.#formatQuickReplies(quickReplies)
        body.message.quick_replies = newQuickReplies
      }

      const { status } = await this.graphAPI.post('/me/messages', body)
      return status === 200
    } catch (e) {
      return this.#handleError(e)
    }
  }

  /** Format string to QuickReply object, then remove non-English characters */
  #formatQuickReplies(quickReplies: Array<string | QuickReply>) {
    return quickReplies.map((reply): QuickReply => {
      if (typeof reply === 'string') {
        // payload 只允許英數字
        const normalizeString = reply.replace(/[^\w]+/g, '')
        return {
          content_type: 'text',
          title: reply,
          payload: `QR_${normalizeString}`,
        }
      } else {
        const normalizeString = reply.title.replace(/[^\w]+/g, '')
        return {
          content_type: 'text',
          payload: `QR_${normalizeString}`,
          ...(reply as { title: string }),
        }
      }
    })
  }

  /**
   * Send attachment. Attachment type is different from Messenger
   * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message Instagram Messaging}
   */
  async sendAttachment(receiver: string, type: AttachmentType, url: string = '') {
    try {
      let attachment: Attachment
      if (type === 'image') {
        attachment = { type, payload: { url } }
      } else if (type === 'like_heart') {
        attachment = { type }
      } else {
        attachment = { type, payload: { id: url } }
      }

      const data: AttachmentMsg = {
        messaging_type: 'RESPONSE',
        recipient: { id: receiver },
        message: { attachment },
      }

      const { status } = await this.graphAPI.post('/me/messages', data)
      return status === 200
    } catch (e) {
      return this.#handleError(e)
    }
  }

  /**
   * Send Template that supports a maximum of 10 elements per message and 3 buttons per element
   * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/generic-template Generic Template}
   * @see {@link https://developers.facebook.com/docs/messenger-platform/send-messages/buttons Buttons}
   */
  async sendTemplate(receiver: string, elements: TemplateElement[]) {
    try {
      const data: TemplateMsg = {
        messaging_type: 'RESPONSE',
        recipient: { id: receiver },
        message: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: elements,
            },
          },
        },
      }

      const { status } = await this.graphAPI.post('/me/messages', data)
      return status === 200
    } catch (e) {
      return this.#handleError(e)
    }
  }

  /**
   * Set opening questions. A maximum of 4 questions can be set
   * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#setting-ice-breakers Ice Breakers}
   */
  async setIceBreakers(iceBreakers: IceBreaker[]) {
    try {
      const body: IceBreakerSetting = {
        platform: 'instagram',
        ice_breakers: iceBreakers,
      }

      const { data } = await this.graphAPI.post('/me/messenger_profile', body, {
        params: { platform: 'instagram' },
      })
      if (data.result !== 'success') throw new Error('Set ice breakers failed')

      console.log('Set ice breakers is successful')
      return true
    } catch (e) {
      return this.#handleError(e)
    }
  }

  /**
   * Get current Ice Breakers
   * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers#getting-ice-breakers Ice Breakers}
   */
  async getIceBreakers() {
    try {
      const { data } = await this.graphAPI.get<IceBreakerRes>(
        '/me/messenger_profile',
        {
          params: {
            platform: 'instagram',
            fields: 'ice_breakers',
          },
        }
      )
      return data
    } catch (e) {
      this.#handleError(e)
    }
  }

  /**
   * Get Instagram user's profile information
   * @see {@link https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile User Profile}
   */
  async getUserProfile(userId: string, fields?: Array<'name' | 'profile_pci'>) {
    try {
      // Remove the same field
      const fieldSet = new Set(fields)

      const { data } = await this.graphAPI.get<{
        id: string
        name?: string
        profile_pic?: string
      }>(`/${userId}`, {
        params: {
          fields: [...fieldSet].join(',') || 'name',
        },
      })

      return data
    } catch (e) {
      this.#handleError(e)
    }
  }
}

export default IGSender
