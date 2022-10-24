import { Box, Button, Modal, Typography } from "@mui/material"
import { getAddress, verifyMessage } from "ethers/lib/utils"
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Address, useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi"
import { buildLoginMessage } from "../utils/buildLoginMessage"
import { Loading } from "components/Loading"
import { useRouter } from "next/router"

interface AuthenticatedUser {
  address: Address
  signature: string
  expireAt: Date
}

export interface LoginModalContextType {
  startLogin: () => void
  stopLogin: () => void
  isLogining: boolean
  isLogedIn: boolean
  logout: () => void
  user?: AuthenticatedUser
}

export const LoginModalContext = createContext<LoginModalContextType>({
  startLogin: () => {},
  stopLogin: () => {},
  isLogining: false,
  isLogedIn: false,
  logout: () => {},
  user: undefined,
})

function LoginModal(): ReactElement {
  const { isConnected } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { isLogining, stopLogin } = useContext(LoginModalContext)

  return (
    <Modal
      open={isLogining}
      onClose={() => stopLogin()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          Button: {
            width: "100%",
            marginBottom: ".25rem",
          },
        }}
      >
        {isConnected ? (
          <>
            <Typography id="login-modal-title" variant="h6" component="h2">
              Please sign the message to login
            </Typography>
            <Loading style={{ margin: "1rem auto", display: "block" }} />
          </>
        ) : (
          <>
            <Typography id="login-modal-title" variant="h6" component="h2">
              Login with
            </Typography>
            {connectors.map((connector) => (
              <Button
                variant="outlined"
                disabled={!connector.ready}
                key={connector.id}
                onClick={() => connect({ connector })}
              >
                {connector.name}
                {isLoading && pendingConnector?.id === connector.id && " (connecting)"}
              </Button>
            ))}
          </>
        )}
      </Box>
    </Modal>
  )
}

export function LoginModalProvider({ children }: PropsWithChildren<{}>): ReactElement {
  const router = useRouter()
  const { connector, address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [show, setShow] = useState(false)
  const [expireAt, setExpireAt] = useState(new Date(0))
  const {
    data: signature,
    signMessage,
    reset: resetSignature,
    isError,
  } = useSignMessage({
    message: address ? buildLoginMessage(address, expireAt) : "",
  })

  const isLogedIn = useMemo(
    () =>
      !!(
        address &&
        signature &&
        address === getAddress(verifyMessage(buildLoginMessage(address, expireAt), signature))
      ),
    [address, expireAt, signature]
  )

  useEffect(() => {
    const logoutTimeout = window.setTimeout(() => {
      setExpireAt(new Date(0))
    }, expireAt.getTime() - new Date().getTime())

    return clearTimeout(logoutTimeout)
  }, [expireAt])

  useEffect(() => {
    if (address && connector && isConnected && !signature && expireAt.getTime()) {
      return signMessage()
    }
  }, [address, connector, expireAt, isConnected, setShow, signMessage, signature])

  useEffect(() => {
    if (isError) setShow(false)
  }, [isError])

  useEffect(() => {
    if (!signature) return
    setShow(false)
    router
      .push("/manage")
      .then(() => {})
      .catch(() => {})
  }, [router, signature])

  const user =
    address && signature && expireAt
      ? {
          address,
          signature,
          expireAt,
        }
      : undefined

  return (
    <LoginModalContext.Provider
      value={{
        isLogining: show,
        startLogin: () => {
          setShow(true)
          setExpireAt(new Date(new Date().getTime() + 4 * 60 * 1000))
        },
        stopLogin: () => setShow(false),
        isLogedIn,
        logout: () => {
          disconnect()
          setExpireAt(new Date(0))
          resetSignature()
        },
        user,
      }}
    >
      {children}
      <LoginModal />
    </LoginModalContext.Provider>
  )
}
