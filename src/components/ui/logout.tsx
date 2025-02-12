import {logout} from "@/lib/action"

export default function LogoutPage() {
  return(
    <button onClick={logout} style={{width:"10px",aspectRatio:'1/  1'}}>Log out</button>
  )
}