import {ApplicationUser} from "../../application/applicationUser";
import {ApplicationPageUrls} from "../../constants";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementType,
    ModalWindowFactory
} from "../../components/modalWindow";
import BoardsService from "../../services/boardsService";
import ListsService from "../../services/listsService";
import CardsService from "../../services/cardsService";
import {BoardDto, CreateBoardDto} from "../../dtos/boards";
import utils from "../../utils";
import {CreateListDto} from "../../dtos/lists";
import {CreateCardDto} from "../../dtos/cards";

export class BoardPage {

    constructor() {
        /** @private */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();
        if (!utils.isInit(this.applicationUser)) {
            window.location = ApplicationPageUrls.homePage;
            return;
        }

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
        /** @type HTMLElement */
        const boardDescriptionElem = boardHeaderElem.querySelector(".board-description");
        /** @type HTMLElement */
        const listsTotalElem = boardHeaderElem.querySelector(".lists-total");
        /** @type HTMLElement */
        const cardsTotalElem = boardHeaderElem.querySelector(".cards-total");
        /** @type HTMLElement */
        const filesAttachedElem = boardHeaderElem.querySelector(".files-attached-total");
        /** @type HTMLElement */
        const tagsTotalElem = boardHeaderElem.querySelector(".tags-total");

        this.boardsService.getUserBoard(this.applicationUser.id, this.currentBoardId,
            /** @param {BoardDto} board */
            (board) => {
                boardTitleElem.innerText = board.name;
                boardDescriptionElem.innerText = board.description;
                listsTotalElem.innerText = board.listsTotal;
                cardsTotalElem.innerText = board.cardsTotal;
                filesAttachedElem.innerText = board.filesAttachedTotal;
                tagsTotalElem.innerText = board.tagsTotal;
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

        const currentListContainerHeight = parseFloat(getComputedStyle(listContainerElem, null).height.replace("px", ""));

        // Retrieve all boards data (lists and related cards)
        this.listsService.getAllBoardLists(this.currentBoardId,
            /** @param {ListDto[]} lists */
            (lists) => {
                lists.forEach(list => {
                    this.addListToBoard(list.id, list.name);

                    /** @type HTMLElement */
                    const justAddedListElem = listContainerElem.querySelector(`[data-list-id="${list.id}"]`);
                    list.cards.forEach(card => {
                        this.addCardToList(justAddedListElem, card.id, card.name);
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
        const addListLink = document.querySelector(".fake-list span");
        addListLink.addEventListener("click", () => {
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

            if (listElem) {
                this.createNewCard(listElem);
            }

        });

        listContainerElem.addEventListener("dragstart", (e) => {
            if (e.target.classList.contains("list-card")) {
                // List card started dragging
                //e.dataTransfer.setData("text", e.target.id);

            }
        });

        listContainerElem.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        listContainerElem.addEventListener("drop", (e) => {
            e.preventDefault();

            const targetList = e.target.closest(".list");
            if (targetList) {
                // console.log(targetList);
                // var data = e.dataTransfer.getData("text");
                // console.log(data);
            }


        });
    }



    /**
     * @private
     */
    createNewList() {
        const callbacks = [
            (gatheredElementsData, operationCallback) => {
                // Ok pressed

                const createListDtoRaw = JSON.parse(gatheredElementsData);
                const createListDto = new CreateListDto(createListDtoRaw.name, parseInt(createListDtoRaw.orderNumber), this.currentBoardId);

                this.listsService.createList(createListDto,
                    (data) => {
                        operationCallback(); // Simply close the dialog
                        this.addListToBoard(data.listId, createListDto.name);
                    },
                    (error) => {
                        operationCallback({error: error});
                    });
            },
            () => {
                // Cancel pressed

            }
        ];

        const windowElements = [
            new ModalWindowElement(ModalWindowElementType.Input, "name", "List name", "My list"),
            new ModalWindowElement(ModalWindowElementType.Input, "orderNumber", "Order number", "1")
        ];

        new ModalWindow("Create new list", DialogTypes.OkCancel, callbacks, windowElements).show();
    }


    /**
     * @private
     * @param {string} listId
     * @param {string} listName
     */
    addListToBoard(listId, listName) {

        const newList = document.createElement("div");
        newList.classList.add("animated", "fadeIn", "list");
        newList.setAttribute("data-list-id", listId);
        newList.innerHTML = `
                <div class="list-header">
                    <div class="list-caption">
                        <input type="text" value="${listName}" >
                    </div>
                    <div class="list-menu-button">
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
        this.setBoardInfo();
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     */
    createNewCard(listElem) {
        /** @type {string} */
        const listId = listElem.getAttribute("data-list-id");

        const callbacks = [
            (gatheredElementsData, operationCallback) => {
                // Ok pressed

                const createCardDtoRaw = JSON.parse(gatheredElementsData);
                const createCardDto = new CreateCardDto(createCardDtoRaw.name, createCardDtoRaw.description, parseInt(createCardDtoRaw.orderNumber), listId);

                this.cardsService.createCard(createCardDto,
                    (data) => {
                        operationCallback(); // Simply close the dialog
                        this.addCardToList(listElem, data.cardId, createCardDto.name);
                    },
                    (error) => {
                        operationCallback({error: error});
                    });
            },
            () => {
                // Cancel pressed

            }
        ];

        const windowElements = [
            new ModalWindowElement(ModalWindowElementType.Input, "name", "Card name", "My card"),
            new ModalWindowElement(ModalWindowElementType.Input, "description", "Card description", "My card description"),
            new ModalWindowElement(ModalWindowElementType.Input, "orderNumber", "Order number", "1")
        ];

        new ModalWindow("Create new card", DialogTypes.OkCancel, callbacks, windowElements).show();
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     * @param {string} cardId
     * @param {string} cardName
     */
    addCardToList(listElem, cardId, cardName) {
        const listCards = listElem.querySelector(".list-cards");

        const listCard = document.createElement("div");
        listCard.classList.add("animated", "fadeIn", "list-card");
        listCard.setAttribute("draggable", "true");
        //listCard.setAttribute("ondragstart", "drag(event)");
        // TODO: set id after successful write to db
        listCard.setAttribute("data-card-id", cardId);

        const cardTitle = document.createElement("span");
        cardTitle.textContent = cardName;
        listCard.append(cardTitle);

        listCards.append(listCard);

        this.setBoardInfo();
    }


}
