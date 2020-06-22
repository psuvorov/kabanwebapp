import {Table} from "../components/table";
import {ModalWindowFactory} from "../components/modalWindow";
import {PopupMenu, PopupMenuItem, PopupMenuItemSeparator} from "../components/popupMenu";
import {CardsHelper} from "./helpers/CardsHelper";

export class ArchivedItems {

    /**
     *
     * @param currentBoardId
     * @param kabanBoardService
     */
    constructor(currentBoardId, kabanBoardService) {

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
                        console.log("Restore card");



                        popupMenu.close();
                    }),
                    new PopupMenuItem("Remove card",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let cardId = trElem.firstElementChild.textContent;

                        this.kabanBoardService.deleteCard(cardId,
                            () => {

                                popupMenu.close();
                            },
                            (error) => {
                                console.error(error);
                                popupMenu.close();
                                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of deleting archived card. Reason: ${error}`);
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
                        columnTitle: "List",

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