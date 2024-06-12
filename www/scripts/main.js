class HomeDOM extends HTMLElement {
  connectedCallback() {
    console.log("fusionstrings-1729 connected \u{1F973}");
  }
}

function main() {
  customElements.define(
    "fusionstrings-1729",
    HomeDOM
  );
}

export { main };
//# sourceMappingURL=main.js.map
