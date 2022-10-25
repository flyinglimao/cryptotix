import { BlitzPage } from "@blitzjs/next"
import {
  Box,
  Button,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { Container } from "@mui/system"
import { EventTable } from "app/events/components/EventTable"
import { useUser } from "app/auth/hooks/useUser"
import Layout from "app/core/layouts/Layout"
import { useEffect } from "react"
import Link from "next/link"

const Manage: BlitzPage = () => {
  const { isLogedIn, isLogining, startLogin, user } = useUser()

  useEffect(() => {
    if (!isLogedIn && !isLogining) startLogin()
  }, [isLogedIn, isLogining, startLogin])

  return (
    <Layout title="Manage">
      <Container sx={{ paddingTop: "2rem" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "middle",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h4" component="h2">
            Your Events
          </Typography>
          <Link href="/manage/new" passHref>
            <Button variant="outlined" component="a">
              + Create
            </Button>
          </Link>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{/* Collapse Button */}</TableCell>
                <TableCell>Event Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <EventTable user={user} />
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  )
}

export default Manage
