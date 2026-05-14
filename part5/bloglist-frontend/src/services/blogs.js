import axios from 'axios'
const baseUrl = '/api/blogs'
let token = ''

const setToken = (newToken) => {
  token = newToken;
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const save = async (blogData) => {
  const request = await axios.post(baseUrl, blogData, { headers: { Authorization: `Bearer ${token}` } })
  return request.data
}

export default { getAll, save, setToken }