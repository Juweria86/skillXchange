"use client"

import { MessageSquare, CheckCircle, XCircle, Trash2, Eye } from "lucide-react"
import {Card} from "../ui/Card"
import Badge from "../ui/Badge"

export function DiscussionsTable({ discussions, onView, onApprove, onReject, onDelete }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">Discussion</th>
              <th className="py-3 px-4">Tags</th>
              <th className="py-3 px-4">Replies</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discussions.map((discussion) => (
              <DiscussionRow
                key={discussion.id}
                discussion={discussion}
                onView={onView}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{" "}
          <span className="font-medium">28</span> discussions
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </Card>
  )
}

function DiscussionRow({ discussion, onApprove, onReject, onView, onDelete }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div>
          <p className="font-medium text-gray-900">{discussion.title}</p>
          <p className="text-xs text-gray-500">
            by {discussion.author.name} • {discussion.time}
          </p>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {discussion.tags.map((tag, index) => (
            <Badge key={index} variant={tag.variant} small>
              {tag.name}
            </Badge>
          ))}
        </div>
      </td>
      <td className="py-3 px-4 text-sm">
        <div className="flex items-center gap-1">
          <MessageSquare size={14} className="text-gray-500" />
          <span>{discussion.replies}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge
          variant={discussion.status === "approved" ? "green" : discussion.status === "pending" ? "yellow" : "red"}
        >
          {discussion.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onView(discussion.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="View Discussion"
          >
            <Eye size={16} />
          </button>
          {discussion.status === "pending" && (
            <>
              <button
                onClick={() => onApprove(discussion.id)}
                className="p-1 text-gray-500 hover:text-green-600 rounded-md hover:bg-gray-100"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => onReject(discussion.id)}
                className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => onDelete(discussion.id)}
            className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
            title="Delete Discussion"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}