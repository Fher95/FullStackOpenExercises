import { Alert } from '@mui/material'
const Notification = ({ notification }) => {
  if (!notification) return null
  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={notification.success ? 'success' : 'error'}>
      {notification.message}
    </Alert>
  )
}

export default Notification