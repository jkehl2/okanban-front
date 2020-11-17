// on objet qui contient des fonctions
let listCount = 1;
let cardCount = 1;
const app = {
  init: function () {
    app.refreshListener();
  },

  elements: {
    addListModal: document.getElementById('addListModal'),
    addCardModal: document.getElementById('addCardModal'),
  },

  handleEvent: {
    tools: {
      /**
       * Toggle Modal Form div display 
       * @param {HTMLElement} htmlElmt - Element HTML à afficher/masquer
       */
      toggleHTMLElement(htmlElmt) {
        htmlElmt.classList.toggle('is-active');
      },
      /**
       * Get Data Form from submit event 
       * @param {Event} event - submit event
       */
      getDataForm(event) {
        event.preventDefault();
        return formData = new FormData(event.target);
      },
    },

    /**
     * Toggle List Form modal div display 
     */
    toggleAddListModal() {
      app.handleEvent.tools.toggleHTMLElement(app.elements.addListModal);
    },

    /**
     * Toggle Card Form modal div display 
     */
    toggleAddCardModal() {
      app.handleEvent.tools.toggleHTMLElement(app.elements.addCardModal);
    },

    /**
     * Handle Submit event Form for AddListForm
     * @param {Event} event 
     */
    submitAddListForm(event) {
      var formData = app.handleEvent.tools.getDataForm(event);
      app.domUpdates.makeListInDOM(formData);
      app.handleEvent.toggleAddListModal();
      app.refreshListener();
    },

    /**
     * Handle Submit event Form for AddCardForm
     * @param {Event} event 
     */
    submitAddCardForm(event) {
      var formData = app.handleEvent.tools.getDataForm(event);
      app.domUpdates.makeCardInDOM(formData);
      app.handleEvent.toggleAddCardModal();
      app.refreshListener();
    },
  },

  domUpdates: {
    /**
     *  Make and Add a new Liste in body
     * @param {FormData} formData form data from AddListModal Form
     */
    makeListInDOM(formData) {
      if ("content" in document.createElement("template")) {
        const list_template = document.querySelector("#template_list");
        const list_container = document.querySelector(".card-lists");

        const newList = document.importNode(list_template.content, true);
        newList.querySelector('div[list-id]').setAttribute('list-id', `List_${listCount++}`);
        newList.querySelector('h2').textContent = formData.get('formListName');

        list_container.appendChild(newList);
      }
    },

    /**
     * Make and Add a new Card in a spécific List
     * @param {FormData} formData form data from AddListModal Form
     */
    makeCardInDOM(formData) {
      if ("content" in document.createElement("template")) {
        const card_template = document.querySelector("#template_card");
        const target_list = document.querySelector(`div[list-id="${formData.get('formCardList_id')}"]`);
        const card_container = target_list.querySelector(".panel-block");

        const newCard = document.importNode(card_template.content, true);
        newCard.querySelector('.columns').querySelectorAll(".column")[0].textContent = formData.get('formCardName');
        newCard.querySelector('div[card-id]').setAttribute('card-id', `Card_${cardCount++}`);
        card_container.appendChild(newCard);
      }
    },
  },

  /**
   * Refresh All app listeners
   */
  refreshListener() {
    // Submit Event Listener on "AddListModal" Form
    document.getElementById('modalListForm').removeEventListener('submit', app.handleEvent.submitAddListForm);
    document.getElementById('modalListForm').addEventListener('submit', app.handleEvent.submitAddListForm);


    // Click Event Listener on "add list" Button
    document.getElementById('addListButton').removeEventListener('click', app.handleEvent.toggleAddListModal);
    document.getElementById('addListButton').addEventListener('click', app.handleEvent.toggleAddListModal);


    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.removeEventListener('click', app.handleEvent.toggleAddListModal);
      buttonClose.addEventListener('click', app.handleEvent.toggleAddListModal);
    });

    // Submit Event Listener on "AddCardModal" Form
    document.getElementById('modalCardForm').removeEventListener('submit', app.handleEvent.submitAddCardForm);
    document.getElementById('modalCardForm').addEventListener('submit', app.handleEvent.submitAddCardForm);


    // Click Event Listener on all "add card" Button
    const addCardBts = document.querySelectorAll('.addCardBt');
    addCardBts.forEach((addCardBt) => {
      addCardBt.removeEventListener('click', app.setListIdOnCardFormModal);
      addCardBt.addEventListener('click', app.setListIdOnCardFormModal);
    });

    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.removeEventListener('click', app.handleEvent.toggleAddCardModal);
      buttonClose.addEventListener('click', app.handleEvent.toggleAddCardModal);
    });
  },

  /**
   * Set ListId On Card Form Modal 
   * @param {Event} event 
   */
  setListIdOnCardFormModal(event) {
    const addCardModal = document.getElementById('addCardModal');
    //const list_id = event.currentTarget.parentElement.parentElement.parentElement.parentElement.getAttribute('list-id');
    const list_id = event.currentTarget.closest('div[list-id]').getAttribute('list-id');
    addCardModal.querySelector('#formCardList_id').value = list_id;
    app.handleEvent.toggleAddCardModal(event);
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);