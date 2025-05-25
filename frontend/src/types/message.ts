export interface Message {
  _id: string
  sender:
    | string
    | {
        _id: string
        name: string
        email: string
      }
  receiver:
    | string
    | {
        _id: string
        name: string
        email: string
      }
  text: string
  createdAt: string
  status: "sent" | "delivered" | "read"
}

export interface Chat {
  id: string
  user: {
    _id: string
    name: string
    avatar?: string
    online: boolean
  }
  lastMessage: {
    text: string
    time: string
    isRead: boolean
    sender: "you" | "them"
  }
  unread: number
}
