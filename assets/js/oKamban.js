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
      getListsFromAPI() {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/list`, "GET", null);
      },

      /** 
       * @method postNewListToAPI Post a new List to API
       * @param {any} newList A new List Object for sending to API
       * @returns {Promise} A List Object from API with id
       */
      async postNewListToAPI(newList) {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/list`, "POST", newList);
      },

      /** 
       * @method updateListToAPI Update a List to API
       * @param {any} list A List Object for sending to API
       */
      async updateListToAPI(list) {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/list/${list.id}`, "PATCH", list);
      }
    },
    card: {
      /** 
       * @method getCardsFromAPI Get all Cards from API
       * @returns {Promise} Array of Card Object from API
       */
      async getCardsFromAPI() {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/card`, "GET", null);
      },

      /** 
       * @method postcardFragmentToAPI Post a new Card to API
       * @param {any} cardFragment A new Card Object for sending to API
       * @returns {Promise} A Card Object from API with id
       */
      async postcardFragmentToAPI(cardFragment) {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/card`, "POST", cardFragment);
      },

      /** 
       * @method deleteCardById Delete a Card by ID
       * @param {String} cardId Target Card cardId to delete
       */
      async deleteCardById(cardId) {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/card/${cardId}`, "DELETE", null);
      },

      /** 
       * @method updateCardToAPI Update a card to API
       * @param {any} card A card Object for sending to API
       */
      async updateCardToAPI(card) {
        return oKamban.api.sendRequest(`${oKamban.api.base_url}/card/${card.id}`, "PATCH", card);
      }
    },

    /** 
     * @method sendRequest Prepare and Send request with fetch
     * @param {String} uri Complet REQUEST URI
     * @param {String} method HTML method ['GET','PUT','PATCH','POST','DELETE']
     * @param {all} bodyObj An object to transform to URL FORM ENCODED FORMAT
     * @returns {String} String represent object data as URL FORM ENCODED
     */
    async sendRequest(uri, method, bodyObj) {
      try {
        let responseOptions = {
          headers: {
            'Authorization': 'Bearer token',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: method
        };
        if (bodyObj) {
          responseOptions.body = oKamban.api.asUrlFormEncoded(bodyObj);
        }
        const response = await fetch(uri, responseOptions);
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
        alert(`Erreur d'API`);
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
       * @method toggleIsActiveHTMLElement Toggle display HTML Element with is-active css class
       * @param {HTMLElement} htmlElmt - HTML Element to toggle display 
       */
      toggleIsActiveHTMLElement(htmlElmt) {
        htmlElmt.classList.toggle('is-active');
      },

      /**
       * @method toggleIsHiddenHTMLElement Toggle display HTML Element with is-hidden css class 
       * @param {HTMLElement} htmlElmt - HTML Element to toggle display 
       */
      toggleIsHiddenHTMLElement(htmlElmt) {
        htmlElmt.classList.toggle('is-hidden');
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
     * @method clickToggleIsActiveHTMLElement Handle click on toggle display HTML Element button   
     * @param {HTMLElement} htmlElmt - HTML Element to toggle display 
     * @returns {CallableFunction} a callable function to Handle click on toggle display HTML Element button 
     */
    clickToggleIsActiveHTMLElement(htmlElmt) {
      return (_) => {
        oKamban.handleEvent.tools.toggleIsActiveHTMLElement(htmlElmt);
      };
    },

    /**
     * @method submitAddListForm Handle Submit event on AddListModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddListForm(event) {
      var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKamban.domUpdates.fromFormData.createList(formData);
      oKamban.handleEvent.tools.toggleIsActiveHTMLElement(oKamban.elements.addListModal);
    },

    /**
     * @method submitAddCardForm Handle Submit event on AddCardModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddCardForm(event) {
      var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKamban.domUpdates.fromFormData.createCard(formData);
      oKamban.handleEvent.tools.toggleIsActiveHTMLElement(oKamban.elements.addCardModal);
    },

    /**
     * @method clickAddCardModal Handle click event on addCardModal Form and set listId on this form
     * @param {String} listId - listId value to set listId in addCardModal Form
     * @return {CallableFunction} a callable function to Handle click event on addCardModal Form and set listId on this form 
     */
    clickAddCardModal(listId) {
      return (_) => {
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.querySelector('#formCardList_id').value = listId;
        oKamban.handleEvent.tools.toggleIsActiveHTMLElement(oKamban.elements.addCardModal);
      }
    },

    /**
     * @method clickDeleteCardOnList Handle click event on deleteCard button
     * @param {String} listId - target List listId
     * @param {String} cardId - target Card cardId
     * @return {CallableFunction} a callable function to Handle click event on deleteCard button 
     */
    clickDeleteCardOnList(listId, cardId) {
      return (_) => {
        oKamban.domUpdates.fromFormData.deleteCard(listId, cardId);
      }
    },

    /**
     * @method clickEditCardOnList Handle click event on editCard button
     * @param {String} cardId - Target Card cardId to edit
     * @param {String} listId - Target List listId which come from card to edit
     * @return {CallableFunction} a callable function to Handle click event on editCard button 
     */
    clickEditCardOnList() {
      return (event) => {
        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.columns').querySelectorAll('.column')[0];
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        cardNameFormElmt.querySelector('input[type="text"]').value = cardNameElmt.textContent;
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
      }
    },

    /**
     * @method submitCardUpdateForm Handle submit event on list Title Form
     * @param {String} listId - target List listId
     * @param {String} cardId - target Card cardId
     * @return {CallableFunction} a callable function to Handle submit event on list Title Form
     */
    submitCardUpdateForm(listId, cardId) {
      return async (event) => {
        var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);
        oKamban.domUpdates.fromFormData.updateCard(formData, listId, cardId);

        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.columns').querySelectorAll('.column')[0];
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
      };
    },

    /**
     * @method dblClickOnListTitle Handle double click event on list Title
     * @param {String} listId - target List listId
     * @return {CallableFunction} a callable function to Handle double click event on list Title
     */
    dblClickOnListTitle(listId) {
      return (_) => {
        const target_list = oKamban.domUpdates.tools.queryListElmtById(listId);
        const listTitleElmt = target_list.querySelector('h2');
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(listTitleElmt);

        const listTitleFormElmt = target_list.querySelector('form');
        listTitleFormElmt.querySelector('input[type="text"]').value = listTitleElmt.textContent;
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(listTitleFormElmt);
      }
    },

    /**
     * @method submitUpdateListForm Handle submit event on list Title Form
     * @param {String} listId - target List listId
     * @return {CallableFunction} a callable function to Handle submit event on list Title Form
     */
    submitUpdateListForm(listId) {
      return async (event) => {
        var formData = oKamban.handleEvent.tools.getDataFormFrmFormSubmit(event);

        oKamban.domUpdates.fromFormData.updateList(formData, listId);

        const target_list = oKamban.domUpdates.tools.queryListElmtById(listId);
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('form'));
        oKamban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('h2'));
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
    fromFormData: {

      /**
       * @method createList Create list from FormData
       * @param {FormData} formData
       */
      async createList(formData) {
        let newList = {
          name: formData.get('formListName'),
          position: oKamban.data.length
        };
        newList = await oKamban.api.list.postNewListToAPI(newList);
        newList.cards = [];
        if (newList) {
          oKamban.data.push(newList);
          oKamban.domUpdates.makeListInDOM(newList);
        }
      },

      /**
       * @method updateList Update list from FormData
       * @param {FormData} formData
       * @param {String} listId - target List listId
       */
      async updateList(formData, listId) {
        const list = oKamban.data.find((list) => {
          return list.id == listId;
        });
        list.name = formData.get("list-name");
        const response = await oKamban.api.list.updateListToAPI(list);

        if (response) {
          oKamban.domUpdates.updateListInDom(list);
        } else {
          const target_list = oKamban.domUpdates.tools.queryListElmtById(listId);
          list.name = listTitleElmt.textContent;
        }
      },

      /**
       * @method createCard Create card from FormData
       * @param {FormData} formData
       */
      async createCard(formData) {
        let parentList = oKamban.data.find((list) => {
          return list.id == formData.get('formCardList_id')
        });
        let newCard = {
          title: formData.get('formCardName'),
          position: parentList.cards.length,
          // color : formData.get('formCardColor'),
          list_id: parentList.id
        }
        newCard = await oKamban.api.card.postcardFragmentToAPI(newCard);
        if (newCard) {
          parentList.cards.push(newCard);
          oKamban.domUpdates.makeCardInDom(parentList, newCard);
        }
      },

      /**
       * @method updateCard Update card from FormData
       * @param {FormData} formData
       * @param {String} listId - target List listId
       * @param {String} cardId - target Card cardId
       */
      async updateCard(formData, listId, cardId) {
        const list = oKamban.data.find((list) => {
          return list.id == listId;
        });

        const card = list.cards.find((card) => {
          return card.id == cardId;
        })

        card.title = formData.get('carte-name');
        // card.position = formData.get('carte-position');
        // card.color = formData.get('carte-color');

        response = await oKamban.api.card.updateCardToAPI(card);
        if (response) {
          oKamban.domUpdates.updateCardInDom(card);
        } else {
          const target_card = oKamban.domUpdates.tools.queryCardElmtById(cardId);
          card.title = target_card.querySelector('.columns').querySelectorAll('.column')[0].textContent;
          card.color = target_card.style.background;
        }
      },

      /**
       * @method deleteCard Delete card from user action
       * @param {String} listId - target List listId
       * @param {String} cardId - target Card cardId
       */
      async deleteCard(listId, cardId) {
        const list = oKamban.data.find((list) => {
          return list.id == listId;
        });

        const card = list.cards.find((card) => {
          return card.id == cardId;
        })
        const response = await oKamban.api.card.deleteCardById(cardId);
        if (response) {
          oKamban.domUpdates.deleteCardInDOM(card);
          list.cards = list.cards.filter((card) => {
            return card.id != cardId;
          });
        }
      }
    },

    /**
     * @method makeListInDOM  Make a new List in DOM
     * @param {all} list list object
     */
    makeListInDOM(list) {
      if ("content" in document.createElement('template')) {
        const fragmentList = document.importNode(oKamban.elements.templateList.content, true);
        fragmentList.querySelector('div[list-id]').setAttribute('list-id', list.id);

        const listTitleElmt = fragmentList.querySelector('h2');
        listTitleElmt.textContent = list.name;
        listTitleElmt.addEventListener('dblclick', oKamban.handleEvent.dblClickOnListTitle(list.id));

        const addCardBt = fragmentList.querySelector('.fa-plus').closest('a');
        addCardBt.addEventListener('click', oKamban.handleEvent.clickAddCardModal(list.id));

        oKamban.elements.containerList.appendChild(fragmentList);
      }
    },

    /**
     * @method updateListInDom Update a list in DOM.
     * @param {all} list List object
     */
    async updateListInDom(list) {
      const target_list = oKamban.domUpdates.tools.queryListElmtById(list.id);
      const listTitleElmt = target_list.querySelector('h2');
      listTitleElmt.textContent = list.name;
    },

    /**
     * @method makeCardInDom Make a new Card in DOM
     * @param {all} list list object
     * @param {all} card card object
     */
    async makeCardInDom(list, card) {
      if ("content" in document.createElement('template')) {
        const target_list = oKamban.domUpdates.tools.queryListElmtById(list.id);
        const card_container = target_list.querySelector('.panel-block');
        const cardFragment = document.importNode(oKamban.elements.templateCard.content, true);

        cardFragment.querySelector('.columns').querySelectorAll('.column')[0].textContent = card.title;
        cardFragment.querySelector('div[card-id]').setAttribute('card-id', card.id);
        cardFragment.querySelector('div[card-id]').style.background = card.color;

        const editCardBt = cardFragment.querySelector('.fa-pencil-alt').closest('a');
        editCardBt.addEventListener('click', oKamban.handleEvent.clickEditCardOnList());

        const cardeTitleFormElmt = cardFragment.querySelector('form');
        cardeTitleFormElmt.addEventListener('submit', oKamban.handleEvent.submitCardUpdateForm(list.id, card.id));

        const deleteCardBt = cardFragment.querySelector('.fa-trash-alt').closest('a');
        deleteCardBt.addEventListener('click', oKamban.handleEvent.clickDeleteCardOnList(list.id, card.id));

        card_container.appendChild(cardFragment);
      }
    },

    /**
     * @method updateCardInDom Update a card in DOM.
     * @param {all} card card object
     */
    async updateCardInDom(card) {
      const target_card = oKamban.domUpdates.tools.queryCardElmtById(card.id);
      target_card.querySelector('.columns').querySelectorAll('.column')[0].textContent = card.title;
      target_card.style.background = card.color;
    },

    /**
     * @method deleteCardInDOM Delete a card in DOM
     * @param {all} card card object
     */
    async deleteCardInDOM(card) {
      const target_card = oKamban.domUpdates.tools.queryCardElmtById(card.id);
      target_card.remove();
    },

    /**
     * @method makeAllListWithCardsFromApi  Make and Add new Liste with cards in body from API Response
     * @param {Array} lists Array of list Object from API response
     */
    makeAllListWithCardsFromApi(lists) {
      if ("content" in document.createElement('template')) {
        lists.sort((apiListObj1, apiListObj2) => {
          return apiListObj1.position < apiListObj2.position ? -1 : (apiListObj1.position > apiListObj2.position ? 1 : 0);
        }).forEach((apiListObj) => {
          oKamban.domUpdates.makeListInDOM(apiListObj);
          oKamban.domUpdates.makeAllCardsFromApiInList(apiListObj);
        });
      }
    },

    /**
     * @method makeAllCardsFromApiInList  Make and Add new Liste with cards in body from API Response
     * @param {all} list list object
     */
    makeAllCardsFromApiInList(list) {
      if ("content" in document.createElement('template')) {
        list.cards.sort((apiCardObj1, apiCardObj2) => {
          return apiCardObj1.position < apiCardObj2.position ? -1 : (apiCardObj1.position > apiCardObj2.position ? 1 : 0);
        }).forEach((apiCardObj) => {
          oKamban.domUpdates.makeCardInDom(list, apiCardObj);
        });
      }
    },
  },

  /**
   * @method initListener Refresh All oKamban listeners
   */
  initListener() {
    // Submit Event Listener on "AddListModal" Form
    oKamban.elements.addListModalForm.addEventListener('submit', oKamban.handleEvent.submitAddListForm);
    // Click Event Listener on "add list" Button
    oKamban.elements.addListModalAddButton.addEventListener('click', oKamban.handleEvent.clickToggleIsActiveHTMLElement(oKamban.elements.addListModal));
    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', oKamban.handleEvent.clickToggleIsActiveHTMLElement(oKamban.elements.addListModal));
    });


    // Submit Event Listener on "AddCardModal" Form
    oKamban.elements.addCardModalForm.addEventListener('submit', oKamban.handleEvent.submitAddCardForm);
    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', oKamban.handleEvent.clickToggleIsActiveHTMLElement(oKamban.elements.addCardModal));
    });
  },

  /**
   * @method refreshOkamban Refresh All oKamban lists and cards from API
   */
  async refreshOkamban() {
    oKamban.data = await oKamban.api.list.getListsFromAPI();
    if (oKamban.data) {
      oKamban.domUpdates.makeAllListWithCardsFromApi(oKamban.data);
    }
  }
};

// Start oKamban application on DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', oKamban.init);