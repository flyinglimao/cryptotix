import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createEvent from "app/events/mutations/createEvent";
import { EventForm, FORM_ERROR } from "app/events/components/EventForm";

const NewEventPage = () => {
  const router = useRouter();
  const [createEventMutation] = useMutation(createEvent);

  return (
    <Layout title={"Create New Event"}>
      <h1>Create New Event</h1>

      <EventForm
        submitText="Create Event"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateEvent}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const event = await createEventMutation(values);
            await router.push(Routes.ShowEventPage({ eventId: event.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.EventsPage()}>
          <a>Events</a>
        </Link>
      </p>
    </Layout>
  );
};

NewEventPage.authenticate = true;

export default NewEventPage;
