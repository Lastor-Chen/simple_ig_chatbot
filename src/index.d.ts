interface message {
  sender: { id: string }
  recipient: { id: string }
  timestamp: number
  message: { mid: string; text: string; is_echo?: boolean }
}
