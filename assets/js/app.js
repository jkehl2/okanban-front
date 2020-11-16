// on objet qui contient des fonctions
let listCount = 1;
const app = {
  init: function () {
    console.log('app.init !');
    app.modalManage();
    app.formListManage();
  },

  formListManage() {
    document.getElementById('modalListForm').removeEventListener('submit', app.handleAddListForm);
    document.getElementById('modalListForm').addEventListener('submit', app.handleAddListForm);

    document.getElementById('modalCardForm').removeEventListener('submit', app.handleAddCardForm);
    document.getElementById('modalCardForm').addEventListener('submit', app.handleAddCardForm);
  },

  modalManage() {
    document.getElementById('addListButton').removeEventListener('click', app.toggleListFormModal);
    document.getElementById('addListButton').addEventListener('click', app.toggleListFormModal);

    const addCardBts = document.querySelectorAll('.addCardBt');
    addCardBts.forEach((addCardBt) => {
      addCardBt.removeEventListener('click', app.setListIdOnCardFormModal);
      addCardBt.addEventListener('click', app.setListIdOnCardFormModal);
    });
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.removeEventListener('click', app.toggleListFormModal);
      buttonClose.addEventListener('click', app.toggleListFormModal);
    });

    let closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.removeEventListener('click', app.toggleCardFormModal);
      buttonClose.addEventListener('click', app.toggleCardFormModal);
    });
  },

  /**
   * Toggle List Form modal div display 
   */
  toggleListFormModal(_) {
    document.getElementById('addListModal').classList.toggle('is-active');
  },

  /**
   * Toggle Card Form modal div display 
   * @param {Event} event 
   */
  toggleCardFormModal(_) {
    document.getElementById('addCardModal').classList.toggle('is-active');
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
    app.toggleCardFormModal(event);
  },

  /**
   * Handle Add List Form submit event
   * @param {Event} event 
   */
  handleAddListForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);


    app.makeListInDOM(formData);
    app.toggleListFormModal();
    app.init();
  },

  /**
   * Handle Add Card Form submit event
   * @param {Event} event 
   */
  handleAddCardForm(event) {
    event.preventDefault();
    console.log(event.target);
    const formData = new FormData(event.target);
    for (const key of formData.keys()) {
      console.log(key);
    }
    app.makeCardInDOM(formData);
    app.toggleCardFormModal();
    app.init();
  },

  /**
   *  Make Liste In my DOM 
   * @param {FormData} formData 
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
   *  Make Card In my DOM 
   * @param {FormData} formData 
   */
  makeCardInDOM(formData) {
    if ("content" in document.createElement("template")) {
      const card_template = document.querySelector("#template_card");
      const target_list = document.querySelector(`div[list-id="${formData.get('formCardList_id')}"]`);
      const card_container = target_list.querySelector(".panel-block");

      const newCard = document.importNode(card_template.content, true);
      newCard.querySelector('.columns').querySelectorAll(".column")[0].textContent = formData.get('formCardName');
      card_container.appendChild(newCard);
    }
  },
};

// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);