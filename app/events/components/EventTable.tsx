import { useQuery } from "@blitzjs/rpc"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material"
import { AuthenticatedUser } from "app/auth/components/LoginModal"
import getEvents from "app/events/queries/getEvents"
import Link from "next/link"
import { Fragment, ReactElement, Suspense, useState } from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { RuleList } from "./RuleEngine/RuleList"
import { Rule } from "./RuleEngine/ruleTypes"

function RowPlaceholder({ text }: { text: string }): ReactElement {
  return (
    <TableRow>
      <TableCell colSpan={3} sx={{ fontStyle: "italic", textAlign: "center" }}>
        {text}
      </TableCell>
    </TableRow>
  )
}

function EventRow({
  event,
}: {
  event: {
    id: number
    name: string
    rule: Rule
    chainId: string
  }
}): ReactElement {
  const [open, setOpen] = useState(false)
  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen((e) => !e)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{event.name}</TableCell>
        <TableCell align="right">
          <CopyToClipboard text={new URL(`/${event.id}`, location.href).toString()}>
            <Button variant="outlined" size="small">
              Copy Link
            </Button>
          </CopyToClipboard>
          <Link href={`/manage/${event.id}`} passHref>
            <Button variant="outlined" size="small" component="a" sx={{ marginLeft: "0.5rem" }}>
              Start Verify
            </Button>
          </Link>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" component="div">
                Rule
              </Typography>
              <Box sx={{ pl: 2, mt: 1 }}>
                <RuleList rule={event.rule} />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

function EventList({ user }: { user: AuthenticatedUser }): ReactElement {
  const [events] = useQuery(getEvents, { user })
  return (
    <Fragment>
      {events.length ? (
        events.map((evt) => (
          <EventRow
            event={{
              ...evt,
              rule: JSON.parse(evt.rule) as Rule,
            }}
            key={`event-row-${evt.id}`}
          />
        ))
      ) : (
        <RowPlaceholder text="No Data" />
      )}
    </Fragment>
  )
}

export function EventTable({ user }: { user?: AuthenticatedUser }): ReactElement {
  return (
    <TableBody>
      <Suspense fallback={<RowPlaceholder text="Loading" />}>
        {user && <EventList user={user} />}
      </Suspense>
    </TableBody>
  )
}
