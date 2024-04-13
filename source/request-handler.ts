import { serveFile } from "#http/file_server";
import browserImportmap from '#browser-importmap' assert { type: 'json' };
type BrowserAssets = keyof typeof browserImportmap['imports'];

async function requestHandler(request: Request) {
    try {
        const { pathname } = new URL(request.url);

        const pathnameHandler = pathname === '/' ? "#home" : pathname.replace('/', '#');

        if (pathnameHandler in browserImportmap.imports) {
            return serveFile(request, browserImportmap.imports[pathnameHandler as BrowserAssets])
        }

        const { requestHandlerHTTP } = await import(pathnameHandler);
        return requestHandlerHTTP(request);
    } catch (error) {
        console.error(error.message || error.toString());

        const html = await Deno.readTextFile("./source/templates/404.html");

        return new Response(html, { status: 404, headers: { "content-type": "text/html" } });
    }
}

export { requestHandler }