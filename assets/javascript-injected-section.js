class JavaScriptInjectedSection extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    // Getting the parent under which we need to show the menu
    this.targetLocationSelector = this.dataset['targetLocation'];
    this.targetLocation = document.querySelector(this.targetLocationSelector);

    if(this.targetLocation) {
      this.targetLocation.innerHTML = this.innerHTML;
    }
  }
}

customElements.define('javascript-injected-section', JavaScriptInjectedSection);

class JavaScriptInjectedSectionHamburger extends JavaScriptInjectedSection {
  constructor() {
    super();
  }

  connectedCallback() {
    document.querySelector('header-drawer').bindEvents();
  }
}

customElements.define('javascript-injected-section-hamburger', JavaScriptInjectedSectionHamburger);