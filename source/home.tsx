function requestHandlerHTTP(request: Request) {
  try {
    const url = new URL(request.url);
    const body = `
    <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>1729</title>
  </head>
  <body>
      <h1>1729 </h1>
      <pre>${url.toString()}</pre>
  </body>
  </html>
    `

    return new Response(body, {
      headers: { "content-type": "text/html" },
    });
  } catch (error) {
    console.error(error.message || error.toString());
  }
}

export { requestHandlerHTTP };
