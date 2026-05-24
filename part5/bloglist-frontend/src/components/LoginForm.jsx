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
      <form onSubmit={submit}>
        <div>
          <label>Username <input type="text" value={username} onChange={onUsernameChange} /></label>
        </div>
        <div>
          <label>Password <input type="password" value={password} onChange={onPasswordChange} /></label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login