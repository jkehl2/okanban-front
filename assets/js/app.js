// on objet qui contient des fonctions
var app = {
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    console.log('app.init !');
    app.modalManage();
    app.formManage();
  },

  formManage() {
    document.getElementById('modalForm').addEventListener('submit', app.handleForm);
  },

  modalManage() {
    document.getElementById('addListButton').addEventListener('click', app.toggleModal);
    const closeBt = document.querySelectorAll('.close');
    closeBt.forEach((buttonClose) => {
      buttonClose.addEventListener('click', app.toggleModal);
    });
  },

  /**
   * Toggle modal div display 
   * @param {Event} event 
   */
  toggleModal(event) {
    document.getElementById('addListModal').classList.toggle('is-active');
  },

  /**
   * Handle Form submit event
   * @param {Event} event 
   */
  handleForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    app.makeListInDOM(formData);
  },

  /**
   *  Make Liste In my DOM 
   * @param {FormData} formData 
   */
  makeListInDOM(formData) {
    if ("content" in document.createElement("template")) {
      var list_template = document.querySelector("#template_list");
      var list_container = document.querySelector(".card-lists");

      var newList = document.importNode(list_template.content, true);
      // TODO AJout des données de la liste
      
      list_container.appendChild(newList);
    }
  },
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);