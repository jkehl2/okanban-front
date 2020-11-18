/**
 * @module oKanban oKanban application module
 * @version 1.0.0
 * @author jkehl
 */
const oKanban = {
  /**
   * @method init Initialize oKanban application 
   */
  init() {
    oKanban.initListener();
    oKanban.refreshOkanban();
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
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/list`, "GET", null);
      },

      /** 
       * @method postNewListToAPI Post a new List to API
       * @param {any} newList A new List Object for sending to API
       * @returns {Promise} A List Object from API with id
       */
      async postNewListToAPI(newList) {
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/list`, "POST", newList);
      },

      /** 
       * @method updateListToAPI Update a List to API
       * @param {any} list A List Object for sending to API
       */
      async updateListToAPI(list) {
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/list/${list.id}`, "PATCH", list);
      }
    },
    card: {
      /** 
       * @method getCardsFromAPI Get all Cards from API
       * @returns {Promise} Array of Card Object from API
       */
      async getCardsFromAPI() {
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/card`, "GET", null);
      },

      /** 
       * @method postcardFragmentToAPI Post a new Card to API
       * @param {any} cardFragment A new Card Object for sending to API
       * @returns {Promise} A Card Object from API with id
       */
      async postcardFragmentToAPI(cardFragment) {
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/card`, "POST", cardFragment);
      },

      /** 
       * @method deleteCardById Delete a Card by ID
       * @param {String} cardId Target Card cardId to delete
       */
      async deleteCardById(cardId) {
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/card/${cardId}`, "DELETE", null);
      },

      /** 
       * @method updateCardToAPI Update a card to API
       * @param {any} card A card Object for sending to API
       */
      async updateCardToAPI(card) {
        return oKanban.api.sendRequest(`${oKanban.api.base_url}/card/${card.id}`, "PATCH", card);
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
          responseOptions.body = oKanban.api.asUrlFormEncoded(bodyObj);
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
          throw new Error('An unexpected server error occured');
        }
      } catch (err) {
        console.error(err);
        alert(`An unexpected error occured`);
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
        oKanban.handleEvent.tools.toggleIsActiveHTMLElement(htmlElmt);
      };
    },

    /**
     * @method submitAddListForm Handle Submit event on AddListModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddListForm(event) {
      var formData = oKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKanban.domUpdates.fromUserAction.createList(formData);
      oKanban.handleEvent.tools.toggleIsActiveHTMLElement(oKanban.elements.addListModal);
    },

    /**
     * @method submitAddCardForm Handle Submit event on AddCardModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddCardForm(event) {
      var formData = oKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      oKanban.domUpdates.fromUserAction.createCard(formData);
      oKanban.handleEvent.tools.toggleIsActiveHTMLElement(oKanban.elements.addCardModal);
    },

    /**
     * @method clickAddCardModal Handle click event on addCardModal Form and set listId on this form
     * @param {String} listId - listId value to set listId in addCardModal Form
     * @return {CallableFunction} a callable function to Handle click event on addCardModal Form and set listId on this form 
     */
    clickAddCardModal(listId) {
      return (_) => {
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.querySelector('#list_id').value = listId;
        oKanban.handleEvent.tools.toggleIsActiveHTMLElement(oKanban.elements.addCardModal);
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
        oKanban.domUpdates.fromUserAction.deleteCard(listId, cardId);
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
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        cardNameFormElmt.querySelector('input[type="text"]').value = cardNameElmt.textContent;
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
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
        var formData = oKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
        oKanban.domUpdates.fromUserAction.updateCard(formData, listId, cardId);

        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.columns').querySelectorAll('.column')[0];
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
      };
    },

    /**
     * @method dblClickOnListTitle Handle double click event on list Title
     * @param {String} listId - target List listId
     * @return {CallableFunction} a callable function to Handle double click event on list Title
     */
    dblClickOnListTitle(listId) {
      return (_) => {
        const target_list = oKanban.domUpdates.tools.queryListElmtById(listId);
        const listTitleElmt = target_list.querySelector('h2');
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(listTitleElmt);

        const listTitleFormElmt = target_list.querySelector('form');
        listTitleFormElmt.querySelector('input[type="text"]').value = listTitleElmt.textContent;
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(listTitleFormElmt);
      }
    },

    /**
     * @method submitUpdateListForm Handle submit event on list Title Form
     * @param {String} listId - target List listId
     * @return {CallableFunction} a callable function to Handle submit event on list Title Form
     */
    submitUpdateListForm(listId) {
      return async (event) => {
        var formData = oKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);

        oKanban.domUpdates.fromUserAction.updateList(formData, listId);

        const target_list = oKanban.domUpdates.tools.queryListElmtById(listId);
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('form'));
        oKanban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('h2'));
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
    fromUserAction: {
      /**
       * @method createList Create list from FormData
       * @param {FormData} formData
       */
      async createList(formData) {
        let newList = {
          name: formData.get('formListName'),
          position: oKanban.data.length
        };
        newList = await oKanban.api.list.postNewListToAPI(newList);
        newList.cards = [];
        if (newList) {
          oKanban.data.push(newList);
          oKanban.domUpdates.makeListInDOM(newList);
        }
      },

      /**
       * @method updateList Update list from FormData
       * @param {FormData} formData
       * @param {String} listId - target List listId
       */
      async updateList(formData, listId) {
        const list = oKanban.data.find((list) => {
          return list.id == listId;
        });
        list.name = formData.get("name");
        const response = await oKanban.api.list.updateListToAPI(list);

        if (response) {
          oKanban.domUpdates.updateListInDom(list);
        } else {
          const target_list = oKanban.domUpdates.tools.queryListElmtById(listId);
          list.name = listTitleElmt.textContent;
        }
      },

      /**
       * @method createCard Create card from FormData
       * @param {FormData} formData
       */
      async createCard(formData) {
        let parentList = oKanban.data.find((list) => {
          return list.id == formData.get('list_id');
        });
        let newCard = {
          title: formData.get('title'),
          position: parentList.cards.length,
          // color : formData.get('formCardColor'),
          list_id: parentList.id
        }
        newCard = await oKanban.api.card.postcardFragmentToAPI(newCard);
        if (newCard) {
          parentList.cards.push(newCard);
          oKanban.domUpdates.makeCardInDom(parentList, newCard);
        }
      },

      /**
       * @method updateCard Update card from FormData
       * @param {FormData} formData
       * @param {String} listId - target List listId
       * @param {String} cardId - target Card cardId
       */
      async updateCard(formData, listId, cardId) {
        const list = oKanban.data.find((list) => {
          return list.id == listId;
        });

        const card = list.cards.find((card) => {
          return card.id == cardId;
        })

        card.title = formData.get('title');
        // card.position = formData.get('carte-position');
        // card.color = formData.get('carte-color');

        response = await oKanban.api.card.updateCardToAPI(card);
        if (response) {
          oKanban.domUpdates.updateCardInDom(card);
        } else {
          const target_card = oKanban.domUpdates.tools.queryCardElmtById(cardId);
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
        const list = oKanban.data.find((list) => {
          return list.id == listId;
        });

        const card = list.cards.find((card) => {
          return card.id == cardId;
        })
        const response = await oKanban.api.card.deleteCardById(cardId);
        if (response) {
          oKanban.domUpdates.deleteCardInDOM(card);
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
        const fragmentList = document.importNode(oKanban.elements.templateList.content, true);
        fragmentList.querySelector('div[list-id]').setAttribute('list-id', list.id);

        const listTitleElmt = fragmentList.querySelector('h2');
        listTitleElmt.textContent = list.name;
        listTitleElmt.addEventListener('dblclick', oKanban.handleEvent.dblClickOnListTitle(list.id));

        const listFormElmt = fragmentList.querySelector('form');
        listFormElmt.addEventListener('submit', oKanban.handleEvent.submitUpdateListForm(list.id));
        listFormElmt.querySelector('input[type="hidden"][name="id"]').value = list.id;
        listFormElmt.querySelector('input[type="hidden"][name="position"]').value = list.position;

        const addCardBt = fragmentList.querySelector('.fa-plus').closest('a');
        addCardBt.addEventListener('click', oKanban.handleEvent.clickAddCardModal(list.id));

        oKanban.elements.containerList.appendChild(fragmentList);
      }
    },

    /**
     * @method updateListInDom Update a list in DOM.
     * @param {all} list List object
     */
    async updateListInDom(list) {
      const target_list = oKanban.domUpdates.tools.queryListElmtById(list.id);
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
        const target_list = oKanban.domUpdates.tools.queryListElmtById(list.id);
        const card_container = target_list.querySelector('.panel-block');
        const cardFragment = document.importNode(oKanban.elements.templateCard.content, true);

        cardFragment.querySelector('.columns').querySelectorAll('.column')[0].textContent = card.title;
        cardFragment.querySelector('div[card-id]').setAttribute('card-id', card.id);
        cardFragment.querySelector('div[card-id]').style.background = card.color;

        const editCardBt = cardFragment.querySelector('.fa-pencil-alt').closest('a');
        editCardBt.addEventListener('click', oKanban.handleEvent.clickEditCardOnList());

        const cardeTitleFormElmt = cardFragment.querySelector('form');
        cardeTitleFormElmt.addEventListener('submit', oKanban.handleEvent.submitCardUpdateForm(list.id, card.id));

        const deleteCardBt = cardFragment.querySelector('.fa-trash-alt').closest('a');
        deleteCardBt.addEventListener('click', oKanban.handleEvent.clickDeleteCardOnList(list.id, card.id));

        card_container.appendChild(cardFragment);
      }
    },

    /**
     * @method updateCardInDom Update a card in DOM.
     * @param {all} card card object
     */
    async updateCardInDom(card) {
      const target_card = oKanban.domUpdates.tools.queryCardElmtById(card.id);
      target_card.querySelector('.columns').querySelectorAll('.column')[0].textContent = card.title;
      target_card.style.background = card.color;
    },

    /**
     * @method deleteCardInDOM Delete a card in DOM
     * @param {all} card card object
     */
    async deleteCardInDOM(card) {
      const target_card = oKanban.domUpdates.tools.queryCardElmtById(card.id);
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
          oKanban.domUpdates.makeListInDOM(apiListObj);
          oKanban.domUpdates.makeAllCardsFromApiInList(apiListObj);
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
          oKanban.domUpdates.makeCardInDom(list, apiCardObj);
        });
      }
    },
  },

  /**
   * @method initListener Refresh All oKanban listeners
   */
  initListener() {
    // Submit Event Listener on "AddListModal" Form
    oKanban.elements.addListModalForm.addEventListener('submit', oKanban.handleEvent.submitAddListForm);
    // Click Event Listener on "add list" Button
    oKanban.elements.addListModalAddButton.addEventListener('click', oKanban.handleEvent.clickToggleIsActiveHTMLElement(oKanban.elements.addListModal));
    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', oKanban.handleEvent.clickToggleIsActiveHTMLElement(oKanban.elements.addListModal));
    });


    // Submit Event Listener on "AddCardModal" Form
    oKanban.elements.addCardModalForm.addEventListener('submit', oKanban.handleEvent.submitAddCardForm);
    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', oKanban.handleEvent.clickToggleIsActiveHTMLElement(oKanban.elements.addCardModal));
    });
  },

  /**
   * @method refreshOkanban Refresh All oKanban lists and cards from API
   */
  async refreshOkanban() {
    oKanban.data = await oKanban.api.list.getListsFromAPI();
    if (oKanban.data) {
      oKanban.domUpdates.makeAllListWithCardsFromApi(oKanban.data);
    }
  }
};

// Start oKanban application on DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', oKanban.init);