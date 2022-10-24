import { LoginModalContext } from "app/auth/components/LoginModal"
import { useContext } from "react"

export function useUser() {
  return useContext(LoginModalContext)
}
