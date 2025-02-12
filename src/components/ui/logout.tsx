import {logout} from "@/lib/action"

export default function LogoutPage() {
  return(
    <button onClick={logout}>Log out</button>
  )
}