import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'
import { useQuery } from '@tanstack/react-query'
import { getUserInfo } from '../api/users.js'

export function Header() {
  const [token, setToken] = useAuth()

  const { sub } = token ? jwtDecode(token) : {}
  const userInfoQuery = useQuery({
    queryKey: ['users', sub],
    queryFn: () => getUserInfo(sub),
    enabled: Boolean(sub),
  })
  const userInfo = userInfoQuery.data

  if (token && userInfo) {
    /*const { sub } = jwtDecode(token)*/
    return (
      <div>
        <h1>Welcome to My Blog!</h1>
        Logged in as <User {...userInfo} />
        <br />
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }
  return (
    <div>
      <h1>Welcome to My Blog!</h1>
      <Link to='/login'>Login</Link> | <Link to='/signup'>Sign up</Link>
    </div>
  )
}
