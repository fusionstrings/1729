import { parseHTML } from "linkedom";

async function requestHandlerHTTP() {
  try {
    const templateURL = new URL("./templates/page.html", import.meta.url)
      .toString();
    const template = await fetch(templateURL);
    const html = await template.text();
    const { document, customElements, HTMLElement } = parseHTML(html);

    customElements.define(
      "fusionstrings-1729",
      class extends HTMLElement {
        connectedCallback() {
          console.log("fusionstrings-1729 connected 🥳");
        }
      },
    );

    const element1729 = document.createElement("fusionstrings-1729");
    element1729.innerHTML = `<h1>1729</h1>`;

    const mainElement = document.querySelector("main");

    if (mainElement) {
      mainElement.appendChild(element1729);
    }

    const importmapElement = document.querySelector('script[type="importmap"]');
    
    if(importmapElement){
      const importmap = await Deno.readTextFile("./www/browser.importmap");
      importmapElement.innerHTML = importmap;
    }
    
    return new Response(document.toString(), {
      headers: { "content-type": "text/html" },
    });
  } catch (error) {
    console.error(error.message || error.toString());
  }
}

export { requestHandlerHTTP };
