import axios from 'axios'

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const graphAPI = axios.create({
  baseURL: 'https://graph.facebook.com/v11.0/me/messages',
  params: { access_token: PAGE_ACCESS_TOKEN },
})

const msgerAPI = {
  async sendText(
    senderId: string,
    text: string,
    quickReplies?: Array<string | QuickReply>
  ) {
    try {
      const data: TextMsg = {
        messaging_type: 'RESPONSE',
        recipient: { id: senderId },
        message: { text: text },
      }

      if (quickReplies?.length) {
        const newQuickReplies = this.formatQuickReplies(quickReplies)
        data.message.quick_replies = newQuickReplies
      }

      await graphAPI.post('/', data)
    } catch (e) {
      console.log(e.response?.data || e.message)
    }
  },

  /** 將 string 整理成 QuickReply 格式 */
  formatQuickReplies(quickReplies: Array<string | QuickReply>) {
    return quickReplies?.map((reply): QuickReply => {
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
  },

  async sendAttachment(senderId: string, type: AttachmentType, url: string) {
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
        recipient: { id: senderId },
        message: { attachment },
      }

      await graphAPI.post('/', data)
    } catch (e) {
      console.log(e.response?.data || e.message)
    }
  },
}



export default msgerAPI