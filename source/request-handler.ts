async function requestHandler(request: Request) {
    try {
        const { pathname } = new URL(request.url);

        const pathnameHandlerID = pathname.replace('/', '#');
        const pathnameHandler = pathnameHandlerID === '#' ? "#home" : pathnameHandlerID;

        const { requestHandlerHTTP } = await import(pathnameHandler);
        return requestHandlerHTTP(request);
    } catch (error) {
        console.error(error.message || error.toString());
        const templateURL = new URL('../www/404.html', import.meta.url).toString();
        const notFound = await fetch(templateURL);
        
        return new Response(notFound.body, { status: 404 });
    }
}

export { requestHandler }