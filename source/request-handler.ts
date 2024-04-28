import { createActor, toPromise } from 'xstate';
//import { serveFile } from "#http/file_server";
import { machine } from "#request-handler-machine";
// import browserImportmap from '#browser-importmap' assert { type: 'json' };
// type BrowserAssets = keyof typeof browserImportmap['imports'];

async function errorResponse(error: Error) {
    console.error(error.message || error.toString());

    const html = await Deno.readTextFile("./source/templates/404.html");

    return new Response(html, { status: 404, headers: { "content-type": "text/html" } });
}
async function requestHandler(request: Request) {
    try {
        const { pathname } = new URL(request.url);

        const actor = createActor(machine);

        actor.subscribe({
            error: (error: Error) => {
                console.error(error);
                return errorResponse(error)
            }
        });

        actor.start();

        const currentState = actor.getSnapshot()

        if (currentState.can({ type: pathname })) {
            actor.send({ type: pathname });
        } else {
            return errorResponse(new Error(`impossible state, resource ${pathname} not found.`))
        }

        const output = await toPromise(actor);
        // const pathnameHandler = pathname === '/' ? "#home" : pathname.replace('/', '#');

        // if (pathnameHandler in browserImportmap.imports) {
        //     return serveFile(request, browserImportmap.imports[pathnameHandler as BrowserAssets])
        // }

        // const { requestHandlerHTTP } = await import(pathnameHandler);


        // const actor = createActor(machine);
        // actor.subscribe((snapshot) => {
        //     console.log('Value:', snapshot.value);
        //     if (snapshot.status === 'done') {
        //         console.log(snapshot.output);

        //         return requestHandlerHTTP(snapshot.output);
        //     }
        // });

        // actor.start();

        // const currentState = actor.getSnapshot()

        // if(currentState.can({ type: pathname })){
        //     actor.send({ type: pathname });
        // }

        //const html = await Deno.readTextFile("./source/templates/404.html");
        return new Response(output[pathname], { headers: { "content-type": "text/html" } });
    } catch (error) {
        return errorResponse(error)
    }
}

export { requestHandler }