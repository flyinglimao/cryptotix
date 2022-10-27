import styled from "@emotion/styled"
import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { QRCodeSVG } from "qrcode.react"
import { ReactElement, useCallback, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"

const QRCodeDisplay = styled.div`
  svg {
    display: block;
    margin: 0 auto 1rem;
  }
  text-align: center;
`

export function EncryptTicketModal({
  payload,
  open,
  onClose,
}: {
  payload: string
  open: boolean
  onClose: () => any
}): ReactElement {
  const [password, setPassword] = useState("")
  const [encrypted, setEncrypted] = useState("")

  const encrypt = useCallback(async () => {
    const encoder = new TextEncoder()
    const msg = encoder.encode(payload)
    const iv = window.crypto.getRandomValues(new Uint8Array(12))

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    )
    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("CryptoTix"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    )
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      msg
    )
    setEncrypted(
      window.btoa(String.fromCharCode(...Array.from(new Uint8Array(encrypted)))) +
        "." +
        window.btoa(String.fromCharCode(...Array.from(iv)))
    )
  }, [password, payload])

  const url = new URL(
    `/ticket?c=${encrypted.replaceAll("+", "-").replaceAll("=", "")}`,
    location.href
  ).toString()

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose()
        setPassword("")
        setEncrypted("")
      }}
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
        {!encrypted ? (
          <>
            <TextField
              label="Password"
              value={password}
              sx={{ margin: "1rem 0" }}
              fullWidth
              onChange={(evt) => {
                setPassword(evt.target.value)
              }}
            />
            <Button variant="contained" type="button" onClick={() => encrypt()}>
              Submit
            </Button>
          </>
        ) : (
          <QRCodeDisplay>
            <QRCodeSVG value={url} size={300} />
            <CopyToClipboard text={url}>
              <Button variant="outlined" size="small">
                Copy Link
              </Button>
            </CopyToClipboard>
          </QRCodeDisplay>
        )}
      </Box>
    </Modal>
  )
}
