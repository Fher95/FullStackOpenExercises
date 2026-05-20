import axios from 'axios'
const baseUrl = '/api/blogs'
let token = ''

const setToken = (newToken) => {
  token = newToken
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const save = async (blogData) => {
  const request = await axios.post(baseUrl, blogData, { headers: { Authorization: `Bearer ${token}` } })
  return request.data
}

const update = async (id, blogData) => {
  const request = await axios.put(`${baseUrl}/${id}`, blogData, { headers: { Authorization: `Bearer ${token}` } })
  return request.data
}

const remove = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return request
}

export default { getAll, save, setToken, update, remove }