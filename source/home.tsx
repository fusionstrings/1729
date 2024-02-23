async function requestHandlerHTTP() {
  try {
    const templateURL = new URL('../templates/page.html', import.meta.url).toString();
    const document = await fetch(templateURL);
    return document;
  } catch (error) {
    console.error(error.message || error.toString());
  }
}

export { requestHandlerHTTP };
