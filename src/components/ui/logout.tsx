import {logout} from "@/lib/action"

export default function LogoutPage() {
  return(
    <button onClick={logout} className="text-red-700">Log out</button>
  )
}