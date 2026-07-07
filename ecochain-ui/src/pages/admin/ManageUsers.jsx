import { useEffect, useState } from 'react'
import { getAllUsers, deleteUser, updateUserRole } from '../../api/admin'
import StatusBadge from '../../components/StatusBadge'
import { useAuth } from '../../context/AuthContext'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()

  const load = () => getAllUsers().then(r => setUsers(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    await deleteUser(id)
    load()
  }

  const handleRole = async (id, role) => {
    await updateUserRole(id, role)
    load()
  }

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Role</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Requests</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Joined</th>
              <th className="px-4 py-3 text-left text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id} className={`hover:bg-gray-50 ${u.email === currentUser?.email ? 'bg-green-50' : ''}`}>
                <td className="px-4 py-3 font-medium text-gray-700">
                  {u.name}
                  {u.email === currentUser?.email && <span className="ml-2 text-xs text-green-600">(you)</span>}
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">{u.phone}</td>
                <td className="px-4 py-3"><StatusBadge status={u.role} /></td>
                <td className="px-4 py-3 text-center">{u.totalRequests}</td>
                <td className="px-4 py-3 text-gray-400">{u.createdAt?.split('T')[0]}</td>
                <td className="px-4 py-3">
                  {u.email !== currentUser?.email && (
                    <div className="flex gap-2">
                      <button onClick={() => handleRole(u.id, u.role === 'ADMIN' ? 'CITIZEN' : 'ADMIN')}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs">
                        {u.role === 'ADMIN' ? '→ Citizen' : '→ Admin'}
                      </button>
                      <button onClick={() => handleDelete(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
