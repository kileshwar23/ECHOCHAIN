import api from './axios'

// Dashboard
export const getDashboard = () => api.get('/admin/dashboard')

// Requests
export const getAllRequests = (status) => api.get('/admin/requests', { params: status ? { status } : {} })
export const updateRequestStatus = (id, status) => api.patch(`/admin/requests/${id}/status`, null, { params: { status } })
export const assignSchedule = (requestId, scheduleId) => api.patch(`/admin/requests/${requestId}/assign-schedule/${scheduleId}`)

// Schedules
export const createSchedule = (data) => api.post('/admin/schedules', data)
export const getAllSchedules = () => api.get('/admin/schedules')
export const updateSchedule = (id, data) => api.put(`/admin/schedules/${id}`, data)
export const updateScheduleStatus = (id, status) => api.patch(`/admin/schedules/${id}/status`, null, { params: { status } })
export const deleteSchedule = (id) => api.delete(`/admin/schedules/${id}`)

// Complaints
export const getAllComplaints = (status) => api.get('/admin/complaints', { params: status ? { status } : {} })
export const resolveComplaint = (id, response, status) => api.patch(`/admin/complaints/${id}/resolve`, null, { params: { response, status } })

// Users
export const getAllUsers = () => api.get('/admin/users')
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, null, { params: { role } })
