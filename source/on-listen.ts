function onListen({ port, hostname }: Deno.ServeOptions) {
    try {
        console.log(`Server started at http://${hostname}:${port}`);
    } catch (error) {
        console.error(error.message || error.toString());
        throw error;
    }
}

export { onListen }