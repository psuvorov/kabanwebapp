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
        this.currentElementPlaceholderData = null;

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





        listContainerElem.addEventListener("dragstart", (e) => {
            this.transferredData = null;
            this.clearPlaceholderData();


            // ----------------------------------
            // TODO: mark current draggable element
            // ----------------------------------

            if (e.target.classList.contains("list-card")) {
                // --- Card started dragging ---

                /** @type HTMLElement */
                const listCardElem = e.target;

                /** @type HTMLElement */
                const targetListElem = listCardElem.closest(".list");

                this.transferredData = {
                    elementType: "card",
                    listId: targetListElem.getAttribute("data-list-id"),
                    cardId: listCardElem.getAttribute("data-card-id"),
                    cardHeight: listCardElem.offsetHeight
                };
                e.dataTransfer.setData("text", JSON.stringify(this.transferredData));

            } else if (e.target.classList.contains("list")) {
                // --- List started dragging ---

                this.transferredData = {
                    elementType: "list",
                    // listId: this.transferredData.listRef.getAttribute("data-list-id"),
                };
                e.dataTransfer.setData("text", JSON.stringify(this.transferredData));

            }


        });

        listContainerElem.addEventListener("dragover", (e) => {
            e.preventDefault();

            /** @type HTMLElement */
            const dragoverElem = e.target;

            const listHeaderElem = dragoverElem.closest(".list-header");
            const listCardsElem = dragoverElem.closest(".list-cards"); // ???
            const cardComposerElem = dragoverElem.closest(".card-composer");
            const listWrapperElem = dragoverElem.closest(".list-wrapper");

            if (listHeaderElem) {
                console.log("- listHeader Elem");

                this.addCardPlaceHolderToList(listHeaderElem.parentElement, "begin");
            } else if (listCardsElem) {
                const listCardElem = dragoverElem.closest(".list-card");

                if (listCardElem) {
                    console.log("- listCards Elem +++ listCard Elem " + listCardElem.getAttribute("data-card-id"));

                    this.addCardPlaceHolderAfterCard(listCardElem);
                } else {
                    console.log("- listCards Elem --- listCard Elem");

                    if (listCardsElem.children.length === 0) {

                        this.addCardPlaceHolderToList(listHeaderElem.parentElement, "begin");
                    } else {
                        const placedElem = document.elementFromPoint(e.clientX, e.clientY - 8);
                        const listCardElem = placedElem.closest(".list-card");

                        if (listCardElem) {
                            this.addCardPlaceHolderAfterCard(listCardElem);
                        }
                    }
                }
            } else if (cardComposerElem) {
                console.log("- cardComposer Elem");

                this.addCardPlaceHolderToList(cardComposerElem.parentElement, "end");

            } else if (listWrapperElem) {
                console.log("- listWrapper Elem");

                this.addCardPlaceHolderToList(listWrapperElem.lastElementChild, "end");
            }

        });


        listContainerElem.addEventListener("drop", (e, target) => {
            e.preventDefault();

            const targetCardElem = e.target.closest(".list-card");

            console.log("qwe");

            // const targetList = e.target.closest(".list");
            // if (targetList) {
            //     console.log(targetList);
            //     var data = e.dataTransfer.getData("text");
            //     console.log(data);
            // }


            this.transferredData = null;
            if (this.currentElementPlaceholderData) {
                this.currentElementPlaceholderData.elementType = null;
                this.currentElementPlaceholderData.ref.remove();
                this.currentElementPlaceholderData.position = null;
                this.currentElementPlaceholderData.placeholderHeight = null;
            }

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

        const newList = document.createElement("div");
        newList.classList.add("animated", "fadeIn", "list");
        newList.setAttribute("data-list-id", listId);
        newList.setAttribute("data-order-number", orderNumber.toString());
        newList.innerHTML = `
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

        const listWrapper = document.createElement("div");
        listWrapper.classList.add("list-wrapper");
        listWrapper.append(newList);

        const listContainerElem = document.querySelector(".lists-container");
        const fakeListWrapperElem = document.querySelector(".fake-list").parentElement;
        listContainerElem.insertBefore(listWrapper, fakeListWrapperElem);
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
        const listCards = listElem.querySelector(".list-cards");

        const listCard = document.createElement("div");
        listCard.classList.add("animated", "fadeIn", "list-card");
        listCard.setAttribute("draggable", "true");
        //listCard.setAttribute("ondragstart", "drag(event)");
        listCard.setAttribute("data-card-id", cardId);
        listCard.setAttribute("data-order-number", orderNumber.toString());

        const cardTitle = document.createElement("span");
        cardTitle.textContent = cardName;
        listCard.append(cardTitle);

        listCards.append(listCard);
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
     * @param {Element} listElem
     * @param {string} position
     */
    addCardPlaceHolderToList(listElem, position) {
        if (this.currentElementPlaceholderData &&
            this.currentElementPlaceholderData.listElemRef === listElem &&
            this.currentElementPlaceholderData.position === position)
            return;

        // Remove previously created card placeholder
        this.clearPlaceholderData();

        const cardPlaceholderElem = document.createElement("div");
        cardPlaceholderElem.classList.add("list-card-placeholder");
        cardPlaceholderElem.style.height = this.transferredData.cardHeight + "px";

        const listCardsElem = listElem.children[1]; // list-cards elem

        this.currentElementPlaceholderData = {
            elementType: "card",
            ref: cardPlaceholderElem,
            listElemRef: listElem,
            position: position,
            placeholderHeight: this.transferredData.cardHeight
        };

        if (position === "begin") {
            listCardsElem.prepend(cardPlaceholderElem);
        } else if (position === "end") {
            if (listCardsElem.lastElementChild) {
                listCardsElem.insertBefore(cardPlaceholderElem, listCardsElem.lastElementChild.nextSibling);
            } else {
                listCardsElem.append(cardPlaceholderElem);
            }
        }
        this.currentElementPlaceholderData.position = position;

    }

    /**
     * @private
     * @param {Element} cardElem
     */
    addCardPlaceHolderAfterCard(cardElem) {
        if (this.currentElementPlaceholderData && this.currentElementPlaceholderData.listElemRef === cardElem.parentElement.parentElement &&
            this.currentElementPlaceholderData.position === parseInt(cardElem.getAttribute("data-order-number")) + 1)
            return;

        // Remove previously created card placeholder
        this.clearPlaceholderData();

        const cardPlaceholderElem = document.createElement("div");
        cardPlaceholderElem.classList.add("list-card-placeholder");
        cardPlaceholderElem.style.height = this.transferredData.cardHeight + "px";

        cardElem.after(cardPlaceholderElem);

        this.currentElementPlaceholderData = {
            elementType: "card",
            ref: cardPlaceholderElem,
            listElemRef: cardElem.parentElement.parentElement,
            position: parseInt(cardElem.getAttribute("data-order-number")) + 1,
            placeholderHeight: this.transferredData.cardHeight
        };
    }

    /**
     * @private
     */
    clearPlaceholderData() {
        if (this.currentElementPlaceholderData) {
            this.currentElementPlaceholderData.elementType = null;
            this.currentElementPlaceholderData.ref.remove();
            this.currentElementPlaceholderData.listElemRef = null;
            this.currentElementPlaceholderData.position = null;
            this.currentElementPlaceholderData.placeholderHeight = null;
        }
    }


}
