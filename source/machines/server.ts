
import { setup, createMachine } from 'xstate'

export const machine = setup({
    "types": {
        "context": {} as {},
        "events": {} as { type: 'startServer', } | { type: 'stopServer', } | { type: '/', }
    },
    "actions": {
        "requestHandlerHTTPHomeSuccess": function ({
            context, event
        }, params) {
            // Add your action code here
            // ...
        },
        "requestHandlerHTTPHomeError": function ({
            context, event
        }, params) {
            // Add your action code here
            // ...
        }
    },
    "actors": {
        "requestHandlerHTTPHome": createMachine({
            /* ... */
        })
    },
    "guards": {
        "ERROR": function ({
            context, event
        }) {
            // Add your guard condition here
            return true;
        }
    },
    "schemas": {
        "events": {
            "startServer": {
                "type": "object",
                "properties": {}
            },
            "stopServer": {
                "type": "object",
                "properties": {}
            },
            "/": {
                "type": "object",
                "properties": {}
            }
        }
    }
})
    .createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5SzAJwG5oHQEkAiAMgKIDEsALgIarkDKamqA2gAwC6ioADgPawCW5fjwB2nEAA9EARgDMsrADYW0gKyKATKoA0IAJ6IALPKyGAHAE5VZ+bdsBfe7pQZs+YmSo16r5tI5IILwCQqLiUgjSxkoq6lq6BggaAOxmWGaqhtKKObm5so7ODNgAcgDyACoA+gQ4tBVEJTglAOKePFw+jKwB3HyCwmKBEVEKymqaOvqIsmYaWBaW1nZ2hSAujFi19Y3NbRQdXWg94sEDYcMyJuNxU4nZFlgsqhosNivy0msb2NsNTa1cIRSAB6E6BM6hIagEYsWTJLDWVQWeF3GSqL5OdbFVBbOr-PZYAASZQAsqQIKIwFh+CJ0DwANbU1BgACOAFc4OQiZQRBAADZoIkVCoABSJPAAtmBwX0QoNwogzIZDFhpNJktIzMk0UkLKqrLJpFpvji8TsAS1iWTSGhUDxcVx+ZRyAAzB2SrAsjlcnl8wWoYViiXS2VBfpQxUIZWq9Wa7W617SRGOLEiHgQODiH6oU4RhWXBAAWkUCUQRY0hlNviBxDz8ouMKMGjLCHhaTkVneH1U1c25Wqf12rXr52hkhmyTGCdbhg0aUMLEmfd++OHLVHkcLs1Uao1Wp1rcUCl7WJz5oJgPcRE3BabkWNaRuk1bGi0C2SiluK9xQ8t1vJW9GwnBBjAUOMD0TWR5gsDQLEUBNU3sIA */
        "context": {},
        "id": "server",
        "initial": "IDLE",
        "states": {
            "IDLE": {
                "on": {
                    "startServer": [
                        {
                            "target": "NOT_LISTENING",
                            "guard": {
                                "type": "ERROR"
                            }
                        },
                        {
                            "target": "LISTENING"
                        }
                    ]
                }
            },
            "NOT_LISTENING": {
                "on": {
                    "stopServer": {
                        "target": "IDLE"
                    }
                }
            },
            "LISTENING": {
                "initial": "IDLE",
                "on": {
                    "stopServer": {
                        "target": "IDLE"
                    }
                },
                "states": {
                    "IDLE": {
                        "on": {
                            "/": {
                                "target": "HOME"
                            }
                        }
                    },
                    "HOME": {
                        "invoke": {
                            "id": "requestHandlerHTTPHome",
                            "input": {},
                            "onDone": {
                                "target": "IDLE",
                                "actions": {
                                    "type": "requestHandlerHTTPHomeSuccess"
                                }
                            },
                            "onError": {
                                "target": "IDLE",
                                "actions": {
                                    "type": "requestHandlerHTTPHomeError"
                                }
                            },
                            "src": "requestHandlerHTTPHome"
                        },
                        "description": "Show Homepage depending on Authenticated status"
                    }
                }
            }
        }
    })
