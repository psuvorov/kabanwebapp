import {ApplicationUser} from "../../application/applicationUser";
import {ApplicationPageUrls, ImageOrientation, ServerBaseUrl} from "../../constants";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";
import {PopupMenu, PopupMenuItem, PopupMenuItemSeparator} from "../components/popupMenu";
import utils from "../../utils";
import {LoadingScreen} from "../components/loadingScreen";
import {CardDetails} from "../windows/cardDetails";
import {BoardDetails} from "../windows/boardDetails";
import {CardsHelper} from "../helpers/CardsHelper";
import {ListsHelper} from "../helpers/ListsHelper";
import BoardsService from "../../services/boardsService";
import {ListsService} from "../../services/listsService";
import {CardsService} from "../../services/cardsService";

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
         * @readonly
         * @type {BoardsService}
         */
        this.boardsService = new BoardsService();

        /**
         * @private
         * @readonly
         * @type {ListsService}
         */
        this.listsService = new ListsService();

        /**
         * @private
         * @readonly
         * @type {CardsService}
         */
        this.cardsService = new CardsService();

        /**
         * @private
         * @type {LoadingScreen}
         */
        this.loadingScreen = new LoadingScreen();

        /**
         *
         * @type {{wallpaperImg: string, description: string, user: {firstName: string, lastName: string, avatarImg: string, id: string, username: string}, participants: []}}
         */
        this.boardInformation = {
            user: {
                id: "",
                firstName: "",
                lastName: "",
                username: "",
                avatarImg: ""
            },
            participants: [

            ],
            description: "",
            wallpaperImg: ""
        };
    }

    initialize() {
        this.drawBoard();
        this.setupInteractions();
    }

    /**
     * @private
     */
    drawBoard() {
        const topMenuRowElem = document.querySelector(".top-menu-row");
        const listContainerElem = document.querySelector(".lists-container");
        const boardHeaderElem = document.querySelector(".board-header");
        const boardTitleElem = boardHeaderElem.querySelector(".board-title");

        // Clear previously created board
        listContainerElem.querySelectorAll(".list-wrapper").forEach(list => {
            list.remove();
        });

        topMenuRowElem.style.backgroundColor = "#fff";

        this.loadingScreen.show();

        this.boardsService.getBoard(this.currentBoardId,
        (board) => {
            boardTitleElem.value = board.name;
            boardTitleElem.setAttribute("data-board-name", board.name); // as a fallback in attempt setting null empty value
            board.lists.forEach(list => {
                this.addListToBoard(list.id, list.name, list.orderNumber);

                /** @type HTMLElement */
                const justAddedListElem = listContainerElem.querySelector(`[data-list-id="${list.id}"]`);
                list.cards.forEach(card => {
                    this.addCardToList(justAddedListElem, card);
                });
            });

            this.boardInformation.description = board.description;

            const pageContainerElem = document.querySelector(".page-container");
            pageContainerElem.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${ServerBaseUrl + board.wallpaperPath})`;
            pageContainerElem.style.display = "block";

            this.loadingScreen.close();
        },
        (error) => {
            console.error(error);
            this.loadingScreen.close();
            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting user board. Reason: ${error}`);
        });
    }

    /**
     * @private
     */
    setupInteractions() {
        const pageContainerElem = document.querySelector(".page-container");
        const boardTitleElem =  pageContainerElem.querySelector(".board-title");
        const listContainerElem = document.querySelector(".lists-container");

        // Update board name after delay
        let boardNameUpdateTimeoutId = null;
        boardTitleElem.addEventListener("keyup", (e) => {
            clearTimeout(boardNameUpdateTimeoutId);

            boardNameUpdateTimeoutId = setTimeout(() => {
                if (utils.isNullOrWhitespace(e.target.value)) {
                    e.target.value = boardTitleElem.getAttribute("data-board-name");
                }
                e.target.blur();

                this.boardsService.updateBoardInfo(this.currentBoardId, {boardId: this.currentBoardId, name: e.target.value},
                    () => {},
                    (error) => {
                        console.error(error);
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of setting new board name. Reason: ${error}`);
                    });
            }, 1000);
        });

        // "Add a list" link click handler
        const addListLinkElem = document.querySelector(".add-list-button");
        addListLinkElem.addEventListener("click", () => {
            this.createNewList();
        });

        // Update list caption after delay
        let listCaptionUpdateTimeoutId = null;
        listContainerElem.addEventListener("keyup", (e) => {
            if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("list-caption")){
                // e.target - input tag
                clearTimeout(listCaptionUpdateTimeoutId);

                listCaptionUpdateTimeoutId = setTimeout(() => {
                    const listElem = e.target.parentElement.parentElement.parentElement;
                    let listId = listElem.getAttribute("data-list-id");
                    let listOrderNumber = listElem.getAttribute("data-order-number");

                    if (utils.isNullOrWhitespace(e.target.value)) {
                        e.target.value = boardTitleElem.getAttribute("data-list-name");
                    }
                    e.target.blur();

                    this.listsService.updateList(this.currentBoardId, {listId, name: e.target.value, orderNumber: parseInt(listOrderNumber)},
                        () => {},
                        (error) => {
                            console.error(error);
                            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of setting new list name. Reason: ${error}`);
                        });

                }, 1000);
            }
        });

        listContainerElem.addEventListener("click", (e) => {
            if (!e.target)
                return;

            const cardComposerElem = e.target.closest(".card-composer");
            const listMenuButtonElem = e.target.closest(".list-menu-button");
            const cardMenuButtonElem = e.target.closest(".card-menu-button");
            const listCardElem = e.target.closest(".list-card");

            if (cardComposerElem) {
                this.createNewCard(cardComposerElem.closest(".list"));
            } else if (listMenuButtonElem) {
                const listElem = e.target.closest(".list");

                /** @type PopupMenu */
                let popupMenu = null;

                const items = [
                    new PopupMenuItem("Add new card", () => {
                        this.createNewCard(listElem);
                        popupMenu.close();
                    }),
                    new PopupMenuItem("Copy list",() => {
                        this.copyList(listElem);
                        popupMenu.close();
                    }),
                    new PopupMenuItem("Move list to board",() => {
                        console.log("Move list");
                        popupMenu.close();
                    }),
                    new PopupMenuItemSeparator(),
                    new PopupMenuItem("Archive list",() => {
                        (new ListsHelper).archiveList(this.currentBoardId, this.listsService, listElem);
                        popupMenu.close();
                    })
                ];

                // TODO: take out to external function
                popupMenu = new PopupMenu(items, listMenuButtonElem);
                popupMenu.show();
            } else if (cardMenuButtonElem) {
                /** @type PopupMenu */
                let popupMenu = null;

                const cardElem = cardMenuButtonElem.closest(".list-card");

                const items = [
                    new PopupMenuItem("Copy card",() => {
                        console.log("Copy card");
                        popupMenu.close();
                    }),
                    new PopupMenuItem("Move card to list",() => {
                        console.log("Move card to list");
                        popupMenu.close();
                    }),
                    new PopupMenuItemSeparator(),
                    new PopupMenuItem("Archive card",() => {
                        (new CardsHelper).archiveCard(this.currentBoardId, this.cardsService, cardElem);
                        popupMenu.close();
                    })
                ];

                popupMenu = new PopupMenu(items, cardMenuButtonElem);
                popupMenu.show();
            } else if (listCardElem) {
                this.openCardDetails(listCardElem);
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

                const cardId = draggedCardElem.getAttribute("data-card-id");
                const listId = draggedCardElem.parentElement.parentElement.getAttribute("data-list-id");

                const listA = this.currentPlaceholderData.listElemRef;
                const listB = this.transferredData.listRef;

                this.cardsService.updateCard(this.currentBoardId, {
                        cardId,
                        listId
                    },
                    () => {
                        // Renumber all cards in new order for the list in which the card was placed
                        this.renumberAllCardsInList(listA);

                        // Renumber all cards in new order for the list from which the card was taken
                        this.renumberAllCardsInList(listB);
                    },
                    (error) => {
                        console.error(error);
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of changing card's list. Reason: ${error}`);
                    });
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

        const boardDetailsButtonElem = pageContainerElem.querySelector(".board-details-button");
        boardDetailsButtonElem.addEventListener("click", (e) => {

            this.boardsService.getBoardDetails(this.currentBoardId,
                (boardDetailsDto) => {
                    const boardDetails = new BoardDetails(this.currentBoardId, boardDetailsDto, this.boardsService, this.listsService, this.cardsService, this.drawBoard.bind(this));
                    boardDetails.show();
                },
                (error) => {
                    console.error(error);
                    ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting board details. Reason: ${error}`);
                });
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

                this.listsService.createList(this.currentBoardId,{
                        name: createListDtoRaw.name,
                        orderNumber: lastListOrderNumber + 1,
                        boardId: this.currentBoardId},
                    (data) => {
                        this.addListToBoard(data.listId, createListDtoRaw.name, lastListOrderNumber + 1);
                        modalWindow.close();
                    },
                    (error) => {
                        console.error(error);
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
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "name", "List name", "My list"),
        ];

        modalWindow = new ModalWindow("Create new list", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }

    copyList(listElem) {
        this.loadingScreen.show();

        let listId = listElem.getAttribute("data-list-id");

        this.listsService.copyList(this.currentBoardId, listId,
            (data) => {
                const copiedListId = data.listId;
                this.listsService.getList(this.currentBoardId, copiedListId,
                    (list) => {
                        const listContainerElem = document.querySelector(".lists-container");

                        this.addListToBoard(list.id, list.name, list.orderNumber, listElem);

                        /** @type HTMLElement */
                        const justAddedListElem = listContainerElem.querySelector(`[data-list-id="${list.id}"]`);
                        list.cards.forEach(card => {
                            this.addCardToList(justAddedListElem, card);
                        });

                        this.loadingScreen.close();
                    },
                    (error) => {
                        console.log(error);
                        this.loadingScreen.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting list. Reason: ${error}`);
                    });
            },
            (error) => {
                console.log(error);
                this.loadingScreen.close();
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of copying list. Reason: ${error}`);
            });
    }

    /**
     * @private
     * @param {HTMLElement} cardElem
     */
    openCardDetails(cardElem) {

        // this.kabanBoardService.createCardComment(new CreateCardCommentDto(this.applicationUser.id, "This is a text comment 1", cardId),
        //     (data) => {
        //         console.log("cardCommentId: " + data.cardCommentId);
        //     },
        //     (error) => {
        //         console.error(error);
        //     });

        const cardId = cardElem.getAttribute("data-card-id");

        this.cardsService.getCardDetails(this.currentBoardId, cardId,
            (cardDetails) => {
                console.log(cardDetails);

                const cardDetailsWindow = new CardDetails(this.currentBoardId, cardDetails, this.cardsService, cardElem);
                cardDetailsWindow.show();
            },
            (error) => {
                console.error(error);
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting card details. Reason: ${error}`);
            });


        // /** @type ModalWindow */
        // let modalWindow = null;
        //
        // const callbacks = [
        //     /**
        //      * @param {string} serializedFormData
        //      */
        //         (serializedFormData) => {
        //         // Ok pressed
        //
        //         const lastListOrderNumber = this.getListLastOrderNumber();
        //
        //         const createListDtoRaw = JSON.parse(serializedFormData);
        //
        //         /** @type CreateListDto */
        //         const createListDto = new CreateListDto(createListDtoRaw.name, lastListOrderNumber + 1, this.currentBoardId);
        //
        //         this.kabanBoardService.createList(createListDto,
        //             (data) => {
        //
        //                 this.addListToBoard(data.listId, createListDto.name, createListDto.orderNumber);
        //                 modalWindow.close();
        //             },
        //             (error) => {
        //                 console.error(error);
        //                 modalWindow.close();
        //                 ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of creating new list. Reason: ${error}`);
        //             });
        //     },
        //     () => {
        //         // Cancel pressed
        //         modalWindow.close();
        //     }
        // ];
        //
        //
        //
        // const windowElements = [
        //     new ModalWindowElement(ModalWindowElementType.Input, "cardName", "Card name", cardElem.querySelector("span").textContent),
        // ];
        //
        // modalWindow = new ModalWindow("Card windows", DialogTypes.OkCancel, callbacks, windowElements);
        // modalWindow.show();
    }

    /**
     * @private
     * @param {string} listId
     * @param {string} listName
     * @param {number} orderNumber
     * @param {string | HTMLElement} [position]
     */
    addListToBoard(listId, listName, orderNumber, position) {
        const newListElem = document.createElement("div");
        newListElem.classList.add("animated", "fadeIn", "list");
        newListElem.setAttribute("data-list-id", listId);
        newListElem.setAttribute("data-order-number", orderNumber.toString());
        newListElem.setAttribute("draggable", "true");
        newListElem.innerHTML = `
                <div class="list-header">
                    <div class="list-caption" data-list-name="${listName}">
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

        if (!utils.isInit(position)) {
            const fakeListWrapperElem = document.querySelector(".fake-list").parentElement;
            listContainerElem.insertBefore(listWrapperElem, fakeListWrapperElem);
        } else {
            const siblingListWrapperElem = position.parentElement;
            siblingListWrapperElem.after(listWrapperElem);
        }
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

                const createCard = {
                    name: createCardDtoRaw.name,
                    description: "",
                    orderNumber: lastCardNumber + 1,
                    listId: listId
                };

                this.cardsService.createCard(this.currentBoardId, createCard,
                    (data) => {
                        this.addCardToList(listElem, {
                            cardId: data.cardId,
                            name: createCard.name,
                            orderNumber: createCard.orderNumber,
                            coverImagePath: "",
                            coverImageOrientation: "",
                            listId: ""
                        });
                        modalWindow.close();
                    },
                    (error) => {
                        console.error(error);
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
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "name", "Card name", "My card")
        ];

        modalWindow = new ModalWindow("Create new card", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }

    /**
     * @private
     * @param {HTMLElement} listElem
     * @param {any} card
     */
    addCardToList(listElem, card) {
        const listCardsElem = listElem.querySelector(".list-cards");

        const listCardElem = document.createElement("div");
        listCardElem.classList.add("animated", "fadeIn", "list-card");
        listCardElem.setAttribute("draggable", "true");
        listCardElem.setAttribute("data-card-id", card.id);
        listCardElem.setAttribute("data-order-number", card.orderNumber.toString());

        const coverPlaceholderElem = document.createElement("div");
        coverPlaceholderElem.classList.add("card-cover");
        if (card.coverImagePath) {
            coverPlaceholderElem.style.backgroundImage = `url(${ServerBaseUrl + card.coverImagePath})`;
            coverPlaceholderElem.style.display = "block";
            if (card.coverImageOrientation === ImageOrientation.vertical)
                coverPlaceholderElem.classList.add("vertical-orientation");
            else
                coverPlaceholderElem.classList.add("horizontal-orientation");
        }
        listCardElem.append(coverPlaceholderElem);

        const cardTitleElem = document.createElement("span");
        cardTitleElem.textContent = card.name;
        listCardElem.append(cardTitleElem);

        const cardMenuButtonElem = document.createElement("div");
        cardMenuButtonElem.classList.add("card-menu-button");
        cardMenuButtonElem.innerHTML = `<i class="fas fa-pen"></i>`;
        listCardElem.append(cardMenuButtonElem);

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

        if (lastCardElem)
            return parseInt(lastCardElem.getAttribute("data-order-number"));

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
        const renumberedCards = [];

        const listCardsElem = listElem.querySelector(":scope > .list-cards");
        listCardsElem.children.forEach((cardElem, idx) => {
            const cardId = cardElem.getAttribute("data-card-id");
            const orderNumber = idx + 1;
            renumberedCards.push({cardId, orderNumber});

            cardElem.setAttribute("data-order-number", orderNumber.toString());
        });

        this.cardsService.reorderCardsInList(this.currentBoardId, renumberedCards, () => {}, (error) => {
            console.error(error);
            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of updating list's order numbers. Reason: ${error}`);
        });
    }

    /**
     * @private
     */
    renumberAllLists() {
        const renumberedLists = [];

        const listsContainerElem = document.querySelector(".lists-container");
        const lists = listsContainerElem.querySelectorAll(".list:not(.fake-list)");
        lists.forEach((listElem, idx) => {
            const listId = listElem.getAttribute("data-list-id");
            const orderNumber = idx + 1;
            renumberedLists.push({listId, orderNumber: orderNumber});

            listElem.setAttribute("data-order-number", orderNumber.toString());
        });

        this.listsService.reorderLists(this.currentBoardId, renumberedLists, () => {}, (error) => {
            console.error(error);
            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of updating list's order numbers. Reason: ${error}`);
        });
    }
}
