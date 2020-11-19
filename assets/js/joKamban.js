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
    joKanban.initModalsListener();
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
   * @method getDataCardByTagId Get All Card Object wich associate target Tag
   * @param {String} tagId Target Tag tagId
   * @returns {Array} Array of Card object
   */
  getDataCardByTagId(tagId) {
    let cards = [];
    joKanban.data.forEach((list) => {
      list.cards.forEach((card) => {
        card.tags.forEach((tag) => {
          if (tag.id == tagId) {
            cards.push(card);
          };
        });
      });
    });
    return cards;
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

  /**
   * @method getDataTagById Get Tag Object from joKanban TAGS
   * @param {String} tagId Target Tag tagId 
   * @returns {all} Tag target object
   */
  getDataTagById(tagId) {
    return joKanban.tags.find((tag) => {
      return tag.id == tagId;
    });
  },

  elements: {
    addListModalAddButton: document.getElementById('addListButton'),
    addListModal: document.getElementById('addListModal'),
    addListModalForm: document.getElementById('modalListForm'),
    addCardModal: document.getElementById('addCardModal'),
    addCardModalForm: document.getElementById('modalCardForm'),
    templateList: document.getElementById('template_list'),
    templateCard: document.getElementById('template_card'),
    containerList: document.querySelector('.card-lists'),
    templateTagMenu: document.getElementById('template_tagMenu'),
    templateTagCard: document.getElementById('template_tagCard'),
    containerTagMenu: document.getElementById('tags-menu'),
    addTagModalAddButton: document.getElementById('addTagButton'),
    addTagModalForm: document.getElementById('modalTagForm'),
    addTagModal: document.getElementById('addTagModal')
  },

  api: {
    base_url: 'http://johann-kehl.vpnuser.lan:3000',
    list: {
      /** 
       * @method getListsFromAPI Get all list from DB
       * @returns {Promise} Array of List Object from DB
       */
      getListsFromAPI() {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list`, "GET", null);
      },

      /** 
       * @method postNewListToAPI Post a new List to DB
       * @param {any} newList A new List Object for sending to DB
       * @returns {Promise} A List Object from DB with id
       */
      async postNewListToAPI(newList) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list`, "POST", newList);
      },

      /** 
       * @method deleteListById Delete a List by ID In DB
       * @param {String} listId Target List listId to delete
       */
      async deleteListById(listId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list/${listId}`, "DELETE", null);
      },

      /** 
       * @method updateListToAPI Update a List to DB
       * @param {any} list A List Object for sending to DB
       */
      async updateListToAPI(list) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/list/${list.id}`, "PATCH", list);
      }
    },
    card: {
      /** 
       * @method getCardsFromAPI Get all Cards from DB
       * @returns {Promise} Array of Card Object from DB
       */
      async getCardsFromAPI() {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card`, "GET", null);
      },


      /** 
       * @method getCardByIdFromAPI Get all Cards from DB
       * @param {String} cardId Target Card cardId
       * @returns {Promise} Card Object from DB
       */
      async getCardByIdFromAPI(cardId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${cardId}`, "GET", null);
      },

      /** 
       * @method postCardToAPI Post a new Card to DB
       * @param {any} cardFragment A new Card Object for sending to DB
       * @returns {Promise} A Card Object from DB with id
       */
      async postCardToAPI(cardFragment) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card`, "POST", cardFragment);
      },

      /** 
       * @method deleteCardById Delete a Card by ID in DB
       * @param {String} cardId Target Card cardId to delete
       */
      async deleteCardById(cardId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${cardId}`, "DELETE", null);
      },

      /** 
       * @method updateCardToAPI Update a card to DB
       * @param {any} card A card Object for sending to DB
       */
      async updateCardToAPI(card) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${card.id}`, "PATCH", card);
      }
    },

    tag: {
      /** 
       * @method getTagsFromAPI Get all Tags from DB
       * @returns {Promise} Array of Tag Object from DB
       */
      async getTagsFromAPI() {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/tag`, "GET", null);
      },

      /** 
       * @method postTagToAPI Post a new Tag to DB
       * @param {any} tag A new Tag Object for sending to DB
       * @returns {Promise} A Tag Object from DB with id
       */
      async postTagToAPI(tag) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/tag`, "POST", tag);
      },

      /** 
       * @method deleteTagById Delete a Tag by ID in DB
       * @param {String} tagId Target Tag tagId to delete
       */
      async deleteTagById(tagId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/tag/${tagId}`, "DELETE", null);
      },

      /** 
       * @method updateTagToAPI Update a Tag to DB
       * @param {any} tag A Tag Object for sending to DB
       */
      async updateTagToAPI(tag) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/tag/${tag.id}`, "PATCH", tag);
      },

      /** 
       * @method associateTagToCardByIds associate a Tag to a Card in DB By theirs Id
       * @param {String} tagId Target Tag tagId to associate
       * @param {String} cardId Target Card cardId to associate
       */
      async associateTagToCardByIds(tagId, cardId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${cardId}/tag/${tagId}`, "PATCH", null);
      },

      /** 
       * @method dissociateTagOfCardByIds dissociate a Tag of a Card in DB By theirs Id
       * @param {String} tagId Target Tag tagId to dissociate
       * @param {String} cardId Target Card cardId to dissociate
       */
      async dissociateTagOfCardByIds(tagId, cardId) {
        return joKanban.api.sendRequest(`${joKanban.api.base_url}/card/${cardId}/tag/${tagId}`, "DELETE", null);
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
     * @method clickAddTagBt Handle Click event on Add Tag Button
     * @param {Event} event - Click event on Add Tag Button
     */
    clickAddTagBt() {
      joKanban.elements.addTagModalForm.querySelector('input[type="text"][name="name"]').value = '';
      joKanban.elements.addTagModalForm.querySelector('input[type="color"][name="color"]').value = '#ffffff';
      // Submit Event Listener on "AddListModal" Form
      joKanban.elements.addTagModalForm.removeEventListener('submit', joKanban.handleEvent.submitAddTagForm);
      joKanban.elements.addTagModalForm.removeEventListener('submit', joKanban.handleEvent.submitEditTagForm);
      joKanban.elements.addTagModalForm.addEventListener('submit', joKanban.handleEvent.submitAddTagForm);
      joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addTagModal);
    },

    /**
     * @method submitAddTagForm Handle Submit event on AddTagModal Form
     * @param {Event} event - Submit event on AddTagModal Form
     */
    submitAddTagForm(event) {
      var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      joKanban.domUpdates.fromUserAction.createTag(formData);
      joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addTagModal);
    },

    /**
     * @method clickEditTagBt Handle Click event on Edit Tag Button
     * @param {String} tagId - Target Tag tagId
     * @return {CallableFunction} a callable function to Handle Click event on Edit Tag Button
     */
    clickEditTagBt(tagId) {
      return (_) => {
        const tag = joKanban.getDataTagById(tagId);
        joKanban.elements.addTagModalForm.querySelector('input[type="text"][name="name"]').value = tag.name;
        joKanban.elements.addTagModalForm.querySelector('input[type="color"][name="color"]').value = tag.color;
        joKanban.elements.addTagModalForm.querySelector('input[type="hidden"][name="id"]').value = tagId;
        // Submit Event Listener on "AddListModal" Form
        joKanban.elements.addTagModalForm.removeEventListener('submit', joKanban.handleEvent.submitAddTagForm);
        joKanban.elements.addTagModalForm.removeEventListener('submit', joKanban.handleEvent.submitEditTagForm);
        joKanban.elements.addTagModalForm.addEventListener('submit', joKanban.handleEvent.submitEditTagForm);
        joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addTagModal);
      }
    },

    /**
     * @method submitEditTagForm Handle Submit event on AddTagModal Form
     * @param {Event} event - Submit event on AddTagModal Form
     */
    submitEditTagForm(event) {
      var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
      joKanban.domUpdates.fromUserAction.updateTag(formData);
      joKanban.handleEvent.tools.toggleIsActiveHTMLElement(joKanban.elements.addTagModal);
    },

    /**
     * @method clickEditTagBt Handle DblClick event on Tag In Card
     * @param {String} tagId - Target Tag tagId
     * @param {String} cardId - target Card cardId
     * @param {String} listId - Target List listId
     * @return {CallableFunction} a callable function to Handle DblClick event on Tag In Card
     */
    dblClickOnTagCard(tagId, cardId, listId) {
      return () => {
        const isConfrim = confirm(`Etes vous certain de vouloir supprimer ce Tag de cette carte ?`);
        if (isConfrim) {
          joKanban.domUpdates.fromUserAction.dissociateTagOfCard(tagId, cardId, listId);
        }
      }
    },

    /**
     * @method clickDeleteTagBt Handle click event on deleteCard button
     * @param {String} tagId - Target Tag tagId
     * @return {CallableFunction} a callable function to Handle click event on deleteCard button 
     */
    clickDeleteTagBt(tagId) {
      return (_) => {
        const isConfrim = confirm(`Etes vous certain de vouloir supprimer ce tag ?`);
        if (isConfrim) {
          joKanban.domUpdates.fromUserAction.deleteTag(tagId);
        }
      }
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
        const isConfrim = confirm(`Etes vous certain de vouloir supprimer cette carte ?`);
        if (isConfrim) {
          joKanban.domUpdates.fromUserAction.deleteCard(listId, cardId);
        }
      }
    },

    /**
     * @method clickEditCardBt Handle click event on editCard button
     * @param {String} listId - Target List listId which come from card to edit
     * @param {String} cardId - Target Card cardId to edit
     * @return {CallableFunction} a callable function to Handle click event on editCard button 
     */
    clickEditCardBt(listId, cardId) {
      return (event) => {
        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.content p');
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameElmt);

        const cardNameFormElmt = cardElmt.querySelector('form');
        cardNameFormElmt.querySelector('input[type="text"]').value = cardNameElmt.textContent;
        cardNameFormElmt.querySelector('input[type="hidden"][name="id"]').value = cardId;
        cardNameFormElmt.querySelector('input[type="hidden"][name="list_id"]').value = listId;
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(cardNameFormElmt);
      }
    },

    /**
     * @method submitEditCardForm Handle submit event on list Title Form
     * @param {String} listId - target List listId
     * @param {String} cardId - target Card cardId
     * @return {CallableFunction} a callable function to Handle submit event on list Title Form
     */
    submitEditCardForm() {
      return async (event) => {
        var formData = joKanban.handleEvent.tools.getDataFormFrmFormSubmit(event);
        joKanban.domUpdates.fromUserAction.updateCard(formData);

        const cardElmt = event.target.closest('div[card-id]');

        const cardNameElmt = cardElmt.querySelector('.content p');
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
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('.level-right'));

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
        joKanban.handleEvent.tools.toggleIsHiddenHTMLElement(target_list.querySelector('.level-right'));
      }
    }

  },

  domUpdates: {
    tools: {
      /**
       * @method removeAllChildHTMLElement Get a List HTML Element by listId
       * @param {HTMLElement} element Target HTML element
       */
      removeAllChildHTMLElement(element) {
        while (element.children.length > 0) {
          element.removeChild(element.children[0]);
        }
      },

      /**
       * @method queryListElmtById Get a List HTML Element by listId
       * @param {String} listId Target List listId
       * @returns {HTMLElement} List HTML Element with list-id attribut equal to listId param
       */
      queryListElmtById(listId) {
        return document.querySelector(`div[list-id="${listId}"]`)
      },

      /**
       * @method queryCardElmtById Get a Card HTML Element by cardId
       * @param {String} cardId Target Card cardId
       * @returns {HTMLElement} Card HTML Element with card-id attribut equal to cardId param
       */
      queryCardElmtById(cardId) {
        return document.querySelector(`div[card-id="${cardId}"]`)
      },

      /**
       * @method queryTagElmtInMenuById Get a Tag HTML Element by tagId In Menu
       * @param {String} tagId Target Tag tagId
       * @returns {HTMLElement} Tag HTML Element with tag-id attribut equal to tagId param
       */
      queryTagElmtInMenuById(tagId) {
        return joKanban.elements.containerTagMenu.querySelector(`a[tag-id="${tagId}"]`).closest('li');
      },

      /**
       * @method queryTagElmtInCardById Get a Tag HTML Element From a Card by Ids
       * @param {String} cardId Target Card cardId
       * @param {String} tagId Target Tag tagId
       * @returns {HTMLElement} Tag HTML Element with tag-id attribut equal to tagId param
       */
      queryTagElmtInCardById(cardId, tagId) {
        return joKanban.domUpdates.tools.queryCardElmtById(cardId).querySelector(`a[tagcard-id="${tagId}"]`);
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
        newCard = await joKanban.api.card.postCardToAPI(newCard);
        newCard.tags = []
        if (newCard) {
          parentList.cards.push(newCard);
          joKanban.domUpdates.makeCardInDom(parentList, newCard);
        }
      },

      /**
       * @method updateCard Update card from FormData
       * @param {FormData} formData
       */
      async updateCard(formData) {
        const [, card] = joKanban.getDataListNdCardById(formData.get('list_id'), formData.get('id'));

        card.title = formData.get('title');
        // card.position = formData.get('position');
        card.color = formData.get('color');

        response = await joKanban.api.card.updateCardToAPI(card);
        if (response) {
          joKanban.domUpdates.updateCardInDom(card);
        } else {
          const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
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
      },

      /**
       * @method moveCard Move card from user action
       * @param {all} cardAfter - target Card After
       * @param {all} cardFrom - target Move Card
       */
      async moveCard(cardAfter, cardFrom) {
        const listFrom = joKanban.getDataListById(cardFrom.list_id);
        listFrom.cards = listFrom.cards.filter((card) => {
          return card.id != cardFrom.id;
        })
        cardFrom.position = cardAfter.position;
        cardFrom.list_id = cardAfter.list_id;
        await joKanban.api.card.updateCardToAPI(cardFrom);

        const listTo = joKanban.getDataListById(cardAfter.list_id);
        listTo.cards.forEach((card) => {
          if (card.position >= cardAfter.position) {
            card.position++;
          }
        });

        listTo.cards.push(cardFrom);
        listTo.cards.sort((card1, card2) => {
          return card1.position < card2.position ? -1 : (card1.position > card2.position ? 1 : 0);
        }).forEach(async (card) => {
          await joKanban.api.card.getCardByIdFromAPI(card.id);
        });
        joKanban.domUpdates.refreshCardsInList(listFrom);
        joKanban.domUpdates.refreshCardsInList(listTo);
      },

      /**
       * @method createTag Create Tag from FormData
       * @param {FormData} formData
       */
      async createTag(formData) {
        let newTag = {
          name: formData.get('name'),
          color: formData.get('color'),
        }
        newTag = await joKanban.api.tag.postTagToAPI(newTag);
        if (newTag) {
          joKanban.tags.push(newTag);
          joKanban.domUpdates.makeTagInMenu(newTag);
        }
      },

      /**
       * @method updateTag Update Tag from FormData
       * @param {FormData} formData
       */
      async updateTag(formData) {
        const tag = joKanban.getDataTagById(formData.get('id'));

        tag.name = formData.get('name');
        tag.color = formData.get('color');

        response = await joKanban.api.tag.updateTagToAPI(tag);
        if (response) {
          joKanban.domUpdates.updateTagInMenu(tag);
          const cardsUpdate = joKanban.getDataCardByTagId(tag.id);
          cardsUpdate.forEach(async (card) => {
            const cardUpdate = await joKanban.api.card.getCardByIdFromAPI(card.id);
            const list = joKanban.getDataListById(card.list_id);
            list.cards.filter((cardList) => {
              return cardList.id != card.id;
            })
            list.cards.push(cardUpdate);
            joKanban.domUpdates.refreshCardTagsInDom(cardUpdate, list);
          });
        } else {
          const target_tag = joKanban.domUpdates.tools.queryTagElmtInMenuById(tag.id);
          tag.name = target_tag.querySelector('a[tag-id]').textContent;
          tag.color = target_tag.style.background;
        }
      },

      /**
       * @method deleteTag Delete Tag from user action
       * @param {String} tagId - target Tag tagId
       */
      async deleteTag(tagId) {
        const tag = joKanban.getDataTagById(tagId);
        const response = await joKanban.api.tag.deleteTagById(tagId);
        if (response) {
          joKanban.tags = joKanban.tags.filter((tag) => {
            return tag.id != tagId;
          });
          joKanban.domUpdates.deleteTagInMenu(tag);
          const cardsUpdate = joKanban.getDataCardByTagId(tag.id);
          cardsUpdate.forEach(async (card) => {
            const cardUpdate = await joKanban.api.card.getCardByIdFromAPI(card.id);
            const list = joKanban.getDataListById(card.list_id);
            list.cards = list.cards.filter((cardList) => {
              return cardList.id != card.id;
            })
            list.cards.push(cardUpdate);
            joKanban.domUpdates.refreshCardTagsInDom(cardUpdate, list);
          });
        }
      },

      /**
       * @method associateTagToCard Associate a Tag To a card from user action
       * @param {String} tagId - target Tag tagId
       * @param {String} cardId - target Card cardId
       * @param {String} listId - target List listId
       */
      async associateTagToCard(tagId, cardId, listId) {
        const tag = joKanban.getDataTagById(tagId);
        const [list, card] = joKanban.getDataListNdCardById(listId, cardId);
        const isNotInCard = (card.tags.find((tag) => {
          return tag.id == tagId;
        })) == null;
        if (isNotInCard) {
          const response = await joKanban.api.tag.associateTagToCardByIds(tagId, cardId);
          if (response) {
            card.tags.push(tag);
            joKanban.domUpdates.associateTagToCardInDOM(tag, card, list);
          }
        }
      },

      /**
       * @method dissociateTagOfCard Dissociate a Tag Of a card from user action
       * @param {String} tagId - target Tag tagId
       * @param {String} cardId - target Card cardId
       * @param {String} listId - target List listId
       */
      async dissociateTagOfCard(tagId, cardId, listId) {
        const tag = joKanban.getDataTagById(tagId);
        const [, card] = joKanban.getDataListNdCardById(listId, cardId);
        const response = await joKanban.api.tag.dissociateTagOfCardByIds(tagId, cardId);
        if (response) {
          card.tags = card.tags.filter((tag) => {
            return tag.id != tagId;
          });
          joKanban.domUpdates.dissociateTagOfCardInDOM(tag, card);
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
        const listElmt = listFragment.querySelector('div[list-id]');
        listElmt.setAttribute('list-id', list.id);

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

        listTitleElmt.addEventListener('dragstart', (event) => {
          joKanban.draggedElmt = event.target.closest('div[list-id]');
          console.log(joKanban.draggedElmt);
        });

        listElmt.addEventListener("dragover", function (event) {
          if (joKanban.draggedElmt.hasAttribute("list-id")) {
            // prevent default to allow drop
            event.preventDefault();
          }
        }, false);

        listElmt.addEventListener("dragenter", function (event) {
          event.preventDefault();
          if (joKanban.draggedElmt.hasAttribute("list-id")) {
            listElmt.style.borderLeft = '3px solid #000000';
          }
        }, false);

        listElmt.addEventListener("dragleave", function (event) {
          event.preventDefault();
          if (joKanban.draggedElmt.hasAttribute("list-id") && (!listElmt.contains(event.relatedTarget))) {
            listElmt.style.borderLeft = 'none';
          }
        }, false);

        // listElmt.addEventListener('drop', (event) => {
        //   event.preventDefault();
        //   if (joKanban.draggedElmt.hasAttribute("card-id")) {
        //     event.target.closest('div[card-id]').style.borderTop = 'none';
        //     const cardFromListId = joKanban.draggedElmt.querySelector('input[type="hidden"][name="list_id"]').value;
        //     const [, cardFrom] = joKanban.getDataListNdCardById(cardFromListId, joKanban.draggedElmt.getAttribute('card-id'));
        //     joKanban.domUpdates.fromUserAction.moveCard(card, cardFrom);
        //   }
        // }, false);


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

        cardFragment.querySelector('.content p').textContent = card.title;
        const cardElmt = cardFragment.querySelector('div[card-id]');
        cardElmt.setAttribute('card-id', card.id);
        cardElmt.style.background = card.color;

        const editCardBt = cardFragment.querySelector('.fa-pencil-alt').closest('a');
        editCardBt.addEventListener('click', joKanban.handleEvent.clickEditCardBt(list.id, card.id));

        const cardFormElmt = cardFragment.querySelector('form');
        cardFormElmt.addEventListener('submit', joKanban.handleEvent.submitEditCardForm());

        cardFormElmt.querySelector('input[type="hidden"][name="id"]').value = card.id;
        cardFormElmt.querySelector('input[type="hidden"][name="position"]').value = card.position;
        cardFormElmt.querySelector('input[type="color"][name="color"]').value = card.color;
        cardFormElmt.querySelector('input[type="hidden"][name="list_id"]').value = card.list_id;

        const deleteCardBt = cardFragment.querySelector('.fa-trash-alt').closest('a');
        deleteCardBt.addEventListener('click', joKanban.handleEvent.clickDeleteCardBt(list.id, card.id));

        cardElmt.addEventListener('dragstart', (event) => {
          joKanban.draggedElmt = event.target;
        });

        cardElmt.addEventListener("dragover", function (event) {
          if (joKanban.draggedElmt.hasAttribute("tag-id") || joKanban.draggedElmt.hasAttribute("card-id")) {
            // prevent default to allow drop
            event.preventDefault();
          }
        }, false);

        cardElmt.addEventListener("dragenter", function (event) {
          event.preventDefault();
          if (joKanban.draggedElmt.hasAttribute("card-id")) {
            cardElmt.style.borderTop = '3px solid #000000';
          }
          if (joKanban.draggedElmt.hasAttribute("tag-id")) {
            cardElmt.style.border = '3px solid #000000';
          }
        }, false);

        cardElmt.addEventListener("dragleave", function (event) {
          event.preventDefault();
          if (joKanban.draggedElmt.hasAttribute("card-id") && (!cardElmt.contains(event.relatedTarget))) {
            cardElmt.style.borderTop = 'none';
          }
          if (joKanban.draggedElmt.hasAttribute("tag-id") && (!cardElmt.contains(event.relatedTarget))) {
            cardElmt.style.border = 'none';
          }
        }, false);

        cardElmt.addEventListener('drop', (event) => {
          event.preventDefault();
          if (joKanban.draggedElmt.hasAttribute("tag-id")) {
            cardElmt.style.border = 'none';
            joKanban.domUpdates.fromUserAction.associateTagToCard(joKanban.draggedElmt.getAttribute("tag-id"), card.id, list.id);
          }
          if (joKanban.draggedElmt.hasAttribute("card-id")) {
            cardElmt.style.borderTop = 'none';
            const cardFromListId = joKanban.draggedElmt.querySelector('input[type="hidden"][name="list_id"]').value;
            const [, cardFrom] = joKanban.getDataListNdCardById(cardFromListId, joKanban.draggedElmt.getAttribute('card-id'));
            joKanban.domUpdates.fromUserAction.moveCard(card, cardFrom);
          }
        }, false);

        card_container.appendChild(cardFragment);
      }
    },

    /**
     * @method updateCardInDom Update a card in DOM.
     * @param {all} card card object
     */
    async updateCardInDom(card) {
      const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
      target_card.querySelector('.content p').textContent = card.title;
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
     * @method makeTagInMenu Make a tag in menu
     * @param {all} tag tag object
     */
    async makeTagInMenu(tag) {
      if ("content" in document.createElement('template')) {
        const tagFragment = document.importNode(joKanban.elements.templateTagMenu.content, true);
        const buttonElmt = tagFragment.querySelector('a[tag-id]');
        buttonElmt.textContent = tag.name;
        buttonElmt.style.background = tag.color;
        buttonElmt.setAttribute('tag-id', tag.id);

        buttonElmt.addEventListener('dragstart', (event) => {
          joKanban.draggedElmt = event.target;
        });

        const editTagBt = tagFragment.querySelector('.fa-pencil-alt').closest('a');
        editTagBt.addEventListener('click', joKanban.handleEvent.clickEditTagBt(tag.id));

        const deleteTagBt = tagFragment.querySelector('.fa-trash-alt').closest('a');
        deleteTagBt.addEventListener('click', joKanban.handleEvent.clickDeleteTagBt(tag.id));

        joKanban.elements.containerTagMenu.appendChild(tagFragment);
      }
    },

    /**
     * @method updateTagInMenu Update a card in DOM.
     * @param {all} tag tag object
     */
    async updateTagInMenu(tag) {
      const target_tag = joKanban.domUpdates.tools.queryTagElmtInMenuById(tag.id);
      const buttonElmt = target_tag.querySelector('a[tag-id]');

      buttonElmt.textContent = tag.name;
      buttonElmt.style.background = tag.color;
    },

    /**
     * @method deleteTagInMenu Delete a Tag in DOM
     * @param {all} tag Tag object
     */
    async deleteTagInMenu(tag) {
      const target_tag = joKanban.domUpdates.tools.queryTagElmtInMenuById(tag.id);
      target_tag.remove();
    },

    /**
     * @method associateTagToCardInDOM Associate a Tag To a Card in DOM
     * @param {all} tag Tag object
     * @param {all} card Card object
     * @param {all} list List object
     */
    async associateTagToCardInDOM(tag, card, list) {
      if ("content" in document.createElement('template')) {
        const tagFragment = document.importNode(joKanban.elements.templateTagCard.content, true);
        const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
        const containerTagsInCard = target_card.querySelector('.tags-container');
        const tagElmt = tagFragment.querySelector('a[tagcard-id]');
        tagElmt.setAttribute('tagcard-id', tag.id);
        tagElmt.textContent = tag.name;
        tagElmt.style.background = tag.color;
        tagElmt.addEventListener('dblclick', joKanban.handleEvent.dblClickOnTagCard(tag.id, card.id, list.id));
        containerTagsInCard.appendChild(tagFragment);
        containerTagsInCard.closest('nav').classList.remove('is-hidden');
      }
    },

    /**
     * @method dissociateTagOfCardInDOM Dissociate a Tag of a Card in DOM
     * @param {all} tag Tag object
     * @param {all} card Card object
     */
    async dissociateTagOfCardInDOM(tag, card) {
      const target_tag = joKanban.domUpdates.tools.queryTagElmtInCardById(card.id, tag.id);
      target_tag.remove();
      if (card.tags.length == 0) {
        const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
        const containerTagsInCard = target_card.querySelector('.tags-container');
        containerTagsInCard.closest('nav').classList.add('is-hidden');
      }
    },

    /**
     * @method refreshCardTagsInDom Refresh Tags in a Card in DOM
     * @param {all} card Card object
     * @param {all} list List object
     */
    async refreshCardTagsInDom(card, list) {
      const target_card = joKanban.domUpdates.tools.queryCardElmtById(card.id);
      const containerTagsInCard = target_card.querySelector('.tags-container');

      joKanban.domUpdates.tools.removeAllChildHTMLElement(containerTagsInCard);

      card.tags.forEach((tag) => {
        if ("content" in document.createElement('template')) {
          const tagFragment = document.importNode(joKanban.elements.templateTagCard.content, true);
          const tagElmt = tagFragment.querySelector('a[tagcard-id]');
          tagElmt.setAttribute('tagcard-id', tag.id);
          tagElmt.textContent = tag.name;
          tagElmt.style.background = tag.color;
          tagElmt.addEventListener('dblclick', joKanban.handleEvent.dblClickOnTagCard(tag.id, card.id, list.id));
          containerTagsInCard.appendChild(tagFragment);
          containerTagsInCard.closest('nav').classList.remove('is-hidden');
        }
      });
      if (card.tags.length == 0) {
        containerTagsInCard.closest('nav').classList.add('is-hidden');
      }
    },

    /**
     * @method refreshCardsInList Refresh Tags in a Card in DOM
     * @param {all} card Card object
     * @param {all} list List object
     */
    async refreshCardsInList(list) {
      if ("content" in document.createElement('template')) {
        const target_list = joKanban.domUpdates.tools.queryListElmtById(list.id);
        const card_container = target_list.querySelector('.panel-block');
        joKanban.domUpdates.tools.removeAllChildHTMLElement(card_container);

        list.cards.sort((card1, card2) => {
          return card1.position < card2.position ? -1 : (card1.position > card2.position ? 1 : 0);
        }).forEach((card) => {
          joKanban.domUpdates.makeCardInDom(list, card);
          joKanban.domUpdates.makeAllTagsInCardFromApi(card, list);
        });
      }
    },

    /**
     * @method makeAllListWithCardsFromApi  Make Lists nd cards in DOM from API Response
     */
    makeAllListWithCardsFromApi() {
      if ("content" in document.createElement('template')) {
        joKanban.data.sort((list1, list2) => {
          return list1.position < list2.position ? -1 : (list1.position > list2.position ? 1 : 0);
        }).forEach((list) => {
          joKanban.domUpdates.makeListInDOM(list);
          joKanban.domUpdates.makeAllCardsFromApiInList(list);
        });
      }
    },

    /**
     * @method makeAllCardsFromApiInList  Make Cards in DOM from API Response
     * @param {all} list list object
     */
    makeAllCardsFromApiInList(list) {
      if ("content" in document.createElement('template')) {
        list.cards.sort((card1, card2) => {
          return card1.position < card2.position ? -1 : (card1.position > card2.position ? 1 : 0);
        }).forEach((card) => {
          joKanban.domUpdates.makeCardInDom(list, card);
          joKanban.domUpdates.makeAllTagsInCardFromApi(card, list);
        });
      }
    },

    /**
     * @method makeAllTagsInMenuFromApi  Make Tags in Menu from API Response
     */
    makeAllTagsInMenuFromApi() {
      if ("content" in document.createElement('template')) {
        joKanban.tags.forEach((tag) => {
          joKanban.domUpdates.makeTagInMenu(tag);
        });
      }
    },

    /**
     * @method makeAllTagsInCardFromApi  Make Tags in Card from API Response
     * @param {all} card card object
     * @param {all} list list object
     */
    makeAllTagsInCardFromApi(card, list) {
      if ("content" in document.createElement('template')) {
        card.tags.forEach((tag) => {
          joKanban.domUpdates.associateTagToCardInDOM(tag, card, list);
        });
      }
    },
  },

  /**
   * @method initModalsListener Refresh joKanban listeners on modals
   */
  initModalsListener() {
    // Click Event Listener on "add list" Button
    joKanban.elements.addListModalAddButton.addEventListener('click', joKanban.handleEvent.clickAddListBt);
    // Submit Event Listener on "AddListModal" Form
    joKanban.elements.addListModalForm.addEventListener('submit', joKanban.handleEvent.submitAddListForm);
    // Click Event Listener on all close Button for "AddListModal"
    let closeBts = joKanban.elements.addListModal.querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', joKanban.handleEvent.clickToggleModal(joKanban.elements.addListModal));
    });

    // Click Event Listener on "add tag" Button
    joKanban.elements.addTagModalAddButton.addEventListener('click', joKanban.handleEvent.clickAddTagBt);

    // Click Event Listener on all close Button for "AddListModal"
    closeBts = joKanban.elements.addTagModal.querySelectorAll('.close');
    closeBts.forEach((buttonClose) => {
      buttonClose.addEventListener('click', joKanban.handleEvent.clickToggleModal(joKanban.elements.addTagModal));
    });

    // Submit Event Listener on "AddCardModal" Form
    joKanban.elements.addCardModalForm.addEventListener('submit', joKanban.handleEvent.submitAddCardForm);
    // Click Event Listener on all close Button for "AddCardModal"
    closeBts = joKanban.elements.addCardModal.querySelectorAll('.close');
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
      joKanban.domUpdates.makeAllListWithCardsFromApi();
      joKanban.reIndexListNdCardPosition();
    }
    joKanban.tags = await joKanban.api.tag.getTagsFromAPI();
    if (joKanban.tags) {
      joKanban.domUpdates.makeAllTagsInMenuFromApi();
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