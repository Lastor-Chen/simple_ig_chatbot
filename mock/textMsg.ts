/// <reference types="../src/msger" />
import axios from 'axios'

function textMsg(text: string): msgerBody {
  return {
    "object": "instagram",
    "entry": [
      {
        "time": 0,
        "id": "000",
        "messaging": [
          {
            "sender": { "id": "mock" },
            "recipient": { "id": "recipient" },
            "timestamp": 0,
            "message": {
              "mid": "mid",
              "text": text,
            },
          },
        ],
      },
    ],
  }
}

const text = textMsg('text msg')

axios.post('http://localhost:3000/webhook', text).then((res) => {
  if (res.status === 200) {
    console.log(res.data)
    process.exit()
  }
})

console.log('send text message.')
