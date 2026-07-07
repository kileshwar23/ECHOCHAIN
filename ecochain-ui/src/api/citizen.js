import api from './axios'

// Pickup Requests
export const submitRequest = (data) => api.post('/citizen/requests', data)
export const getMyRequests = () => api.get('/citizen/requests')
export const cancelRequest = (id) => api.patch(`/citizen/requests/${id}/cancel`)

// Complaints
export const fileComplaint = (data) => api.post('/citizen/complaints', data)
export const getMyComplaints = () => api.get('/citizen/complaints')

// Schedules
export const getSchedules = () => api.get('/citizen/schedules')

// Profile
export const getProfile = () => api.get('/citizen/profile')
export const updateProfile = (data) => api.put('/citizen/profile', data)
export const changePassword = (data) => api.patch('/citizen/profile/change-password', data)
