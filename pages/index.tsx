import { BlitzPage } from "@blitzjs/next"
import styled from "@emotion/styled"
import { Box, Button, Typography } from "@mui/material"
import { Container } from "@mui/system"
import Layout from "app/core/layouts/Layout"
import { useUser } from "app/auth/hooks/useUser"
import Image from "next/image"
import placeholder from "public/placeholder.png"
import { ReactElement, useEffect } from "react"
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
              <StepBox>
                <Typography variant="h3">Step 1. Step Name</Typography>
                <Typography variant="body1">Step Content</Typography>
                <Image src={placeholder} alt="step guide screenshot"></Image>
              </StepBox>
              <StepBox>
                <Typography variant="h3">Step 1. EQWEQW</Typography>
                <Typography variant="body1">eqwjeiwqujieoqw</Typography>
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
