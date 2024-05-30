import { setup, fromPromise, assign } from "xstate";
import type { EventFromLogic } from 'xstate';
import { parseHTML } from "linkedom";

type response = { body: string; headers: { "content-type": string; }; status: number; }
const machine = setup({
  types: {
    context: {} as {
      NOT_FOUND: { body: string; headers: { "content-type": string; }; status: number; };
      HOME: { body: string; headers: { "content-type": string; }; status: number; }
    },
    events: {} as { type: "/" } | { type: "/404" },
    output: {} as { '/': response } | { '/404': response }
  },
  actions: {
    "NOT_FOUND.success": assign({
      NOT_FOUND: ({ context, event }) => {
        return event.output;
      }
    }),
    "NOT_FOUND.failed": assign({
      NOT_FOUND: ({ context, event }) => {
        return event.error.message
      }
    }),
  },
  actors: {
    "HOME.requestHandler": fromPromise(async () => {
      try {
        const html = await Deno.readTextFile("./source/templates/page.html");
        const { document, customElements, HTMLElement } = parseHTML(html);

        customElements.define(
          "fusionstrings-1729",
          class extends HTMLElement {
            connectedCallback() {
              console.log("fusionstrings-1729 connected 🥳");
            }
          },
        );

        const element1729 = document.createElement("fusionstrings-1729");
        element1729.innerHTML = `<h1>1729</h1>`;

        const mainElement = document.querySelector("main");

        if (mainElement) {
          mainElement.appendChild(element1729);
        }

        const importmapElement = document.querySelector('script[type="importmap"]');

        if (importmapElement) {
          const importmap = await Deno.readTextFile("./www/browser.importmap");
          importmapElement.innerHTML = importmap;
        }
        return {
          body: document.toString(),
          headers: { "content-type": "text/html" },
          status: 200
        }
      } catch (error) {
        console.error(error)
        throw new Error('Something went wrong');
      }
    }),
    "NOT_FOUND.requestHandler": fromPromise(async () => {
      const html = await Deno.readTextFile("./source/templates/page.html");
      return {
        body: html,
        headers: { "content-type": "text/html" },
        status: 404
      }
    }),
  },
  schemas: {
    events: {
      "/": {
        type: "object",
        properties: {},
      },
      "/404": {
        type: "object",
        properties: {},
      },
    },
    context: {
      HOME: {
        type: "string",
      },
    },
  },
}).createMachine({
  context: {
    HOME: { body: '', headers: { "content-type": "text/html" }, status: 200 },
    NOT_FOUND: { body: '', headers: { "content-type": "text/html" }, status: 404 }
  },
  id: "request-handler",
  initial: "IDLE",
  states: {
    IDLE: {
      on: {
        "/": {
          target: "HOME",
        },
        "/404": {
          target: "NOT_FOUND",
        },
      },
    },
    HOME: {
      invoke: {
        input: {},
        onDone: {
          target: "HOME_SUCCESS",
          actions: assign({
            HOME: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "HOME_FAILED",
          actions: assign({
            HOME: ({ event }) => event.error.message,
          }),
        },
        src: "HOME.requestHandler",
      },
    },
    NOT_FOUND: {
      invoke: {
        input: {},
        onDone: {
          target: "NOT_FOUND_SUCCESS",
        },
        onError: {
          target: "NOT_FOUND_FAILED",
        },
        src: "NOT_FOUND.requestHandler",
      },
    },
    HOME_SUCCESS: {
      type: "final"
    },
    HOME_FAILED: {
      type: "final"
    },
    NOT_FOUND_SUCCESS: {
      type: "final",
      entry: {
        type: "NOT_FOUND.success",
      },
    },
    NOT_FOUND_FAILED: {
      type: "final",
      entry: {
        type: "NOT_FOUND.failed",
      },
    },
  },
  output: ({ context }) => ({
    '/': context.HOME,
    '/404': context.NOT_FOUND
  }),
});

type MachineEvent = EventFromLogic<typeof machine>;

export { machine }
export type { MachineEvent }