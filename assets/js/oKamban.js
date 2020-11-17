/**
 * @module oKamban oKamban application module
 * @version 1.0.0
 * @author jkehl
 */
const oKamban = {
  /**
   * @method init Initialize oKamban application 
   */
  init() {
    oKamban.initListener();
    oKamban.refreshOkamban();
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
  api: {
    base_url: 'http://localhost:3000',
    list: {
      /** 
       * @method getListsFromAPI Get all list from API
       * @returns {Promise} Array of List Object from API
       */
      async getListsFromAPI() {
        try {
          const response = await fetch(`${oKamban.api.base_url}/list`);
          const data = await response.json();
          if (response.status == 200) {
            return data;
          } else if (data.error) {
            console.log(data.error);
            alert(data.error);
            return null;
          } else {
            throw new Error('Unexpected server error occured');
          }
        } catch (err) {
          console.error(err);
        }
      },

      /** 
       * @method postNewListToAPI Post a new List to API
       * @param {any} newList A new List Object for sending to API
       * @returns {Promise} A List Object from API with id
       */
      async postNewListToAPI(newList) {
        try {
          const response = await fetch(`${oKamban.api.base_url}/list`, {
            headers: {
              'Authorization': 'Bearer token',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            body: oKamban.api.asUrlFormEncoded(newList)
          });
          const data = await response.json();
          if (response.status == 200) {
            return data;
          } else if (data.error) {
            console.log(data.error);
            alert(data.error);
            return null;
          } else {
            throw new Error('Unexpected server error occured');
          }
        } catch (err) {
          console.error(err);
        }
      },
    },
    card: {
      /** 
       * @method getCardsFromAPI Get all Cards from API
       * @returns {Promise} Array of Card Object from API
       */
      async getCardsFromAPI() {
        try {
          const response = await fetch(`${oKamban.api.base_url}/card`);
          const data = await response.json();
          if (response.status == 200) {
            return data;
          } else if (data.error) {
            console.log(data.error);
            alert(data.error);
            return null;
          } else {
            throw new Error('Unexpected server error occured');
          }
        } catch (err) {
          console.error(err);
        }
      },

      /** 
       * @method postNewCardToAPI Post a new Card to API
       * @param {any} newCard A new Card Object for sending to API
       * @returns {Promise} A Card Object from API with id
       */
      async postNewCardToAPI(newCard) {
        try {
          const response = await fetch(`${oKamban.api.base_url}/card`, {
            headers: {
              'Authorization': 'Bearer token',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            body: oKamban.api.asUrlFormEncoded(newCard)
          });
          const data = await response.json();
          if (response.status == 200) {
            return data;
          } else if (data.error) {
            console.log(data.error);
            alert(data.error);
            return null;
          } else {
            throw new Error('Unexpected server error occured');
          }
        } catch (err) {
          console.error(err);
        }
      }
    },

    /** 
     * @method asUrlFormEncoded Transform object to URL FORM ENCODED FORMAT
     * @param {all} obj An object to transform to URL FORM ENCODED FORMAT
     * @returns {String} String represent object data as URL FORM ENCODED
     */
    asUrlFormEncoded(obj) {
      let formBody = [];
      for (let property in obj) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(obj[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      return formBody.join("&");
    }
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
    },

    /**
     * @method submitAddCardForm Handle Submit event on AddCardModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddCardForm(event) {
      var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKamban.domUpdates.makeCardInList(formData);
      oKamban.handleEvent.tools.toggleHTMLElement(oKamban.elements.addCardModal);
    },

    /**
     * @method clickAddCardModal Handle click event on addCardModal Form and set listId on this form
     * @param {String} listId - listId value to set listId in addCardModal Form
     * @return {CallableFunction} a callable function to Handle click event on addCardModal Form and set listId on this form 
     */
    clickAddCardModal(listId) {
      return (event) => {
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.querySelector('#formCardList_id').value = listId;
        oKamban.handleEvent.tools.toggleHTMLElement(oKamban.elements.addCardModal);
      }
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
    async makeListInDOM(formData) {
      const listTmp = await oKamban.api.list.postNewListToAPI({
        name: formData.get('formListName'),
        position: oKamban.data.length
      });
      if (listTmp) {
        oKamban.data.push(listTmp);
        if ("content" in document.createElement('template')) {
          const newList = document.importNode(oKamban.elements.templateList.content, true);
          // const listId = `List_${oKamban.listCount++}`;
          newList.querySelector('div[list-id]').setAttribute('list-id', listTmp.id);
          newList.querySelector('h2').textContent = formData.get('formListName');
          const addCardBt = newList.querySelector('.fa-plus');
          addCardBt.addEventListener('click', oKamban.handleEvent.clickAddCardModal(listTmp.id));
          oKamban.elements.containerList.appendChild(newList);
        }
      }
    },

    /**
     * @method makeCardInList Make and Add a new Card in a spécific List
     * @param {FormData} formData form data from AddListModal Form
     */
    async makeCardInList(formData) {
      const listTmp = oKamban.data.find((list) => {
        return list.id == formData.get('formCardList_id')
      });
      const cardTmp = await oKamban.api.card.postNewCardToAPI({
        title: formData.get('formCardName'),
        position: listTmp.cards.length,
        list_id: listTmp.id
      });
      if (cardTmp) {
        listTmp.cards.push(cardTmp);
        if ("content" in document.createElement('template')) {
          const target_list = oKamban.domUpdates.tools.queryListElmtById(formData.get('formCardList_id'));
          const card_container = target_list.querySelector('.panel-block');
          const newCard = document.importNode(oKamban.elements.templateCard.content, true);
          newCard.querySelector('.columns').querySelectorAll('.column')[0].textContent = formData.get('formCardName');
          newCard.querySelector('div[card-id]').setAttribute('card-id', cardTmp.id);
          card_container.appendChild(newCard);
        }
      }

    },

    /**
     * @method makeListWithCardsFromApi  Make and Add new Liste with cards in body from API Response
     * @param {Array} lists Array of list Object from API response
     */
    makeListWithCardsFromApi(lists) {
      if ("content" in document.createElement('template')) {
        lists.sort((apiListObj1, apiListObj2) => {
          return apiListObj1.position < apiListObj2.position ? -1 : (apiListObj1.position > apiListObj2.position ? 1 : 0);
        }).forEach((apiListObj) => {
          const newList = document.importNode(oKamban.elements.templateList.content, true);
          newList.querySelector('div[list-id]').setAttribute('list-id', apiListObj.id);
          newList.querySelector('h2').textContent = apiListObj.name;
          const addCardBt = newList.querySelector('.addCardBt');
          addCardBt.addEventListener('click', oKamban.handleEvent.clickAddCardModal(apiListObj.id));
          const cardContainer = newList.querySelector('.panel-block');
          oKamban.domUpdates.makeCardFromApiToList(apiListObj.cards, cardContainer);
          oKamban.elements.containerList.appendChild(newList);
        });
      }
    },

    /**
     * @method makeCardFromApiToList  Make and Add new Liste with cards in body from API Response
     * @param {Array} cards Array of cards Object from API response
     * @param {HTMLElement} cardContainer Card container
     */
    makeCardFromApiToList(cards, cardContainer) {
      if ("content" in document.createElement('template')) {
        cards.sort((apiCardObj1, apiCardObj2) => {
          return apiCardObj1.position < apiCardObj2.position ? -1 : (apiCardObj1.position > apiCardObj2.position ? 1 : 0);
        }).forEach((apiCardObj) => {
          const newCard = document.importNode(oKamban.elements.templateCard.content, true);
          newCard.querySelector('.columns').querySelectorAll('.column')[0].textContent = apiCardObj.title;
          cardDiv = newCard.querySelector('div[card-id]');
          cardDiv.setAttribute('card-id', apiCardObj.id);
          cardDiv.style.background = apiCardObj.color;
          cardContainer.appendChild(newCard);
        });
      }
    }
  },

  /**
   * @method initListener Refresh All oKamban listeners
   */
  initListener() {
    // Submit Event Listener on "AddListModal" Form
    oKamban.elements.addListModalForm.addEventListener('submit', oKamban.handleEvent.submitAddListForm);
    // Click Event Listener on "add list" Button
    oKamban.elements.addListModalAddButton.addEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addListModal));
    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addListModal));
    });


    // Submit Event Listener on "AddCardModal" Form
    oKamban.elements.addCardModalForm.addEventListener('submit', oKamban.handleEvent.submitAddCardForm);
    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', oKamban.handleEvent.clickToggleHTMLElement(oKamban.elements.addCardModal));
    });
  },

  /**
   * @method refreshOkamban Refresh All oKamban lists and cards from API
   */
  async refreshOkamban() {
    oKamban.data = await oKamban.api.list.getListsFromAPI();
    if (oKamban.data) {
      oKamban.domUpdates.makeListWithCardsFromApi(oKamban.data);
    }
  }
};

// Start oKamban application on DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', oKamban.init);