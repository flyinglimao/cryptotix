import { Box, Button, Modal, Typography } from "@mui/material"
import { getAddress } from "ethers/lib/utils"
import { ReactElement, useEffect, useState } from "react"
import { Address, useAccount, useConnect, useSignMessage } from "wagmi"
import { QRCodeSVG } from "qrcode.react"
import { useResizeDetector } from "react-resize-detector"
import styled from "@emotion/styled"
import { useQuery } from "@blitzjs/rpc"
import verify from "app/events/queries/verify"
import { buildTicketMessage } from "../utils/buildTicketMessage"
import { EncryptTicketModal } from "./EncryptTicketModal"

const QRCodeDisplay = styled.div`
  svg {
    display: block;
    margin: 0 auto;
  }
  text-align: center;
`

interface TicketIssuerProps {
  name: string
  eventId: number
  password?: string
}

export function TicketIssuer({ name, eventId, password }: TicketIssuerProps): ReactElement {
  const { width, ref } = useResizeDetector()
  const { address, isConnected } = useAccount()
  const checksumAddress = address ? getAddress(address) : ""
  const { connect, connectors, isLoading, pendingConnector } = useConnect()
  const { data: signature, signMessage } = useSignMessage({
    message: address ? buildTicketMessage(address, name, eventId) : "",
  })
  const [showConnect, setShowConnect] = useState(false)
  const [openEncryptModal, setOpenEncryptModal] = useState(false)
  const [result, { isLoading: isVerifying }] = useQuery(verify, {
    eventId,
    address,
    password,
  })

  useEffect(() => {
    if (isConnected) setShowConnect(false)
  }, [isConnected])

  const payload = [checksumAddress, signature].join(",")

  return (
    <Box sx={{ padding: "1rem 0", svg: { maxWidth: "100%", margin: "1rem 0" } }} ref={ref}>
      {!isConnected ? (
        <Button variant="contained" onClick={() => setShowConnect(true)}>
          Connect Wallet
        </Button>
      ) : isVerifying ? (
        <Typography variant="body1">Loading...</Typography>
      ) : result ? (
        !signature ? (
          <Button variant="contained" onClick={() => signMessage()}>
            Sign Message to Issue a Ticket
          </Button>
        ) : (
          <QRCodeDisplay>
            <QRCodeSVG value={payload} size={width && Math.min(400, width)} />
            <Button
              variant="outlined"
              sx={{ marginTop: "1rem" }}
              onClick={() => setOpenEncryptModal(true)}
            >
              Encrypt and Generate URL
            </Button>
          </QRCodeDisplay>
        )
      ) : (
        <Typography variant="body1">Not eligible</Typography>
      )}
      <Modal open={showConnect} onClose={() => setShowConnect(false)}>
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
          <Typography variant="h6">Connect with</Typography>
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
        </Box>
      </Modal>
      <EncryptTicketModal
        payload={payload}
        open={openEncryptModal}
        onClose={() => setOpenEncryptModal(false)}
      />
    </Box>
  )
}
