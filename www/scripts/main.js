// source/components/home-dom.ts
var HomeDOM = class extends HTMLElement {
  connectedCallback() {
    console.log("fusionstrings-1729 connected \u{1F973}");
  }
};

// source/main.tsx
function main() {
  customElements.define(
    "fusionstrings-1729",
    HomeDOM
  );
}
export {
  main
};
//# sourceMappingURL=main.js.map
