import { setup, fromPromise, assign } from "xstate";
import { parseHTML } from "linkedom";

export const machine = setup({
  types: {
    context: {} as { HOME: string },
    events: {} as { type: "/" },
  },
  actions: {
    "HOME.success": assign({
      HOME: ({ context, event }) => {
        return event.output;
      }
    }),
    "HOME.failed": assign({
      HOME: ({ context, event }) => {
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
        return document.toString()
      } catch (error) {
        console.error(error)
        throw new Error('Something went wrong');
      }
    }),
  },
  schemas: {
    events: {
      "/": {
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
    HOME: "",
  },
  id: "request-handler",
  initial: "IDLE",
  states: {
    IDLE: {
      on: {
        "/": {
          target: "HOME",
        },
      },
    },
    HOME: {
      invoke: {
        input: {},
        onDone: {
          target: "SUCCESS",
        },
        onError: {
          target: "FAILED",
        },
        src: "HOME.requestHandler",
      },
    },
    SUCCESS: {
      type: "final",
      entry: {
        type: "HOME.success",
      },
    },
    FAILED: {
      type: "final",
      entry: {
        type: "HOME.failed",
      },
    },
  },
  output: ({ context }) => ({
    '/': context.HOME
  }),
});