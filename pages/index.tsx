import { BlitzPage } from "@blitzjs/next"
import styled from "@emotion/styled"
import { Box, Button, Typography } from "@mui/material"
import { Container } from "@mui/system"
import Layout from "app/core/layouts/Layout"
import { useUser } from "app/auth/hooks/useUser"
import Image from "next/image"
import goCreateEvent from "public/go-create-event.png"
import createEvent from "public/create-event.png"
import copyAndShare from "public/copy-and-share.png"
import connectAndVerify from "public/connect-and-verify.png"
import passwordEncrypt from "public/password-encrypt.png"
import shareEncrypted from "public/share-encrypted.png"
import passwordDecrypt from "public/password-decrypt.png"
import cutTicket from "public/cut-ticket.png"
import { useEffect } from "react"
import { useRouter } from "next/router"

const Brand = styled.div`
  margin: 2rem 0;
  text-align: center;
`
const Guide = styled.div`
  text-align: center;
`
const Footer = styled.footer`
  text-align: center;
`
const StepBox = styled.div`
  margin-bottom: 1rem;
`

const Home: BlitzPage = () => {
  const router = useRouter()
  const { startLogin, isLogedIn } = useUser()

  useEffect(() => {
    if (isLogedIn) {
      router
        .push("/manage")
        .then(() => {})
        .catch(() => {})
    }
  }, [isLogedIn, router])

  return (
    <Layout title="Home">
      <Container>
        <main>
          <Brand>
            <Typography variant="h1">CryptoTix</Typography>
            <Typography variant="body1">
              A tool for verifying guests&apos; ownership of tokens.
            </Typography>
          </Brand>
          <Guide>
            <Box sx={{ marginBottom: "1rem" }}>
              <Button variant="contained" onClick={() => startLogin()}>
                Ready to Start?
              </Button>
            </Box>
            <Box sx={{ textAlign: "left", width: "600px", margin: "0 auto" }}>
              <Typography variant="body1" sx={{ textAlign: "center", marginBottom: ".6rem" }}>
                Or want to know how to use it?
              </Typography>
              <StepBox style={{ marginTop: "6rem" }}>
                <Typography variant="h4" component="p">
                  Step 1. Login with Wallet
                </Typography>
              </StepBox>
              <StepBox>
                <Typography variant="h4" component="p">
                  Step 2. Create an event
                </Typography>
                <Image src={goCreateEvent} alt="Create an event in dashboard" />
                <Image src={createEvent} alt="Fill the form and setup rules" />
              </StepBox>
              <StepBox>
                <Typography variant="h4" component="p">
                  Step 3. Copy and share link
                </Typography>
                <Image src={copyAndShare} alt="Copy the link and share with people" />
              </StepBox>
              <StepBox>
                <Typography variant="h4" component="p">
                  Step 4. Connect to wallet (user)
                </Typography>
                <Image src={connectAndVerify} alt="Copy the link and share with people" />
              </StepBox>
              <StepBox>
                <Typography variant="h4" component="p">
                  Step 4.a. Encrypt and transfer (from air-gapped device)
                </Typography>
                <Image src={passwordEncrypt} alt="Encrypt a ticket with password" />
                <Image src={shareEncrypted} alt="Transfer encrypted ticket with QR code or link" />
              </StepBox>
              <StepBox>
                <Typography variant="h4" component="p">
                  Step 4.b. Dncrypt on another device
                </Typography>
                <Image src={passwordDecrypt} alt="Decrypt a ticket with password" />
              </StepBox>
              <StepBox>
                <Typography variant="h4" component="p">
                  Step 5. Scan and verify
                </Typography>
                <Image src={cutTicket} alt="Scan the ticket and verify" />
              </StepBox>
            </Box>
          </Guide>
        </main>

        <Footer>
          <Typography variant="body2">
            Made by <a href="https://github.com/flyinglimao">flyinglimao</a>
          </Typography>
        </Footer>
      </Container>
    </Layout>
  )
}

export default Home
