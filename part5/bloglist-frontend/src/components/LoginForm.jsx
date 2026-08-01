import { TextField, Button } from '@mui/material'
const Login = ({ username, password, handleSubmit, handlePasswordChange, handleUsernameChange }) => {
  const submit = (event) => {
    event.preventDefault()
    handleSubmit()
  }

  const onUsernameChange = (event) => {
    handleUsernameChange(event.target.value)
  }

  const onPasswordChange = (event) => {
    handlePasswordChange(event.target.value)
  }

  return (
    <div>
      <h2>Login in to application</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <TextField label="Username" value={username} onChange={onUsernameChange} variant="standard" />
        <TextField label="Password" type="password" value={password} onChange={onPasswordChange} variant="standard" />
        <Button type="submit" variant="contained" color="primary">login</Button>
      </form>
    </div>
  )
}

export default Login