import {ApplicationUser} from "../application/applicationUser";
import {ApplicationPageUrls} from "../constants";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementType,
    ModalWindowFactory
} from "../components/modalWindow";
import BoardsService from "../services/boardsService";
import ListsService from "../services/listsService";
import CardsService from "../services/cardsService";
import {BoardDto, CreateBoardDto} from "../dtos/boards";
import utils from "../utils";
import {CreateListDto} from "../dtos/lists";
import {CreateCardDto} from "../dtos/cards";

export class BoardPage {

    constructor() {
        /** @private */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();
        if (!utils.isInit(this.applicationUser)) {
            window.location = ApplicationPageUrls.homePage;
            return;
        }

        /** @private */
        this.transferredData = null;

        /** @private */
        this.currentPlaceholderData = null;

        /**
         * @private
         * @readonly
         * @type {string}
         */
        this.currentBoardId = new URLSearchParams(window.location.search).get("board_id");
        if (!utils.isInit(this.currentBoardId)) {
            window.location = ApplicationPageUrls.homePage;
            return;
        }

        /**
         * @private
         * @type {BoardsService}
         */
        this.boardsService = new BoardsService();

        /**
         * @private
         * @type {ListsService}
         */
        this.listsService = new ListsService();

        /**
         * @private
         * @type {CardsService}
         */
        this.cardsService = new CardsService();


    }

    initialize() {
        this.setBoardInfo();
        this.drawBoard();
        this.setupInteractions();

    }

    /**
     * @private
     */
    setBoardInfo() {
        const boardHeaderElem = document.querySelector(".board-header");
        /** @type HTMLElement */
        const boardTitleElem = boardHeaderElem.querySelector(".board-title");

        // TODO: Rework this method. Here we need to obtain only specific board statistics and that's it.

        this.boardsService.getUserBoard(this.applicationUser.id, this.currentBoardId,
            /** @param {BoardDto} board */
            (board) => {
                boardTitleElem.value = board.name;

            },
            () => {
                ModalWindowFactory.showErrorOkMessage("Error occurred", "Error of getting board information");
            });
    }

    /**
     * @private
     */
    drawBoard() {
        /** @type HTMLElement */
        const listContainerElem = document.querySelector(".lists-container");

        // Retrieve all boards data (lists and related cards)
        this.listsService.getAllBoardLists(this.currentBoardId,
            /** @param {ListDto[]} lists */
            (lists) => {
                lists.forEach(/** @type ListDto */list => {
                    this.addListToBoard(list.id, list.name, list.orderNumber);

                    /** @type HTMLElement */
                    const justAddedListElem = listContainerElem.querySelector(`[data-list-id="${list.id}"]`);
                    list.cards.forEach(/** @type CardDto */card => {
                        this.addCardToList(justAddedListElem, card.id, card.name, card.orderNumber);
                    });

                });



            },
            () => {
                ModalWindowFactory.showErrorOkMessage("Error occurred", "Error of getting user boards");
            });

    }

    /**
     * @private
     */
    setupInteractions() {
        const pageContainerElem = document.querySelector(".page-container");
        const listContainerElem = document.querySelector(".lists-container");

        // "Add a list" link click handler
        const addListLinkElem = document.querySelector(".add-list-button");
        addListLinkElem.addEventListener("click", () => {
            this.createNewList();
        });

        let timeoutId = null;
        listContainerElem.addEventListener("keyup", (e) => {
            if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("list-caption")){
                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    let listId = e.target.parentElement.parentElement.parentElement.getAttribute("data-list-id");
                    console.log(listId + " " + e.target.value);
                    e.target.blur();
                }, 1000);
            }
        });

        // "Add a card" link click handler
        listContainerElem.addEventListener("click", (e) => {
            let listElem = null;
            if (e.target && e.target.classList.contains("card-composer")) {
                listElem = e.target.parentElement;
            } else if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("card-composer")) {
                listElem = e.target.parentElement.parentElement;
            }
            // TODO: use closest()

            if (listElem) {
                this.createNewCard(listElem);
            }

        });



        pageContainerElem.addEventListener("dragstart", (e) => {
            this.transferredData = null;
            this.clearPlaceholderData();

            if (e.target.classList.contains("list-card")) {
                // --- Card started dragging ---

                const listCardElem = e.target;

                requestAnimationFrame(() => {
                    listCardElem.classList.add("hidden-dragging-card");
                });

                const targetListElem = listCardElem.closest(".list");

                this.transferredData = {
                    elementType: "card",
                    listRef: targetListElem,
                    cardRef: listCardElem
                };

            } else if (e.target.classList.contains("list")) {
                // --- List started dragging ---

                /** @type HTMLElement */
                const listElem = e.target;

                requestAnimationFrame(() => {
                    listElem.parentElement.classList.add("hidden-dragging-list");
                });

                this.transferredData = {
                    elementType: "list",
                    listRef: listElem
                };

            }
        });

        pageContainerElem.addEventListener("dragover", (e) => {
            e.preventDefault();

            if (this.transferredData === null)
                return;

            if (this.transferredData.elementType === "card") {
                /** @type HTMLElement */
                const dragoverElem = e.target;

                const listHeaderElem = dragoverElem.closest(".list-header");
                const listCardsElem = dragoverElem.closest(".list-cards");
                const cardComposerElem = dragoverElem.closest(".card-composer");
                const listWrapperElem = dragoverElem.closest(".list-wrapper");

                if (listHeaderElem) {
                    // Put a placeholder to the beginning of the list
                    this.addCardPlaceHolderToList(listHeaderElem.parentElement, "begin");
                } else if (listCardsElem) {
                    const listCardElem = dragoverElem.closest(".list-card");

                    if (listCardElem) {
                        // If a draggable card is dragging over right above some card, put a placeholder right after this card
                        this.addCardPlaceholderAfterCard(listCardElem);
                    } else {
                        if (listCardsElem.children.length === 0) {
                            // If dragover list has no cards, put a placeholder to the beginning
                            this.addCardPlaceHolderToList(listHeaderElem.parentElement, "begin");
                        } else {
                            // If a draggable card is dragging over free space between two cards, put a placeholder right after the first one
                            const placedElem = document.elementFromPoint(e.clientX, e.clientY - 8);
                            const listCardElem = placedElem.closest(".list-card");

                            if (listCardElem) {
                                this.addCardPlaceholderAfterCard(listCardElem);
                            }
                        }
                    }
                } else if (cardComposerElem) {
                    // Put a placeholder to the end of the list
                    this.addCardPlaceHolderToList(cardComposerElem.parentElement, "end");

                } else if (listWrapperElem) {
                    // Put a placeholder to the end of the list
                    this.addCardPlaceHolderToList(listWrapperElem.lastElementChild, "end");
                }
            } else if (this.transferredData.elementType === "list") {
                /** @type HTMLElement */
                const dragoverElem = e.target;

                const listWrapperElem = dragoverElem.closest(".list-wrapper");
                if (listWrapperElem) {
                    const listElem = listWrapperElem.querySelector(".list");

                    if (!listElem) {
                        return;
                    }

                    /** @type DOMRect */
                    const rect = listWrapperElem.getBoundingClientRect();

                    if (e.clientX >= rect.x && e.clientX < rect.x + rect.width / 2) {
                        // --- first half of dragovered list ---
                        console.log("first half");
                        this.addListPlaceholder(listElem, "before");
                    } else if (e.clientX >= rect.x + rect.width / 2 && e.clientX <= rect.x + rect.width) {
                        // --- second half of dragovered list ---
                        console.log("second half");
                        this.addListPlaceholder(listElem, "after");
                    }
                }
            }
        });

        pageContainerElem.addEventListener("dragend", (e) => {
            if (this.transferredData === null)
                return;

            // If the dragged element is dropped somewhere other than its potential destination, cancel dragging
            if (this.transferredData.elementType === "card") {
                this.transferredData.cardRef.classList.remove("hidden-dragging-card");
            } else {
                this.transferredData.listRef.parentElement.classList.remove("hidden-dragging-list");
            }
        });

        pageContainerElem.addEventListener("drop", (e) => {
            e.preventDefault();

            if (!this.transferredData || !this.currentPlaceholderData)
                return;

            if (this.transferredData.elementType === "card") {
                /** @type Element */
                const draggedCardElem = this.transferredData.cardRef;

                // Place dragged card into allocated placeholder
                const placeholderElem = this.currentPlaceholderData.placeholderRef;
                placeholderElem.parentElement.replaceChild(draggedCardElem, placeholderElem);
                draggedCardElem.classList.remove("hidden-dragging-card");

                // Renumber all cards in new order for the list in which the card was placed
                this.renumberAllCardsInList(this.currentPlaceholderData.listElemRef);

                // Renumber all cards in new order for the list from which the card was taken
                this.renumberAllCardsInList(this.transferredData.listRef);

            } else if (this.transferredData.elementType === "list") {
                /** @type Element */
                const listContainerElem = document.querySelector(".lists-container");
                const draggedListElem = this.transferredData.listRef;
                const draggedListWrapper = draggedListElem.parentElement;

                // Place dragged list into allocated placeholder
                const placeholderElem = this.currentPlaceholderData.placeholderRef;
                const placeholderListWrapper = placeholderElem.parentElement;

                listContainerElem.replaceChild(draggedListWrapper, placeholderListWrapper);
                draggedListWrapper.classList.remove("hidden-dragging-list");

                // Renumber all list in the board
                this.renumberAllLists();
            }

            this.transferredData = null;
            this.clearPlaceholderData();
        });
    }



    /**
     * @private
     */
    createNewList() {

        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [
            /**
             * @param {string} serializedFormData
             */
            (serializedFormData) => {
                // Ok pressed

                const lastListOrderNumber = this.getListLastOrderNumber();

                const createListDtoRaw = JSON.parse(serializedFormData);

                /** @type CreateListDto */
                const createListDto = new CreateListDto(createListDtoRaw.name, lastListOrderNumber + 1, this.currentBoardId);

                this.listsService.createList(createListDto,
                    (data) => {

                        this.addListToBoard(data.listId, createListDto.name, createListDto.orderNumber);
                        modalWindow.close();
                    },
                    (error) => {
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of creating new list. Reason: ${error}`);
                    });
            },
            () => {
                // Cancel pressed
                modalWindow.close();
            }
        ];

        const windowElements = [
            new ModalWindowElement(ModalWindowElementType.Input, "name", "List name", "My list"),
        ];

        modalWindow = new ModalWindow("Create new list", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }


    /**
     * @private
     * @param {string} listId
     * @param {string} listName
     * @param {number} orderNumber
     */
    addListToBoard(listId, listName, orderNumber) {
        const newListElem = document.createElement("div");
        newListElem.classList.add("animated", "fadeIn", "list");
        newListElem.setAttribute("data-list-id", listId);
        newListElem.setAttribute("data-order-number", orderNumber.toString());
        newListElem.setAttribute("draggable", "true");
        newListElem.innerHTML = `
                <div class="list-header">
                    <div class="list-caption">
                        <input type="text" value="${listName}" >
                    </div>
                    <div class="list-menu-button">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                <div class="list-cards">
                </div>
                <div class="card-composer">
                    <span>Add a card</span>
                </div>
            `;

        const listWrapperElem = document.createElement("div");
        listWrapperElem.classList.add("list-wrapper");
        listWrapperElem.append(newListElem);

        const listContainerElem = document.querySelector(".lists-container");
        const fakeListWrapperElem = document.querySelector(".fake-list").parentElement;
        listContainerElem.insertBefore(listWrapperElem, fakeListWrapperElem);
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     */
    createNewCard(listElem) {
        /** @type {string} */
        const listId = listElem.getAttribute("data-list-id");

        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [
            /**
             *
             * @param {string} serializedFormData
             */
            (serializedFormData) => {
                // Ok pressed
                const lastCardNumber = this.getCardLastOrderNumber(listElem);
                const createCardDtoRaw = JSON.parse(serializedFormData);

                /** @type CreateCardDto */
                const createCardDto = new CreateCardDto(createCardDtoRaw.name, createCardDtoRaw.description, lastCardNumber + 1, listId);

                this.cardsService.createCard(createCardDto,
                    (data) => {
                        this.addCardToList(listElem, data.cardId, createCardDto.name, createCardDto.orderNumber);
                        modalWindow.close();
                    },
                    (error) => {
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of creating new card. Reason: ${error}`);
                    });
            },
            () => {
                // Cancel pressed
                modalWindow.close();

            }
        ];

        const windowElements = [
            new ModalWindowElement(ModalWindowElementType.Input, "name", "Card name", "My card"),
            new ModalWindowElement(ModalWindowElementType.Textarea, "description", "Card description", "My card description")
        ];

        modalWindow = new ModalWindow("Create new card", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     * @param {string} cardId
     * @param {string} cardName
     * @param {number} orderNumber
     */
    addCardToList(listElem, cardId, cardName, orderNumber) {
        const listCardsElem = listElem.querySelector(".list-cards");

        const listCardElem = document.createElement("div");
        listCardElem.classList.add("animated", "fadeIn", "list-card");
        listCardElem.setAttribute("draggable", "true");
        listCardElem.setAttribute("data-card-id", cardId);
        listCardElem.setAttribute("data-order-number", orderNumber.toString());

        const cardTitleElem = document.createElement("span");
        cardTitleElem.textContent = cardName;
        listCardElem.append(cardTitleElem);

        listCardsElem.append(listCardElem);
    }

    /**
     * @private
     * @return number
     */
    getListLastOrderNumber() {
        const listsContainerElem = document.querySelector(".lists-container");
        /** @type NodeListOf */
        const allListWrappers = listsContainerElem.querySelectorAll(".list-wrapper");

        if (allListWrappers.length === 0) {
            return 0;
        }

        /** @type HTMLElement */
        const lastListWrapperElem = allListWrappers[allListWrappers.length - 1];
        const orderNumberRaw = lastListWrapperElem.lastElementChild.getAttribute("data-order-number");

        if (orderNumberRaw) {
            return parseInt(orderNumberRaw);
        } else {
            return 0;
        }
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     * @return number
     */
    getCardLastOrderNumber(listElem) {
        const lastCardElem = listElem.querySelector(".list-cards").lastElementChild;

        if (lastCardElem) {
            return parseInt(lastCardElem.getAttribute("data-order-number"));
        }

        return 0;
    }

    /**
     * @private
     * @return {HTMLDivElement}
     */
    createCardPlaceholderElem() {
        const cardPlaceholderElem = document.createElement("div");
        cardPlaceholderElem.classList.add("list-card-placeholder");
        cardPlaceholderElem.style.height = this.transferredData.cardRef.offsetHeight + "px";

        return cardPlaceholderElem;
    }

    /**
     * @private
     * @return {HTMLDivElement}
     */
    createListPlaceholderElem() {
        const listPlaceholderElem = document.createElement("div");
        listPlaceholderElem.classList.add("list-placeholder");
        listPlaceholderElem.style.height = this.transferredData.listRef.offsetHeight + "px";

        return listPlaceholderElem;
    }

    /**
     * @private
     * @param {Element} listElem
     * @param {string} position
     */
    addCardPlaceHolderToList(listElem, position) {
        if (this.currentPlaceholderData &&
            this.currentPlaceholderData.listElemRef === listElem &&
            this.currentPlaceholderData.position === position)
            return;

        // Remove previously created card placeholder
        this.clearPlaceholderData();

        const cardPlaceholderElem = this.createCardPlaceholderElem();

        this.currentPlaceholderData = {
            elementType: "card",
            placeholderRef: cardPlaceholderElem,
            listElemRef: listElem,
            position: position,
            placeholderHeight: this.transferredData.cardRef.offsetHeight
        };

        const listCardsElem = listElem.children[1]; // list-cards elem

        if (position === "begin") {
            listCardsElem.prepend(cardPlaceholderElem);
        } else if (position === "end") {
            listCardsElem.append(cardPlaceholderElem);
        }
    }


    /**
     * @private
     * @param {Element} listsContainerElem
     * @param {string} position
     */
    addListPlaceHolderToBoard(listsContainerElem, position) {
        if (this.currentPlaceholderData &&
            this.currentPlaceholderData.position === position)
            return;

        // Remove previously created list placeholder
        this.clearPlaceholderData();

        const listWrapperElem = document.createElement("div");
        listWrapperElem.classList.add("list-wrapper");
        const listPlaceholderElem = this.createListPlaceholderElem();
        listWrapperElem.append(listPlaceholderElem);

        this.currentPlaceholderData = {
            elementType: "list",
            placeholderRef: listPlaceholderElem,
            position: position,
            placeholderHeight: this.transferredData.listRef.offsetHeight
        };

        if (position === "begin") {
            listsContainerElem.prepend(listWrapperElem);
        } else if (position === "end") {
            listsContainerElem.append(listWrapperElem);
        }
    }

    /**
     * @private
     * @param {Element} cardElem
     */
    addCardPlaceholderAfterCard(cardElem) {
        if (this.currentPlaceholderData && this.currentPlaceholderData.listElemRef === cardElem.parentElement.parentElement &&
            this.currentPlaceholderData.position === parseInt(cardElem.getAttribute("data-order-number")) + 1)
            return;

        // Remove previously created card placeholder
        this.clearPlaceholderData();

        const cardPlaceholderElem = this.createCardPlaceholderElem();

        cardElem.after(cardPlaceholderElem);

        this.currentPlaceholderData = {
            elementType: "card",
            placeholderRef: cardPlaceholderElem,
            listElemRef: cardElem.parentElement.parentElement,
            position: parseInt(cardElem.getAttribute("data-order-number")) + 1,
            placeholderHeight: this.transferredData.cardRef.offsetHeight
        };
    }

    /**
     * @private
     * @param {Element} listElem
     * @param {string} place
     */
    addListPlaceholder(listElem, place) {
        const inc = place === "before" ? -1 : +1;

        if (this.currentPlaceholderData && this.currentPlaceholderData.position === parseInt(listElem.getAttribute("data-order-number")) + inc)
            return;

        // Remove previously created list placeholder
        this.clearPlaceholderData();

        const placeholderListWrapperElem = document.createElement("div");
        placeholderListWrapperElem.classList.add("list-wrapper");
        const listPlaceholderElem = this.createListPlaceholderElem();
        placeholderListWrapperElem.append(listPlaceholderElem);

        if (place === "before") {
            listElem.parentElement.before(placeholderListWrapperElem);
        } else { // after
            listElem.parentElement.after(placeholderListWrapperElem);
        }

        this.currentPlaceholderData = {
            elementType: "list",
            placeholderRef: listPlaceholderElem,
            position: parseInt(listElem.getAttribute("data-order-number")) + inc,
            placeholderHeight: this.transferredData.listRef.offsetHeight
        };
    }

    /**
     * @private
     */
    clearPlaceholderData() {
        if (this.currentPlaceholderData) {
            if (this.currentPlaceholderData.elementType === "card")
                this.currentPlaceholderData.placeholderRef.remove();
            else
                this.currentPlaceholderData.placeholderRef.parentElement.remove();
            this.currentPlaceholderData = null;
        }
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     */
    renumberAllCardsInList(listElem) {
        const listCardsElem = listElem.querySelector(":scope > .list-cards");
        listCardsElem.children.forEach((cardElem, idx) => {
            cardElem.setAttribute("data-order-number", (idx + 1).toString());
        });
    }

    /**
     * @private
     */
    renumberAllLists() {
        const listsContainerElem = document.querySelector(".lists-container");
        const lists = listsContainerElem.querySelectorAll(".list:not(.fake-list)");
        lists.forEach((listElem, idx) => {
            listElem.setAttribute("data-order-number", (idx + 1).toString());
        });
    }
}
