import { useParam } from "@blitzjs/next"
import { invoke, useQuery } from "@blitzjs/rpc"
import {
  Alert,
  AlertColor,
  Box,
  Container,
  List,
  ListItem,
  Snackbar,
  Typography,
} from "@mui/material"
import { useUser } from "app/auth/hooks/useUser"
import Layout from "app/core/layouts/Layout"
import createCut from "app/cuts/mutations/createCut"
import getCuts from "app/cuts/queries/getCuts"
import getEvent from "app/events/queries/getEvent"
import verify from "app/events/queries/verify"
import { buildTicketMessage } from "app/events/utils/buildTicketMessage"
import { getAddress, verifyMessage } from "ethers/lib/utils"
import { useRouter } from "next/router"
import { ReactElement, Suspense, useEffect, useState } from "react"
import { QrReader } from "react-qr-reader"
import { Address } from "wagmi"

type VerifyState = "Verifying" | "Passed" | "Failed" | "Warning" | null
const VerifyStateToSeverity = {
  Verifying: "info",
  Passed: "success",
  Failed: "error",
  Warning: "warning",
}

function EventManagePage(): ReactElement {
  const router = useRouter()
  const eventId = useParam("eventId", "number")
  const { isLogedIn, isLogining, startLogin, user } = useUser()
  const [event] = useQuery(
    getEvent,
    { id: eventId, user },
    {
      refetchOnWindowFocus: false,
    }
  )
  const [verifyState, setVerifyState] = useState<VerifyState>(null)
  const [message, setMessage] = useState("")
  const [scanResult, setScanResult] = useState("")
  const [verifying, setVerifying] = useState("")
  const [address, setAddress] = useState("")
  const [cuts] = useQuery(getCuts, { address, eventId, user })

  useEffect(() => {
    if (!isLogedIn && !isLogining) startLogin()
  }, [isLogedIn, isLogining, startLogin])

  useEffect(() => {
    if (isLogedIn && user?.address !== event?.owner)
      router
        .push("/manange")
        .then(() => {})
        .catch(() => {})
  }, [event?.owner, isLogedIn, router, user?.address])

  useEffect(() => {
    if (!scanResult) return
    if (verifying === scanResult) return

    async function process() {
      setVerifying(scanResult)
      if (!scanResult.match(/0x[0-9a-zA-Z]{40},0x[0-9a-fA-F]+/)) {
        setVerifyState("Failed")
        setMessage("Not a valid ticket")
        return
      }
      const [address, signature] = scanResult.split(",")
      setAddress(address!)
      const message = buildTicketMessage(
        address as Address,
        event!.name,
        event!.tokenAddress as Address
      )
      try {
        if (getAddress(verifyMessage(message, signature!)) !== getAddress(address!)) {
          setVerifyState("Failed")
          setMessage("Signature invalid")
          return
        }
      } catch (err) {
        console.log(err)
        setVerifyState("Failed")
        setMessage("Signature invalid")
        return
      }

      setVerifyState("Verifying")
      setMessage("Verifying")

      const verifyResult = await invoke(verify, { address, user, eventId })
      if (!verifyResult) {
        setVerifyState("Failed")
        setMessage("Not eligible")
        return
      }

      const createCutResult = await invoke(createCut, { eventId, address, user })
      if (createCutResult) {
        setVerifyState("Passed")
        setMessage(`Cut ticket for ${address}`)
        return
      } else {
        setVerifyState("Warning")
        setMessage("Ticket is valid but unable to cut ticket, be aware of reusing")
      }
    }
    process()
      .then(() => {})
      .catch(() => {})
  }, [event, eventId, scanResult, user, verifyState, verifying])

  return (
    <Box
      maxWidth="sm"
      sx={{
        margin: "0 auto 1rem",
      }}
    >
      {event && isLogedIn ? (
        <>
          <Typography variant="h4" component="h2">
            Verify for {event.name}
          </Typography>
          <QrReader
            onResult={(res) => {
              if (res && res.getText() && scanResult !== res.getText()) {
                setScanResult(res.getText())
              }
            }}
            constraints={{ facingMode: "user" }}
          />
          <Typography variant="h6" component="h3">
            Cut Records
          </Typography>
          <List>
            {cuts.map((cut) => (
              <ListItem key={`cut-${cut.id}`}>{cut.createdAt.toLocaleString()}</ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography variant="h4" component="h2">
          Please login to continue
        </Typography>
      )}

      <Snackbar open={!!verifyState} autoHideDuration={6000} onClose={() => setVerifyState(null)}>
        <Alert
          onClose={() => setVerifyState(null)}
          severity={(verifyState ? VerifyStateToSeverity[verifyState] : "info") as AlertColor}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

const ShowEventManagePage = () => {
  return (
    <Container sx={{ paddingTop: "2rem" }}>
      <Suspense fallback={<div>Loading</div>}>
        <EventManagePage />
      </Suspense>
    </Container>
  )
}

ShowEventManagePage.getLayout = (page) => <Layout title="Manage Event">{page}</Layout>

export default ShowEventManagePage
