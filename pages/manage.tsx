import { BlitzPage } from "@blitzjs/next"
import { Typography } from "@mui/material"
import { Container } from "@mui/system"
import Layout from "app/core/layouts/Layout"

const Manage: BlitzPage = () => {
  return (
    <Layout title="Manage">
      <Container>
        <main>
          <Typography variant="h1">Manage</Typography>
        </main>
      </Container>
    </Layout>
  )
}

export default Manage
