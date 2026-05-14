const Login = ({ username, password, handleLogin, setPassword, setUsername }) => {
  const submit = (event) => {
    event.preventDefault()
    handleLogin()
  }

  const onUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <div>
      <h2>Login in to application</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="">Username <input type="text" value={username} onChange={onUsernameChange} /></label>
        </div>
        <div>
          <label htmlFor="">Password <input type="password" value={password} onChange={onPasswordChange} /></label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login