import {Table} from "../components/table";
import {ModalWindowFactory} from "../components/modalWindow";
import {PopupMenu, PopupMenuItem, PopupMenuItemSeparator} from "../components/popupMenu";
import {CardsHelper} from "./helpers/CardsHelper";
import {UpdateCardDto} from "../dtos/cards";
import {UpdateListDto} from "../dtos/lists";

export class ArchivedItems {

    /**
     *
     * @param {string} currentBoardId
     * @param {KabanBoardService} kabanBoardService
     * @param {Function} drawBoardCb
     */
    constructor(currentBoardId, kabanBoardService, drawBoardCb) {

        /**
         * @private
         * @readonly
         * @type {string}
         */
        this.currentBoardId = currentBoardId;

        /**
         * @private
         * @readonly
         * @type {KabanBoardService}
         */
        this.kabanBoardService = kabanBoardService;

        /**
         * @private
         * @readonly
         * @type {Function}
         */
        this.drawBoardCb = drawBoardCb;

        /**
         * @private
         * @type {Table}
         */
        this.table = null;

        /**
         * @private
         * @type {HTMLElement}
         */
        this.archivedItemsWindowElem = null;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }

    show() {
        this.archivedItemsWindowElem.classList.add("animated", "fadeIn");
        this.archivedItemsWindowElem.style.display = "block";
    }

    close() {
        this.archivedItemsWindowElem.style.display = "none";

        let windowOverlayElem = this.archivedItemsWindowElem.parentElement;
        windowOverlayElem.firstElementChild.style.display = "block";

        document.removeEventListener("keydown", this.keydownEventHandler);
    }


    /**
     * @private
     */
    initialize() {
        this.initWindow();
        this.initElements();


        let archivedTypesElem = this.archivedItemsWindowElem.querySelector(".archived-types");
        archivedTypesElem.addEventListener("change", (e) => {
            this.loadData(archivedTypesElem.value);
        });
        this.loadData(archivedTypesElem.value);

    }

    /**
     * @private
     */
    initWindow() {
        this.archivedItemsWindowElem = document.createElement("div");
        this.archivedItemsWindowElem.classList.add("archived-items-window");
        this.archivedItemsWindowElem.innerHTML = `
            <div class="header">
                <div class="info-area">
                    You are browsing archived 
                    <select class="archived-types">
                        <option value="cards">Cards</option>
                        <option value="lists">Lists</option>
                    </select>
                </div>
                <div class="close-button"><i class="fas fa-times"></i></div>            
            </div>
            <div class="main-area"></div>`;

        this.table = new Table();

        this.archivedItemsWindowElem.querySelector(".main-area").append(this.table.getElement());

        let windowOverlayElem = document.querySelector(".window-overlay");
        windowOverlayElem.lastElementChild.style.display = "none";
        windowOverlayElem.append(this.archivedItemsWindowElem);
    }

    /**
     * @private
     */
    initElements() {
        const closeButtonElem = this.archivedItemsWindowElem.querySelector(".close-button");
        closeButtonElem.addEventListener("click", (e) => {
            this.close();
        });

        this.keydownEventHandler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.close();
            }
        };
        document.addEventListener("keydown", this.keydownEventHandler);
    }

    /**
     * @private
     * @param {string} archivedItemType
     */
    loadData(archivedItemType) {
        if (archivedItemType === "cards")
            this.loadArchivedCards();
        else
            this.loadArchivedLists();
    }

    /**
     * @private
     */
    loadArchivedCards() {
        this.kabanBoardService.getArchivedCards(this.currentBoardId,
            (cards) => {
                console.log(cards);

                /** @type PopupMenu */
                let popupMenu = null;

                const items = [
                    new PopupMenuItem("Restore card",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let cardId = trElem.firstElementChild.textContent;

                        popupMenu.close();
                        ModalWindowFactory.showYesNoQuestion("Restore card", "Do you want to restore this card?",
                            () => {

                                const updateCardDto = new UpdateCardDto(cardId, null, null, null, null, false);
                                this.kabanBoardService.updateCard(updateCardDto,
                                    () => {
                                        trElem.remove();

                                        // TODO: not decent at all, needs to be remade
                                        this.drawBoardCb();
                                    },
                                    (error) => {
                                        console.error(error);
                                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of restoring archived card. Reason: ${error}`);
                                    });
                            },
                            () => {
                            });

                    }),
                    new PopupMenuItem("Remove card",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let cardId = trElem.firstElementChild.textContent;

                        popupMenu.close();
                        ModalWindowFactory.showYesNoQuestion("Remove card", "Do you want to remove this card?",
                            () => {
                                this.kabanBoardService.deleteCard(cardId,
                                    () => {
                                        trElem.remove();
                                    },
                                    (error) => {
                                        console.error(error);
                                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of deleting archived card. Reason: ${error}`);
                                    });
                            },
                            () => {
                            });
                    })
                ];

                popupMenu = new PopupMenu(items, this.table.getElement());

                const columns = [
                    {
                        columnName: "id",
                        columnTitle: "Id",
                        hidden: true
                    },
                    {
                        columnName: "name",
                        columnTitle: "Card",
                        width: "40%"
                    },
                    {
                        columnName: "listName",
                        columnTitle: "List"
                    },
                    {
                        columnName: "created",
                        columnTitle: "Created",
                        type: "date"
                    },
                    {
                        columnName: "archived",
                        columnTitle: "Archived",
                        type: "date"
                    },
                    {
                        columnTitle: "Actions",
                        type: "popupMenu",
                        popupMenuInstance: popupMenu
                    }
                ];

                this.table.setDatasource(columns, cards);
            },
            (error) => {
                console.error(error);
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting archived cards. Reason: ${error}`);
            });

    }

    /**
     * @private
     */
    loadArchivedLists() {
        this.kabanBoardService.getArchivedLists(this.currentBoardId,
            (lists) => {
                console.log(lists);

                /** @type PopupMenu */
                let popupMenu = null;

                const items = [
                    new PopupMenuItem("Restore list",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let listId = trElem.firstElementChild.textContent;

                        popupMenu.close();
                        ModalWindowFactory.showYesNoQuestion("Restore list", "Do you want to restore this list?",
                            () => {
                                const updateListDto = new UpdateListDto(listId, null, null, false);
                                this.kabanBoardService.updateList(updateListDto,
                                    () => {
                                        trElem.remove();

                                        // TODO: not decent at all, needs to be remade
                                        this.drawBoardCb();
                                    },
                                    (error) => {
                                        console.error(error);
                                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of restoring archived list. Reason: ${error}`);
                                    });
                            },
                            () => {
                            });

                    }),
                    new PopupMenuItem("Remove list",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let listId = trElem.firstElementChild.textContent;

                        popupMenu.close();
                        ModalWindowFactory.showYesNoQuestion("Remove list", "Do you want to remove this list?",
                            () => {
                                this.kabanBoardService.deleteList(listId,
                                    () => {
                                        trElem.remove();
                                    },
                                    (error) => {
                                        console.error(error);
                                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of deleting archived list. Reason: ${error}`);
                                    });
                            },
                            () => {
                            });
                    })
                ];

                popupMenu = new PopupMenu(items, this.table.getElement());

                const columns = [
                    {
                        columnName: "id",
                        columnTitle: "Id",
                        hidden: true
                    },
                    {
                        columnName: "name",
                        columnTitle: "List",
                        width: "40%"
                    },
                    {
                        columnName: "created",
                        columnTitle: "Created",
                        type: "date"
                    },
                    {
                        columnName: "archived",
                        columnTitle: "Archived",
                        type: "date"
                    },
                    {
                        columnTitle: "Actions",
                        type: "popupMenu",
                        popupMenuInstance: popupMenu
                    }
                ];

                this.table.setDatasource(columns, lists);
            },
            (error) => {
                console.error(error);
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting archived lists. Reason: ${error}`);
            });
    }





}