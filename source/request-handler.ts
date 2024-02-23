import { serveDir } from "#http/file_server";

async function requestHandler(request: Request) {
    try {
        const { pathname } = new URL(request.url);
        console.log(pathname)
        if (pathname.startsWith("/js") || pathname.startsWith("/css") || pathname.startsWith("/images") || pathname.startsWith("/docs")) {
            return serveDir(request, {
                fsRoot: "www",
            });
        }

        const pathnameHandlerID = pathname.replace('/', '#');
        const pathnameHandler = pathnameHandlerID === '#' ? "#home" : pathnameHandlerID;

        const { requestHandlerHTTP } = await import(pathnameHandler);
        return requestHandlerHTTP(request);
    } catch (error) {
        console.error(error.message || error.toString());
        const templateURL = new URL('../www/404.html', import.meta.url).toString();

        const notFound = await fetch(templateURL);
        const body = await notFound.text();
        return new Response(body, {
            headers: { "content-type": "text/html" }, status: 404
        });
    }
}

export { requestHandler }