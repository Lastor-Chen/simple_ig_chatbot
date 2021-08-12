import { IGReceiver } from '@/lib'

export const receiver = new IGReceiver({
  verifyToken: process.env.VERIFY_TOKEN!,
  appSecret: process.env.APP_SECRET!,
})