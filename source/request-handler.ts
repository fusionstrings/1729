import { serveFile } from "#http/file_server";
import browserImportmap from '#browser-importmap' with { type: 'json' };
type BrowserAssets = keyof typeof browserImportmap['imports'];

async function requestHandler(request: Request) {
    try {
        const { pathname } = new URL(request.url);

        const pathnameHandlerID = pathname.replace('/', '#');
        const pathnameHandler = pathnameHandlerID === '#' ? "#home" : pathnameHandlerID;

        if (pathnameHandler in browserImportmap.imports) {
            const resourcePath = browserImportmap.imports[pathnameHandler as BrowserAssets]

            if (resourcePath.startsWith('./')) {
                return serveFile(request, resourcePath)
            }

            return fetch(resourcePath)
        }

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