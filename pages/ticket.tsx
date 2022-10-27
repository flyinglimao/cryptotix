import { useRouterQuery } from "@blitzjs/next"
import styled from "@emotion/styled"
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import Layout from "app/core/layouts/Layout"
import { useRouter } from "next/router"
import { QRCodeSVG } from "qrcode.react"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useResizeDetector } from "react-resize-detector"

const QRCodeDisplay = styled.div`
  svg {
    display: block;
    margin: 0 auto;
  }
  text-align: center;
`

function base64ToArrayBuffer(base64: string) {
  var binary = window.atob(base64)
  var len = binary.length
  var bytes = new Uint8Array(len)
  for (var i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export const Ticket = () => {
  const router = useRouter()
  const query = useRouterQuery()
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [passwordError, setPasswordError] = useState<string>()
  const [payload, setPayload] = useState<string>("")
  const { width, ref } = useResizeDetector()

  useEffect(() => {
    if (!query.c || Array.isArray(query.c))
      router
        .push("/")
        .then(() => {})
        .catch(() => {})
  }, [query.c, router])

  const decrypt = useCallback(async () => {
    if (!query.c || Array.isArray(query.c)) return
    const components = query.c.split(".")
    const ciphertext = base64ToArrayBuffer(components[0]!.replaceAll("-", "+"))
    const ivArrayBuffer = base64ToArrayBuffer(components[1]!.replaceAll("-", "+"))
    const iv = new Uint8Array(ivArrayBuffer)

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
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
      ["decrypt"]
    )
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    )

    console.log(new Uint8Array(decrypted))
    setPayload(decoder.decode(new Uint8Array(decrypted)))
  }, [password, query.c])

  return (
    <Container maxWidth="lg">
      <Box sx={{ padding: "1rem 0", svg: { maxWidth: "100%", margin: "1rem 0" } }} ref={ref}>
        {payload ? (
          <QRCodeDisplay>
            <QRCodeSVG value={payload} size={width && Math.min(400, width)} />
            {/* <Button variant="outlined" sx={{ marginTop: "1rem" }}>
            Encrypt and Generate URL
          </Button> */}
          </QRCodeDisplay>
        ) : (
          <>
            <Typography variant="body1">Enter password to decrypt the ticket</Typography>
            <TextField
              label="Password"
              helperText={passwordError}
              error={!!passwordError}
              name="password"
              sx={{ margin: "1rem 0" }}
              onChange={(evt) => {
                setPassword(evt.target.value)
              }}
              size="small"
            />
            <Button
              variant="contained"
              type="button"
              onClick={() => {
                decrypt().catch((err) => {
                  setPasswordError("Decrypt failed")
                  console.trace(err)
                })
              }}
              sx={{ mt: "1rem" }}
            >
              Submit
            </Button>
          </>
        )}
      </Box>
    </Container>
  )
}

const ShowTicketPage = () => {
  return (
    <Container>
      <Suspense fallback={<div>Loading</div>}>
        <Ticket />
      </Suspense>
    </Container>
  )
}

ShowTicketPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowTicketPage
