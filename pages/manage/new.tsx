import { BlitzPage } from "@blitzjs/next"
import { useMutation } from "@blitzjs/rpc"
import { Box, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useUser } from "app/auth/hooks/useUser"
import Layout from "app/core/layouts/Layout"
import { EventForm } from "app/events/components/EventForm"
import createEvent from "app/events/mutations/createEvent"
import { CreateEvent } from "app/events/validations"
import { utils } from "ethers"
import { FormApi, SubmissionErrors } from "final-form"
import { useRouter } from "next/router"
import { useEffect } from "react"

const ManageCreateEvent: BlitzPage = () => {
  const router = useRouter()
  const { isLogedIn, isLogining, startLogin, user } = useUser()
  const [createEventMutation] = useMutation(createEvent)

  useEffect(() => {
    if (!isLogedIn && !isLogining) startLogin()
  }, [isLogedIn, isLogining, startLogin])

  return (
    <Layout title="Create Event">
      <Container sx={{ paddingTop: "2rem" }}>
        <Box
          sx={{
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h4" component="h2">
            Create Event
          </Typography>
        </Box>
        <Box>
          <EventForm
            initialValues={{
              name: "",
              hashedPassword: "",
              tokenAddress: undefined,
              chainId: "",
              minBalance: 1,
            }}
            submitText="yo"
            schema={CreateEvent}
            onSubmit={async (values: any) => {
              if (!user) return
              const hashedPassword = values.hashedPassword.length
                ? utils.keccak256(utils.toUtf8Bytes(values.hashedPassword))
                : ""

              const payload = Object.assign({}, values, { user, hashedPassword })
              await createEventMutation(payload)
              await router.push("/manage")
            }}
          />
        </Box>
      </Container>
    </Layout>
  )
}

export default ManageCreateEvent
