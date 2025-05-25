"use client"

import { Edit, Trash2, Eye } from "lucide-react"
import {Card} from "../ui/Card"
import Badge from "../ui/Badge"
import Avatar from "../ui/Avatar"

export function UsersTable({ users, onView, onEdit, onDelete }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
          <span className="font-medium">42</span> users
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

function UserRow({ user, onEdit, onDelete, onView }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} size="sm" fallback={user.name.charAt(0)} />
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge variant={user.role === "admin" ? "purple" : "blue"}>{user.role}</Badge>
      </td>
      <td className="py-3 px-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="py-3 px-4">
        <Badge variant={user.status === "active" ? "green" : "yellow"}>{user.status}</Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => onView(user.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="View Profile"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(user.id)}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            title="Edit User"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-1 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
            title="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}