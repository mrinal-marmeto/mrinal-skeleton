if (!customElements.get('multi-product-form')) {
    customElements.define(
      'multi-product-form',
      class MultiProductForm extends HTMLElement {
        constructor() {
            super();

        }
        
        connectedCallback() {
            this.form = this.querySelector('form');
            this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
            this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
            this.submitButton = this.querySelector('[type="submit"]');
    
            if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    
            this.hideErrors = this.dataset.hideErrors === 'true';
            this.checkboxSelector = '[type="checkbox"][name="id"]:checked:not(.hidden)'

            this.addEventListener('change', this.onProductToggle);
        }

        onProductToggle() {
            this.toggleAddButton(event);
            this.updateTotalPrice(event);
        }

        // This function updates the total price based on selected product cards.
        updateTotalPrice(event) {
          this.totalPrice = Array.from(this.querySelectorAll(this.checkboxSelector)).reduce((sum, checkbox) => {
            // Getting the price from dataset because a product may not have variants for variant-select element
            return sum + parseInt(checkbox.dataset.price, 10);
          }, 0);

          // Update the total price display in the 'multi-product-price' element
          this.querySelector('multi-product-price > span').innerHTML = this.formatMoney(this.totalPrice);
        }
  
        onSubmitHandler(evt) {
          evt.preventDefault();
          if (this.submitButton.getAttribute('aria-disabled') === 'true') return;
  
          this.handleErrorMessage();
  
          this.submitButton.setAttribute('aria-disabled', true);
          this.submitButton.classList.add('loading');
          this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

          const body = JSON.stringify({
            items: this.getSelectedItems(),              
            sections: this.cart.getSectionsToRender().map((section) => section.id),
            sections_url: window.location.pathname,
          });
  
          fetch(`${routes.cart_add_url}`, { ...fetchConfig(), ...{ body } })
            .then((response) => response.json())
            .then((response) => {
              if (response.errors) {
                  this.handleErrorMessage(response.errors);
                  return;
              }
  
              const quickAddModal = this.closest('quick-add-modal');
              if (quickAddModal) {
                document.body.addEventListener(
                  'modalClosed',
                  () => {
                    setTimeout(() => {
                      this.cart.renderContents(response);
                    });
                  },
                  { once: true }
                );
                quickAddModal.hide(true);
              } else {
                this.cart.renderContents(response);
              }
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              this.submitButton.classList.remove('loading');
              if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
              if (!this.error) this.submitButton.removeAttribute('aria-disabled');
              this.querySelector('.loading-overlay__spinner').classList.add('hidden');
            });
        }

        getSelectedItems() {
          return this.selectedItems = Array.from(this.querySelectorAll(this.checkboxSelector)).map(item => {
            return {
              quantity: 1,
              id: item.value
            }
          });
        }

        toggleAddButton(event) {
          const disable = !this.getSelectedItems().length;
          const text = this.selectedItems.length == 2 ? this.dataset.twoItemsAddButtonText : this.selectedItems.length == 3 ? this.dataset.threeItemsAddButtonText :  window.variantStrings.addToCart;
          const addButton = this.querySelector('[name="add"]');
          const addButtonText = this.querySelector('[name="add"] > span');
          if (!addButton) return;
      
          if (disable) {
              addButton.setAttribute('disabled', 'disabled');
              if (text) addButtonText.textContent = text;
          } else {
              addButton.removeAttribute('disabled');
              addButtonText.textContent = text || window.variantStrings.addToCart;
          }
        }
  
        handleErrorMessage(errorMessage = false) {
          if (this.hideErrors) return;
  
          this.errorMessageWrapper =
            this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
          if (!this.errorMessageWrapper) return;
          this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
  
          this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  
          if (errorMessage) {
            this.errorMessage.textContent = errorMessage;
          }
        }

        formatMoney(number) {
          number = parseFloat(number / 100);

          return number.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
          });
        }
      }
    );
  }
  