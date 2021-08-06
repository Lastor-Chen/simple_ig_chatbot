interface UserState {
  id: string
  step: string
  data: {
    race?: string
    job?: string
    gender?: string
  }
}

const users: UserState[] = []

export { users }
