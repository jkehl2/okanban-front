/**
 * @module joKanban joKanban application module
 * @version 1.0.0
 * @author jkehl
 */
const joKanban = {
  /**
   * @method init Initialize joKanban application 
   */
  init() {
    joKanban.initListener();
    joKanban.refreshjOkanban();
  },

  /**
   * @method getDataListById Get List Object from joKanban DATA
   * @param {String} listId Target List listId 
   * @returns {all} List target object
   */
  getDataListById(listId) {
    return joKanban.data.find((list) => {
      return list.id == listId;
    });
  },

  /**
   * @method getDataCardById Get Card Object from List Object
   * @param {all} list Target List Object
   * @param {String} cardId Target Card cardId 
   * @returns {all} Card target object
   */
  getDataCardById(list, cardId) {
    return list.cards.find((card) => {
      return card.id == cardId;
    });
  },

  /**
   * @method getDataCardById Get List and Card couple Object from joKanban DATA
   * @param {String} listId Target List listId 
   * @param {String} cardId Target Card cardId 
   * @returns {Array} [list, card] target object
   */
  getDataListNdCardById(listId, cardId) {
    const list = joKanban.getDataListById(listId);
    const card = joKanban.getDataCardById(list, cardId);
    return [list, card];
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
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list`, "GET", null);
      },

      /** 
       * @method postNewListToAPI Post a new List to API
       * @param {any} newList A new List Object for sending to API
       * @returns {Promise} A List Object from API with id
       */
      async postNewListToAPI(newList) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list`, "POST", newList);
      },

      /** 
       * @method deleteListById Delete a List by ID
       * @param {String} listId Target List listId to delete
       */
      async deleteListById(listId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list/${listId}`, "DELETE", null);
      },

      /** 
       * @method updateListToAPI Update a List to API
       * @param {any} list A List Object for sending to API
       */
      async updateListToAPI(list) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list/${list.id}`, "PATCH", list);
      }
    },
    card: {
      /** 
       * @method getCardsFromAPI Get all Cards from API
       * @returns {Promise} Array of Card Object from API
       */
      async getCardsFromAPI() {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card`, "GET", null);
      },

      /** 
       * @method postcardFragmentToAPI Post a new Card to API
       * @param {any} cardFragment A new Card Object for sending to API
       * @returns {Promise} A Card Object from API with id
       */
      async postcardFragmentToAPI(cardFragment) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card`, "POST", cardFragment);
      },

      /** 
       * @method deleteCardById Delete a Card by ID
       * @param {String} cardId Target Card cardId to delete
       */
      async deleteCardById(cardId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${cardId}`, "DELETE", null);
      },

      /** 
       * @method updateCardToAPI Update a card to API
       * @param {any} card A card Object for sending to API
       */
      async updateCardToAPI(card) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${card.id}`, "PATCH", card);
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
          responseOptions.body = joKanban.api.asUrlFormEncoded(bodyObj);
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
     * @method clickToggleModal Handle click on toggle display HTML Element button   
     * @param {HTMLElement} modalElmt - HTML Element to toggle display 
     * @returns {CallableFunction} a callable function to Handle click on toggle display HTML Element button 
     */
    clickToggleModal(modalElmt) {
      return (_) => {
        joKanban.handleEvent.tools.toggleIsActiveHTMLElement(modalElmt);
      };
    },

    /**
     * @method clickAddListBt Handle Click event on Add list Button
     * @param {Event} event - Click event on Add list Button
     */
    clickAddListBt(_) {
      joKanban.elements.addListModalForm.querySelector('input[type="text"][name="name"]').value = '';
      joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addListModal);
    },

    /**
     * @method submitAddListForm Handle Submit event on AddListModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddListForm(event) {
      var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      joKanban.domUpdates.fromUserAction.createList(formData);
      joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addListModal);
    },

    /**
     * @method clickDeleteList Handle click event on delete Card Button
     * @param {String} listId - Target List listId
     * @return {CallableFunction} a callable function to Handle click event on delete Card Button 
     */
    clickDeleteList(listId) {
      return (_) => {
        const list = joKanban.getDataListById(listId);
        if (list.cards.length > 0) {
          alert('Vous ne pouvez pas supprimer une liste contenant des cartes.');
        } else {
          const isConfrim = confirm(`Etes vous certain de vouloir supprimer cette liste ?`);
          if (isConfrim) {
            joKanban.domUpdates.fromUserAction.deleteList(listId);
          }
        }
      }
    },

    /**
     * @method clickAddCardBt Handle click event on add Card button 
     * @param {String} listId - Target List listId
     * @return {CallableFunction} a callable function to Handle click event on add Card button 
     */
    clickAddCardBt(listId) {
      return (_) => {
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.querySelector('input[type="text"][name="title"]').value = '';
        addCardModal.querySelector('input[type="color"][name="color"]').value = '#ffffff';
        addCardModal.querySelector('input[type="hidden"][name="list_id"]').value = listId;
        const list = joKanban.getDataListById(listId);
        addCardModal.querySelector('input[type="hidden"][name="position"]').value = list.cards.length;
        joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addCardModal);
      }
    },

    /**
     * @method submitAddCardForm Handle Submit event on AddCardModal Form
     * @param {Event} event - Submit event on AddListModal Form
     */
    submitAddCardForm(event) {
      var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      joKanban.domUpdates.fromUserAction.createCard(formData);
      joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addCardModal);
    },

    /**
     * @method clickDeleteCardBt Handle click event on deleteCard button
     * @param {String} listId - target List listId
     * @param {String} cardId - target Card cardId
     * @return {CallableFunction} a callable function to Handle click event on deleteCard button 
     */
    clickDeleteCardBt(listId, cardId) {
      return (_) => {
        joKanban.domUpdates.fromUserAction.deleteCard(listId, cardId);
      }
    },

    /**
     * @method clickEditCardBt Handle click event on editCard button
     * @param {String} cardId - Target Card cardId to edit
     * @param {String} listId - Target List listId which come from card to edit
     * @return {CallableFunction} a callable function to Handle click event on editCard button 
     */
    clickEditCardBt() {
      return (event) => {
        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.columns').querySelectorAll('.column')[0];
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        cardNameFormElmt.querySelector('input[type="text"]').value = cardNameElmt.textContent;
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
      }
    },

    /**
     * @method submitEditCardForm Handle submit event on list Title Form
     * @param {String} listId - target List listId
     * @param {String} cardId - target Card cardId
     * @return {CallableFunction} a callable function to Handle submit event on list Title Form
     */
    submitEditCardForm(listId, cardId) {
      return async (event) => {
        var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
        joKanban.domUpdates.fromUserAction.updateCard(formData, listId, cardId);

        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.columns').querySelectorAll('.column')[0];
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
      };
    },

    /**
     * @method dblClickOnListTitle Handle double click event on list Title
     * @param {String} listId - target List listId
     * @return {CallableFunction} a callable function to Handle double click event on list Title
     */
    dblClickOnListTitle(listId) {
      return (_) => {
        const target_list = joKanban.domUpdates.tools.queryListElmtById(listId);
        const listTitleElmt = target_list.querySelector('h2');
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(listTitleElmt);

        const listTitleFormElmt = target_list.querySelector('form');
        listTitleFormElmt.querySelector('input[type="text"]').value = listTitleElmt.textContent;
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(listTitleFormElmt);
      }
    },

    /**
     * @method submitUpdateListForm Handle submit event on list Title Form
     * @param {String} listId - target List listId
     * @return {CallableFunction} a callable function to Handle submit event on list Title Form
     */
    submitUpdateListForm(listId) {
      return async (event) => {
        var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);

        joKanban.domUpdates.fromUserAction.updateList(formData, listId);

        const target_list = joKanban.domUpdates.tools.queryListElmtById(listId);
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('form'));
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('h2'));
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
          name: formData.get('name'),
          position: joKanban.data.length
        };
        newList = await joKanban.api.list.postNewListToAPI(newList);
        newList.cards = [];
        if (newList) {
          joKanban.data.push(newList);
          joKanban.domUpdates.makeListInDOM(newList);
        }
      },

      /**
       * @method updateList Update list from FormData
       * @param {FormData} formData
       * @param {String} listId - target List listId
       */
      async updateList(formData, listId) {
        const list = joKanban.getDataListById(listId);
        list.name = formData.get("name");
        const response = await joKanban.api.list.updateListToAPI(list);

        if (response) {
          joKanban.domUpdates.updateListInDom(list);
        } else {
          const target_list = joKanban.domUpdates.tools.queryListElmtById(listId);
          list.name = listTitleElmt.textContent;
        }
      },

      /**
       * @method deleteList Delete List from user action
       * @param {String} listId - target List listId
       */
      async deleteList(listId) {
        const list = joKanban.getDataListById(listId);
        const response = await joKanban.api.list.deleteListById(listId);
        if (response) {
          joKanban.data = joKanban.data.filter((list) => {
            return list.id != listId;
          });
          joKanban.reIndexListNdCardPosition();
          joKanban.domUpdates.deleteListInDOM(list);
        }
      },

      /**
       * @method createCard Create card from FormData
       * @param {FormData} formData
       */
      async createCard(formData) {
        const parentList = joKanban.getDataListById(formData.get('list_id'));
        let newCard = {
          title: formData.get('title'),
          position: formData.get('position'),
          color: formData.get('color'),
          list_id: formData.get('list_id')
        }
        newCard = await joKanban.api.card.postcardFragmentToAPI(newCard);
        if (newCard) {
          parentList.cards.push(newCard);
          joKanban.domUpdates.makeCardInDom(parentList, newCard);
        }
      },

      /**
       * @method updateCard Update card from FormData
       * @param {FormData} formData
       * @param {String} listId - target List listId
       * @param {String} cardId - target Card cardId
       */
      async updateCard(formData, listId, cardId) {
        const [, card] = joKanban.getDataListNdCardById(listId, cardId);

        card.title = formData.get('title');
        // card.position = formData.get('position');
        card.color = formData.get('color');

        response = await joKanban.api.card.updateCardToAPI(card);
        if (response) {
          joKanban.domUpdates.updateCardInDom(card);
        } else {
          const target_card = joKanban.domUpdates.tools.queryCardElmtById(cardId);
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
        const [list, card] = joKanban.getDataListNdCardById(listId, cardId);

        const response = await joKanban.api.card.deleteCardById(cardId);
        if (response) {
          list.cards = list.cards.filter((card) => {
            return card.id != cardId;
          });
          joKanban.reIndexCardPositionInOneList(list);
          joKanban.domUpdates.deleteCardInDOM(card);
        }
      }
    },

    /**
     * @method makeListInDOM  Make a new List in DOM
     * @param {all} list list object
     */
    makeListInDOM(list) {
      if ("content" in document.createElement('template')) {
        const listFragment = document.importNode(joKanban.elements.templateList.content, true);
        listFragment.querySelector('div[list-id]').setAttribute('list-id', list.id);

        const listTitleElmt = listFragment.querySelector('h2');
        listTitleElmt.textContent = list.name;
        listTitleElmt.addEventListener('dblclick', joKanban.handleEvent.dblClickOnListTitle(list.id));

        const listFormElmt = listFragment.querySelector('form');
        listFormElmt.addEventListener('submit', joKanban.handleEvent.submitUpdateListForm(list.id));
        listFormElmt.querySelector('input[type="hidden"][name="id"]').value = list.id;
        listFormElmt.querySelector('input[type="hidden"][name="position"]').value = list.position;

        const addCardBt = listFragment.querySelector('.fa-plus').closest('a');
        addCardBt.addEventListener('click', joKanban.handleEvent.clickAddCardBt(list.id));

        const deleteListBt = listFragment.querySelector('.fa-trash-alt').closest('a');
        deleteListBt.addEventListener('click', joKanban.handleEvent.clickDeleteList(list.id));

        joKanban.elements.containerList.appendChild(listFragment);
      }
    },

    /**
     * @method updateListInDom Update a list in DOM.
     * @param {all} list List object
     */
    async updateListInDom(list) {
      const target_list = joKanban.domUpdates.tools.queryListElmtById(list.id);

      const listTitleElmt = target_list.querySelector('h2');
      listTitleElmt.textContent = list.name;

      const listFormElmt = target_list.querySelector('form');
      listFormElmt.querySelector('input[type="hidden"][name="id"]').value = list.id;
      listFormElmt.querySelector('input[type="hidden"][name="position"]').value = list.position;
    },

    /**
     * @method deleteListInDOM Delete a List in DOM
     * @param {all} list List object
     */
    async deleteListInDOM(list) {
      const target_list = joKanban.domUpdates.tools.queryListElmtById(list.id);
      target_list.remove();
    },

    /**
     * @method makeCardInDom Make a new Card in DOM
     * @param {all} list list object
     * @param {all} card card object
     */
    async makeCardInDom(list, card) {
      if ("content" in document.createElement('template')) {
        const target_list = joKanban.domUpdates.tools.queryListElmtById(list.id);
        const card_container = target_list.querySelector('.panel-block');
        const cardFragment = document.importNode(joKanban.elements.templateCard.content, true);

        cardFragment.querySelector('.columns').querySelectorAll('.column')[0].textContent = card.title;
        cardFragment.querySelector('div[card-id]').setAttribute('card-id', card.id);
        cardFragment.querySelector('div[card-id]').style.background = card.color;

        const editCardBt = cardFragment.querySelector('.fa-pencil-alt').closest('a');
        editCardBt.addEventListener('click', joKanban.handleEvent.clickEditCardBt());

        const cardFormElmt = cardFragment.querySelector('form');
        cardFormElmt.addEventListener('submit', joKanban.handleEvent.submitEditCardForm(list.id, card.id));

        cardFormElmt.querySelector('input[type="hidden"][name="id"]').value = card.id;
        cardFormElmt.querySelector('input[type="hidden"][name="position"]').value = card.position;
        cardFormElmt.querySelector('input[type="color"][name="color"]').value = card.color;
        cardFormElmt.querySelector('input[type="hidden"][name="list_id"]').value = card.list_id;

        const deleteCardBt = cardFragment.querySelector('.fa-trash-alt').closest('a');
        deleteCardBt.addEventListener('click', joKanban.handleEvent.clickDeleteCardBt(list.id, card.id));



        card_container.appendChild(cardFragment);
      }
    },

    /**
     * @method updateCardInDom Update a card in DOM.
     * @param {all} card card object
     */
    async updateCardInDom(card) {
      const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
      target_card.querySelector('.columns').querySelectorAll('.column')[0].textContent = card.title;
      target_card.style.background = card.color;

      const cardFormElmt = target_card.querySelector('form');

      cardFormElmt.querySelector('input[type="hidden"][name="id"]').value = card.id;
      cardFormElmt.querySelector('input[type="hidden"][name="position"]').value = card.position;
      cardFormElmt.querySelector('input[type="color"][name="color"]').value = card.color;
      cardFormElmt.querySelector('input[type="hidden"][name="list_id"]').value = card.list_id;
    },

    /**
     * @method deleteCardInDOM Delete a card in DOM
     * @param {all} card card object
     */
    async deleteCardInDOM(card) {
      const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
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
          joKanban.domUpdates.makeListInDOM(apiListObj);
          joKanban.domUpdates.makeAllCardsFromApiInList(apiListObj);
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
          joKanban.domUpdates.makeCardInDom(list, apiCardObj);
        });
      }
    },
  },

  /**
   * @method initListener Refresh All joKanban listeners
   */
  initListener() {
    // Submit Event Listener on "AddListModal" Form
    joKanban.elements.addListModalForm.addEventListener('submit', joKanban.handleEvent.submitAddListForm);
    // Click Event Listener on "add list" Button
    joKanban.elements.addListModalAddButton.addEventListener('click', joKanban.handleEvent.clickAddListBt);
    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = document.getElementById('addListModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', joKanban.handleEvent.clickToggleModal(joKanban.elements.addListModal));
    });


    // Submit Event Listener on "AddCardModal" Form
    joKanban.elements.addCardModalForm.addEventListener('submit', joKanban.handleEvent.submitAddCardForm);
    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = document.getElementById('addCardModal').querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', joKanban.handleEvent.clickToggleModal(joKanban.elements.addCardModal));
    });
  },

  /**
   * @method refreshjOkanban Refresh All joKanban lists and cards from API
   */
  async refreshjOkanban() {
    joKanban.data = await joKanban.api.list.getListsFromAPI();
    if (joKanban.data) {
      joKanban.domUpdates.makeAllListWithCardsFromApi(joKanban.data);
      joKanban.reIndexListNdCardPosition();
    }
  },

  /**
   * @method refrechAllListNdCardPosition Re-index All List and Card position
   */
  reIndexListNdCardPosition() {
    try {
      let pos = 0;
      joKanban.data.sort((list1, list2) => {
        return list1.position < list2.position ? -1 : (list1.position > list2.position ? 1 : 0);
      }).forEach(async (list) => {
        list.position = pos++;
        await joKanban.api.list.updateListToAPI(list);
        joKanban.reIndexCardPositionInOneList(list);
        joKanban.domUpdates.updateListInDom(list);
      });
    } catch (err) {
      console.error(err);
    }
  },

  /**
   * @method reIndexCardPositionInOneList Re-index Card position in a single list
   * @param {all} list Target List object
   */
  reIndexCardPositionInOneList(list) {
    try {
      let pos = 0;
      list.cards.sort((card1, card2) => {
        return card1.position < card2.position ? -1 : (card1.position > card2.position ? 1 : 0);
      }).forEach(async (card) => {
        card.position = pos++;
        await joKanban.api.card.updateCardToAPI(card);
        joKanban.domUpdates.updateCardInDom(card);
      });
    } catch (err) {
      console.error(err);
    }
  }
};

// Start joKanban application on DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', joKanban.init);