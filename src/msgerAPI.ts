import axios from 'axios'

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const graphAPI = axios.create({
  baseURL: 'https://graph.facebook.com/v11.0/me/messages',
  params: { access_token: PAGE_ACCESS_TOKEN },
})

const msgerAPI = {
  async sendText(senderId: string, text: string, quickReplies?: Array<string | quickReply>) {
    try {
      const data: textMsg = {
        messaging_type: 'RESPONSE',
        recipient: { id: senderId },
        message: { text: text },
      }

      const newQuickReplies = quickReplies?.map((reply): quickReply => {
        if (typeof reply === 'string') {
            // payload 只允許英數字
            const normalizeString = reply.replace(/[^\w]+/g, '')
            return {
              content_type: 'text',
              title: reply,
              payload: `QR_${normalizeString}`,
            }
          }else {
            const normalizeString = reply.title.replace(/[^\w]+/g, '')
            return {
              content_type: 'text',
              payload: `QR_${normalizeString}`,
              ...(reply as { title: string }),
            }
          }
        })

      if (newQuickReplies) { data.message.quick_replies = newQuickReplies }

      await graphAPI.post('/', data)
    } catch (e) {
      console.log(e.response?.data || e.message)
    }
  },

  async sendAttachment(senderId: string, url: string) {
    try {
      const data: attachmentMsg = {
        messaging_type: 'RESPONSE',
        recipient: { id: senderId },
        message: {
          attachment: {
            type: 'image',
            payload: { url },
          },
        },
      }

      await graphAPI.post('/', data)
    } catch (e) {
      console.log(e.response?.data || e.message)
    }
  },
}



export default msgerAPI