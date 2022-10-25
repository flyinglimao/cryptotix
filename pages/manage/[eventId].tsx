import { Suspense } from "react"
import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"

import Layout from "app/core/layouts/Layout"
import getEvent from "app/events/queries/getEvent"
import deleteEvent from "app/events/mutations/deleteEvent"

export const EventManage = () => {
  const router = useRouter()
  const eventId = useParam("eventId", "number")
  const [deleteEventMutation] = useMutation(deleteEvent)
  const [event] = useQuery(getEvent, { id: eventId })

  return (
    <>
      <Head>
        <title>Event {event.id}</title>
      </Head>

      <div>
        <h1>Event {event.id}</h1>
        <pre>{JSON.stringify(event, null, 2)}</pre>

        <Link href={Routes.EditEventPage({ eventId: event.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteEventMutation({ id: event.id })
              await router.push(Routes.EventsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowEventManagePage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.EventsPage()}>
          <a>Events</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <EventManage />
      </Suspense>
    </div>
  )
}

ShowEventManagePage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowEventManagePage
