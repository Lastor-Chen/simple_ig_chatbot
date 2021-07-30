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
  }
}
