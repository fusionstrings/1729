import { setup, fromPromise, assign } from "xstate";
import { requestHandler } from "#request-handler";
import { onListen } from "#on-listen";

const PORT = Deno.env.get('PORT');

const serverOptions: Deno.ServeOptions = {
    onListen,
    port: PORT ? parseInt(PORT, 10) : 1729
}

async function run() {
    try {
        const server = await Deno.serve(serverOptions, requestHandler);
        return server;
    } catch (error) {
        console.error(error)
        return undefined;
    }
}

async function handleHome() {
    try {
        await console.log('home')
        return 'home'
    } catch (error) {
        return error
    }
}

export const machine = setup({
    types: {
        context: {} as { PORT: number; server: string; home: string },
        events: {} as { type: "/" } | { type: "start" } | { type: "stopServer" },
    },
    actions: {
        assignServerInstance: assign({
            server: 'server'
        }),
        clearServerInstance: assign({
            server: undefined
        }),
        requestHandlerHTTPHomeSuccess: assign({
            home: 'success'
        }),
        requestHandlerHTTPHomeError: assign({
            home: 'error'
        }),
    },
    actors: {
        startServer: fromPromise(run),
        requestHandlerHTTPHome: fromPromise(handleHome),
    },
}).createMachine({
    context: {
        PORT: 1729,
        server: "inactive",
        home: "",
    },
    id: "web-server-machine",
    initial: "IDLE",
    states: {
        IDLE: {
            on: {
                start: {
                    target: "START_SERVER",
                },
            },
        },
        START_SERVER: {
            invoke: {
                id: "machine.START_SERVER:invocation[0]",
                input: {},
                onDone: {
                    target: "LISTENING",
                    actions: {
                        type: "assignServerInstance",
                    },
                },
                onError: {
                    target: "STOPPED",
                    actions: {
                        type: "clearServerInstance",
                    },
                },
                src: "startServer",
            },
            description: "Start Server",
        },
        LISTENING: {
            initial: "IDLE",
            on: {
                stopServer: {
                    target: "STOPPED",
                },
            },
            description: "Server is running and listening for incoming requests.",
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
                        id: "requestHandlerHTTPHome",
                        input: {},
                        onDone: {
                            target: "IDLE",
                            actions: {
                                type: "requestHandlerHTTPHomeSuccess",
                            },
                        },
                        onError: {
                            target: "IDLE",
                            actions: {
                                type: "requestHandlerHTTPHomeError",
                            },
                        },
                        src: "requestHandlerHTTPHome",
                    },
                    description: "Show Homepage depending on Authenticated status",
                },
            },
        },
        STOPPED: {
            always: {
                target: "IDLE",
            },
            description:
                "Server is not running and can not serve to any incoming requests.",
        },
    },
});