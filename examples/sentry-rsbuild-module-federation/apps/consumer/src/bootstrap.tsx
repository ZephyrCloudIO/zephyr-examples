import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  init,
  makeFetchTransport,
  moduleMetadataIntegration,
  makeMultiplexedTransport,
} from "@sentry/browser";

const EXTRA_KEY = "ROUTE_TO";

const transport = makeMultiplexedTransport(
  makeFetchTransport,
  ({ getEvent }) => {
    console.log("Transport EVENT");
    const event = getEvent();
    console.log("EVENT", event);
    if (
      event?.extra &&
      EXTRA_KEY in event.extra &&
      Array.isArray(event.extra.EXTRA_KEY)
    ) {
      return event.extra[EXTRA_KEY];
    }
    return [];
  }
);

init({
  dsn: "https://f19b091da0e5edbc4ad72e12b07d94b2@o4508279640817664.ingest.us.sentry.io/4508615718535168",
  integrations: [moduleMetadataIntegration()],
  transport,
  beforeSend: (event) => {
    console.log("EVENT", event);
    if (event?.exception?.values?.[0].stacktrace.frames) {
      const frames = event.exception.values[0].stacktrace.frames;
      // Find the last frame with module metadata containing a DSN
      const routeTo = frames
        .filter((frame) => frame.module_metadata?.dsn)
        .map((v) => v.module_metadata)
        .slice(-1); // using top frame only - you may want to customize this according to your needs

      if (routeTo.length) {
        event.extra = {
          ...event.extra,
          [EXTRA_KEY]: routeTo,
        };
      }
    }

    return event;
  },
});

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
