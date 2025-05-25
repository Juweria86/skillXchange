import { Check, CheckCheck } from "lucide-react"


function MessagesList({ messages, userId }) {
  return (
    <div>
      {messages.map((msg) => (
        <MessageBubble key={msg._id} message={msg} currentUserId={userId} />
      ))}
    </div>
  )
}

// MessageBubble Component
export default function MessageBubble({ message, currentUserId }) {
  // Normalize the sender ID regardless of whether it's a string or object
  const senderId = typeof message.sender === "object" && message.sender !== null ? message.sender._id : message.sender
  const isFromMe = String(senderId) === String(currentUserId)

  console.log("senderId:", senderId, "currentUserId:", currentUserId, "isFromMe:", isFromMe)

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex ${isFromMe ? "justify-end" : "justify-start"} mb-3`}>
      {!isFromMe && (
        <div className="mr-2 self-end">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            {/* You can add the sender's avatar here if available */}
          </div>
        </div>
      )}
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
          isFromMe ? "bg-[#4a3630] text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none shadow-sm"
        }`}
      >
        <p>{message.text}</p>
        <div
          className={`text-xs mt-1 flex items-center justify-end gap-1 ${isFromMe ? "text-gray-300" : "text-gray-500"}`}
        >
          <span>{formattedTime}</span>
          {isFromMe && (
            <>
              {message.status === "sent" && <Check size={12} />}
              {message.status === "delivered" && <Check size={12} />}
              {message.status === "read" && <CheckCheck size={12} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
