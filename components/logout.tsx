
import { logout } from '@/actions/auth'
import { Button } from './ui/button'

export default function Logout() {
  return (
    <Button formAction={logout} variant="outline">Logout</Button>
  )
}
