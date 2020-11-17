/**
 * @module oKamban oKamban application module
 * @version 1.0.0
 * @author jkehl
 */
const oKamban = {
  listCount: 1,
  cardCount: 1,
  /**
   * @method init Initialize oKamban application 
   */
  init: function () {
    oKamban.refreshListener();
  },

  elements: {
    addListModalAddButton: document.getElementById('addListButton'),
    addListModal: document.getElementById('addListModal'),
    addListModalForm: document.getElementById('modalListForm'),
    addCardModal: document.getElementById('addCardModal'),
    addCardModalForm: document.getElementById('modalCardForm'),
    templateList: document.getElementById('template_list'),
    templateCard: document.getElementById('template_card'),
    containerList: document.querySelector('.card-lists')
  },

  handleEvent: {
    tools: {
      /**
       * @method toggleHTMLElement Toggle display HTML Element 
       * @param {HTMLElement} htmlElmt - HTML Element to toggle display 
       */
      toggleHTMLElement(htmlElmt) {
        htmlElmt.classList.toggle('is-active');
      },

      /**
       * @method getDataFormFrmFormSubmit Get Data Form from Form submit event 
       * @param {Event} event - Submit Form event
       * @returns {FormData} A FormData construct with event target Form Inputs
       */
      getDataFormFrmFormSubmit(event) {
        event.preventDefault();
        return formData = new FormData(event.target);
      },
    },

    /**
     * @method clickToggleHTMLElement Handle click on toggle display HTML Element button   
     * @param {HTMLElement} htmlElmt - HTML Element to toggle display 
     * @returns {CallableFunction} a callable function to Handle click on toggle display HTML Element button 
     */
    clickToggleHTMLElement(htmlElmt) {
      return (_) => {
        oKamban.handleEvent.tools.toggleHTMLElement(htmlElmt);
      };
    },

    /**
     * @method submitAddListForm Handle Submit event on AddListModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddListForm(event) {
      var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKamban.domUpdates.makeListInDOM(formData);
      oKamban.handleEvent.tools.toggleHTMLElement(oKamban.elements.addListModal);
      oKamban.refreshListener();
    },

    /**
     * @method submitAddCardForm Handle Submit event on AddCardModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddCardForm(event) {
      var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKamban.domUpdates.makeCardInList(formData);
      oKamban.handleEvent.tools.toggleHTMLElement(oKamban.elements.addCardModal);
      oKamban.refreshListener();
    },

    /**
     * @method clickAddCardModal Handle click event on addCardModal Form and set  ListId on this form
     * @param {Event} event 
     */
    clickAddCardModal(event) {
      const addCardModal = document.getElementById('addCardModal');
      const list_id = event.currentTarget.closest('div[list-id]').getAttribute('list-id');
      addCardModal.querySelector('#formCardList_id').value = list_id;
      oKamban.handleEvent.tools.toggleHTMLElement(oKamban.elements.addCardModal);
    }
  },

  domUpdates: {
    tools: {
      /**
       * @method queryListElmtById Get a List HTML Element by listId
       * @param {String} listId
       * @returns {HTMLElement} List HTML Element with list-id attribut equal to listId param
       */
      queryListElmtById(listId) {
        return document.querySelector(`div[list-id="${listId}"]`)
      },

      /**
       * @method queryCardElmtById Get a Card HTML Element by cardId
       * @param {String} cardId
       * @returns {HTMLElement} Card HTML Element with card-id attribut equal to cardId param
       */
      queryCardElmtById(cardId) {
        return document.querySelector(`div[card-id="${cardId}"]`)
      }
    },

    /**
     * @method makeListInDOM  Make and Add a new Liste in body
     * @param {FormData} formData form data from AddListModal Form
     */
    makeListInDOM(formData) {
      if ("content" in document.createElement('template')) {
        const newList = document.importNode(oKamban.elements.templateList.content, true);
        newList.querySelector('div[list-id]').setAttribute('list-id', `List_${oKamban.listCount++}`);
        newList.querySelector('h2').textContent = formData.get('formListName');
        oKamban.elements.containerList.appendChild(newList);
      }
    },

    /**
     * @method makeCardInList Make and Add a new Card in a spécific List
     * @param {FormData} formData form data from AddListModal Form
     */
    makeCardInList(formData) {
      if ("content" in document.createElement('template')) {
        const target_list = oKamban.domUpdates.tools.queryListElmtById(formData.get('formCardList_id'));
        const card_container = target_list.querySelector('.panel-block');
        const newCard = document.importNode(oKamban.elements.templateCard.content, true);
        newCard.querySelector('.columns').querySelectorAll('.column')[0].textContent = formData.get('formCardName');
        newCard.querySelector('div[card-id]').setAttribute('card-id', `Card_${oKamban.cardCount++}`);
        card_container.appendChild(newCard);
      }
    }
  },

  /**
   * @method refreshListener Refresh All oKamban listeners
   */
  refreshListener() {
    // Submit Event Listener on "AddListModal" Form
    oKamban.elements.addListModalForm.removeEventListener('submit', oKamban.handleEvent.submitAddListForm);
    oKamban.elements.addListModalForm.addEventListener('submit', oKamban.handleEvent.submitAddListForm);
    // Click Event Listener on "add list" Button
    oKamban.elements.addListModalAddButton.removeEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addListModal));
    oKamban.elements.addListModalAddButton.addEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addListModal));
    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.removeEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addListModal));
      buttonClose.addEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addListModal));
    });


    // Submit Event Listener on "AddCardModal" Form
    oKamban.elements.addCardModalForm.removeEventListener('submit', oKamban.handleEvent.submitAddCardForm);
    oKamban.elements.addCardModalForm.addEventListener('submit', oKamban.handleEvent.submitAddCardForm);
    // Click Event Listener on all "add card" Button
    const addCardBts = document.querySelectorAll('.addCardBt');
    addCardBts.forEach((addCardBt) => {
      addCardBt.removeEventListener('click', oKamban.handleEvent.clickAddCardModal);
      addCardBt.addEventListener('click', oKamban.handleEvent.clickAddCardModal);
    });
    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.removeEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addCardModal));
      buttonClose.addEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addCardModal));
    });
  }
};

// Start oKamban application on DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', oKamban.init);