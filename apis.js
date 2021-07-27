const axios = require('axios').default

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN
const FB_GRAPH_API = 'https://graph.facebook.com/v11.0/me/messages'

module.exports = {
  async sendAPI(sender_psid, msg) {
    try {
      await axios.post(FB_GRAPH_API, {
        recipient: { id: sender_psid },
        message: {
          text: msg,
        }
      }, {
        params: { access_token: PAGE_ACCESS_TOKEN }
      })
    } catch (e) {
      console.log(e.response?.data || e.message)
    }
  }
}