import { useParam } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import styled from "@emotion/styled"
import { Box, Button, Container, Typography } from "@mui/material"
import Layout from "app/core/layouts/Layout"
import { RuleList } from "app/events/components/RuleEngine/RuleList"
import { TicketIssuer } from "app/events/components/TicketIssuer"
import getEvent from "app/events/queries/getEvent"
import { TextField } from "mui-rff"
import { Suspense, useState } from "react"
import { Form } from "react-final-form"

const Main = styled.main`
  margin: 4rem;
  text-align: center;
`
const Protected = styled.div`
  margin: 4rem;
`

export const Event = () => {
  const eventId = useParam("eventId", "number")
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [event] = useQuery(getEvent, { id: eventId, password })

  return (
    <Container maxWidth="lg">
      {event ? (
        <Main>
          <Typography variant="h1">{event.name}</Typography>
          <Box sx={{ textAlign: "left" }}>
            This event requires you to:
            <RuleList rule={JSON.parse(event.rule)} />
          </Box>
          <TicketIssuer name={event.name} eventId={eventId!} password={password} />
        </Main>
      ) : (
        <Protected>
          This event requires a password
          <Form
            initialValues={{ password: "" }}
            onSubmit={({ password }: { password: string }) => {
              setPassword(password)
            }}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Password"
                  helperText={password && event === null ? "Password incorrect" : ""}
                  error={!!(password && event === null)}
                  name="password"
                  sx={{ margin: "1rem 0" }}
                />
                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </form>
            )}
          />
        </Protected>
      )}
    </Container>
  )
}

const ShowEventPage = () => {
  return (
    <Container>
      <Suspense fallback={<div>Loading</div>}>
        <Event />
      </Suspense>
    </Container>
  )
}

ShowEventPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowEventPage
