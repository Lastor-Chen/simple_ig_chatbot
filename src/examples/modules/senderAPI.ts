import { IGSender } from '@/lib'

const sender = new IGSender(process.env.PAGE_ACCESS_TOKEN!)

export { sender }