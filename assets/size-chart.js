class SizeChart extends HTMLAnchorElement {
  constructor() {
    super();

    this.dialog = document.querySelector('#size-chart');
    this.dialogForm = this.dialog.querySelector('#variant-radios-sync');
    this.variantRadiosSyncForm = this.dialog.querySelector('[is="variant-radios-sync"]')

    // Add an event listener to the anchor to handle the click event
    this.addEventListener('click', this.initSizeChart);
  }

  async initSizeChart(event) {
    event.preventDefault(); // Prevent the default behavior of the anchor

    await this.renderSizeChart();
    this.updateLabelAttributes();

    this.variantRadiosSyncForm.updateMasterCurrentVariant()
    this.variantRadiosSyncForm.updateSizeChartSelectedOption();
    this.variantRadiosSyncForm.updateVariantInput();
    this.variantRadiosSyncForm.updateSizeStatuses();
    this.variantRadiosSyncForm.updateMedia();
    this.variantRadiosSyncForm.removeUnusedSizeOptions();
    this.variantRadiosSyncForm.toggleAddButton();
    this.dialog.openDialog();
  }

  async renderSizeChart() {
    if (this.dialogForm.querySelector('table')) return;

    try {
      // Fetch content from the href URL and display it in the dialog
      const response = await fetch(this.getAttribute('href'));
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${this.getAttribute('href')}`);
      }

      const content = await response.text();
      // this.dialogForm.innerHTML = content;
      const responseHTML = new DOMParser()
        .parseFromString(content, 'text/html')

      this.dialogForm.innerHTML = responseHTML.querySelector('table').outerHTML;

      if (this.dialog.querySelector('tab-contents [data-tab="how-to-measure"]')) {
        this.dialog.querySelector('tab-contents [data-tab="how-to-measure"]').innerHTML =
          responseHTML.querySelector('img').outerHTML;
      }
    } catch (error) {
      console.error(error);
      // Handle any error as needed
    }
  }

  updateLabelAttributes() {
    if (!this.dialogForm.querySelector('table') || this.dialogForm.querySelector('table')?.querySelector('input[type="radio"]').value) return;

    const radios = document.querySelectorAll('input[type="radio"][form="variant-radios-sync"]');

    radios.forEach(input => {
      const label = input.nextElementSibling; // Get the next sibling element (label)
      const labelText = label.textContent.trim();

      // Set the input's value attribute to the label text
      input.value = labelText;

      // Create a unique ID for the input and use it in the label's "for" attribute
      const id = `size-chart-${labelText}`;
      input.id = id;
      label.setAttribute('for', id);
    });
  }
}

// Define the custom element "size-chart" with the is attribute
customElements.define('size-chart', SizeChart, { extends: 'a' });

class VariantRadiosSyncForm extends HTMLFormElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.mainVariantSelect = document.querySelector('variant-radios, variant-selects');
    this.sizeChartRadioSelector = 'input[type="radio"][form="variant-radios-sync"]';

    // Add a change event listener to the custom element
    this.addEventListener('change', this.onSizeChange);
  }

  onSizeChange(event) {
    // Determining the selected size option from the size chart and selecting it on the main variant radios
    // When the size is selected, the main variant select custom element will dispatch change event 
    [...document.querySelectorAll('product-info input[type="radio"]:not([form="variant-radios-sync"])')]
      .find(input => input.name.toLowerCase() == 'size' && input.value.toLowerCase() == event.target.value.toLowerCase())
      .checked = true;

    this.updateMasterCurrentVariant();
    this.updateVariantInput();
    this.updateMedia();
    this.toggleAddButton();
  }

  updateVariantInput() {
    const productForm = document.querySelector(`#product-form-size-chart-${this.dataset.section}`);

    if (!productForm) return;

    productForm.querySelector('input[name="id"]')
      .value = this.mainVariantSelect.currentVariant.id;
  }

  toggleAddButton() {
    const disable = this.mainVariantSelect ? !this.mainVariantSelect.currentVariant.available : true
    const text = window.variantStrings.soldOut

    const productForm = document.getElementById(`product-form-size-chart-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }
  }

  updateSizeChartSelectedOption() {
    const sizeOptionPosition = parseInt(this.dataset.sizeOptionPosition);
    const selectedSizeOption = this.mainVariantSelect.currentVariant.options[sizeOptionPosition - 1]

    if (this.querySelector(`${this.sizeChartRadioSelector}:checked`))
      this.querySelector(`${this.sizeChartRadioSelector}:checked`).checked = false

    if (this.querySelector(`input[value="${selectedSizeOption}"]`))
      this.querySelector(`input[value="${selectedSizeOption}"]`).checked = true;
  }

  updateSizeStatuses() {
    const selectedOptionOneVariants = this.mainVariantSelect.getVariantData().filter(
      (variant) => this.mainVariantSelect.querySelector(':checked').value === variant.option1
    );

    // Removing the size chart fieldset from the array of fieldsets.
    // This assumes the size chart element is located within the main size fieldset for the index to work.
    const inputWrappers = [...this.mainVariantSelect.querySelectorAll('.product-form__input')]
      .filter(fieldset => fieldset.querySelector('legend')?.textContent.toLowerCase() != 'size');

    const index = inputWrappers
      .indexOf(this.mainVariantSelect.querySelector('.product-form__input#variant-radios-sync'));
    const optionInputs = [...this.querySelectorAll('input[type="radio"], option')];
    const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value;
    const availableOptionInputsValue = selectedOptionOneVariants
      .filter((variant) => variant.available && variant[`option${index}`] === previousOptionSelected)
      .map((variantOption) => variantOption[`option${index + 1}`]);

    this.mainVariantSelect.setInputAvailability(optionInputs, availableOptionInputsValue);
  }

  updateMedia() {
    this.productImageNode = this.closest('dialog').querySelector('.size-chart-product-image')
    if (this.productImageNode && this.mainVariantSelect.currentVariant.featured_image) {
      this.productImageNode.removeAttribute('srcset')
      this.productImageNode.src = this.mainVariantSelect.currentVariant.featured_image.src
    }
  }

  removeUnusedSizeOptions() {
    const sizeOptionPosition = parseInt(this.dataset.sizeOptionPosition);
    const allSizeOptions = this.mainVariantSelect.getVariantData().reduce((acc, curr) => {
      acc.push(curr[`option${sizeOptionPosition}`]);
      return acc;
    }, []);

    // Removing the size options from size chart that is not present in my main size option
    this.querySelectorAll(this.sizeChartRadioSelector).forEach(sizeInput => {
      if (!allSizeOptions.includes(sizeInput.value))
        sizeInput.closest('tr')?.remove()
    })
  }

  /**
   * Ensure that the latest current variant is assigned in the custom element.
   */
  updateMasterCurrentVariant() {
    this.mainVariantSelect.updateOptions();
    this.mainVariantSelect.updateMasterId();
  }
}

customElements.define('variant-radios-sync', VariantRadiosSyncForm, { extends: 'form' });

class SizeChartAddButton extends HTMLButtonElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.dialog = this.closest('#size-chart')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'class' && !newValue?.includes('loading') && oldValue?.includes('loading'))
      this.dialog.closeDialog()
  }

  static get observedAttributes() {
    return ['class'];
  }
}

customElements.define('size-chart-add-button', SizeChartAddButton, { extends: 'button' });

class MeasurementUnitToggler extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener('change', (event) => {
      const checkedRadio = event.target;
      if (checkedRadio.type === 'radio') {
        this.handleUnitToggle(checkedRadio);
      }
    });
  }

  handleUnitToggle(checkedRadio) {
    const targetSelector = this.getAttribute('data-target');
    const table = document.querySelector(targetSelector + ' table');
    const isCheckedInch = checkedRadio.id === 'in';

    this.convertUnits(table, isCheckedInch);
  }

  convertUnits(table, toInches) {
    // Update the header row unit labels
    this.replaceUnitLabel(table, toInches);

    // Skip the first column of the table (assuming the first row is a header)
    for (let i = 1; i < table.rows.length; i++) {
      const cells = table.rows[i].cells;
      for (let j = 1; j < cells.length; j++) {
        const value = cells[j].textContent;
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          const factor = toInches ? 0.393701 : 2.54;
          const convertedValue = this.replaceNumericValues(value, factor);
          cells[j].textContent = convertedValue;
        }
      }
    }
  }

  replaceNumericValues(inputString, factor, unit) {
    return inputString.replace(/(\d+(\.\d+)?)/g, (match) => {
      const numericValue = parseFloat(match);
      if (!isNaN(numericValue)) {
        // Convert the numeric part based on the factor
        const convertedValue = numericValue * factor;
        // Format it to two decimal places
        return convertedValue.toFixed(2);
      }
      // If it's not a numeric value, return it as is
      return match;
    });
  }

  replaceUnitLabel(table, toInches) {
    // Skip the first row (header) of the table
    const headerRow = table.rows[0];
    for (let j = 1; j < headerRow.cells.length; j++) {
      const cell = headerRow.cells[j];
      cell.textContent = cell.textContent.replace(/\([^)]*\)/, toInches ? ' (inches)' : ' (cm)');
    }
  }

}

customElements.define('measurement-unit-toggler', MeasurementUnitToggler);


