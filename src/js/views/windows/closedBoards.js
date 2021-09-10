import {Table} from "../components/table";
import {ModalWindowFactory} from "../components/modalWindow";
import {PopupMenu, PopupMenuItem} from "../components/popupMenu";

export class ClosedBoards {

    constructor(dashboardsService, boardsService, refreshCallbacks) {
        /**
         * @private
         * @readonly
         * @type {DashboardsService}
         */
        this.dashboardsService = dashboardsService;

        /**
         * @private
         * @readonly
         * @type {BoardsService}
         */
        this.boardsService = boardsService;

        /**
         * @private
         * @readonly
         * @type {Array}
         */
        this.refreshCallbacks = refreshCallbacks;

        /**
         * @private
         * @type {Table}
         */
        this.table = null;

        /**
         * @private
         * @type {HTMLElement}
         */
        this.closedBoardsWindowElem = null;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }

    show() {
        this.closedBoardsWindowElem.classList.add("animated", "fadeIn");
        this.closedBoardsWindowElem.style.display = "block";
    }

    close() {
        this.closedBoardsWindowElem.style.display = "none";
        this.closedBoardsWindowElem.parentElement.remove(); // remove gray overlay as well

        document.removeEventListener("keydown", this.keydownEventHandler);
    }

    /**
     * @private
     */
    initialize() {
        this.initWindow();
        this.initElements();

        this.loadData();
    }

    /**
     * @private
     */
    initWindow() {
        this.closedBoardsWindowElem = document.createElement("div");
        this.closedBoardsWindowElem.classList.add("closed-boards-window");
        this.closedBoardsWindowElem.innerHTML = `
            <div class="header">
                <div class="info-area">
                    Your closed boards: 
                </div>
                <div class="close-button"><i class="fas fa-times"></i></div>            
            </div>
            <div class="main-area"></div>`;

        this.table = new Table();

        this.closedBoardsWindowElem.querySelector(".main-area").append(this.table.getElement());

        const windowOverlayElem = document.createElement("div");
        windowOverlayElem.classList.add("window-overlay");
        windowOverlayElem.append(this.closedBoardsWindowElem);

        document.body.append(windowOverlayElem);
    }

    /**
     * @private
     */
    initElements() {
        const closeButtonElem = this.closedBoardsWindowElem.querySelector(".close-button");
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
     */
    loadData() {
        this.dashboardsService.getClosedUserBoards(
            (boards) => {
                console.log(boards);

                /** @type PopupMenu */
                let popupMenu = null;

                const menuItems = [
                    new PopupMenuItem("Restore board",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let boardId = trElem.firstElementChild.textContent;

                        popupMenu.close();
                        ModalWindowFactory.showYesNoQuestion("Restore board", "Do you want to restore this board?",
                            () => {

                                this.boardsService.updateBoardInfo(boardId, {id: boardId, isClosed: false},
                                    () => {
                                        trElem.remove();

                                        this.refreshCallbacks.forEach(cb => cb());
                                    },
                                    (error) => {
                                        console.error(error);
                                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of restoring closed board. Reason: ${error}`);
                                    });
                            },
                            () => {
                            });
                    }),
                    new PopupMenuItem("Remove board",() => {
                        const trElem = popupMenu.getCaller().parentElement.parentElement;
                        let boardId = trElem.firstElementChild.textContent;

                        popupMenu.close();
                        ModalWindowFactory.showYesNoQuestion("Remove board", "Do you want to remove this board?",
                            () => {
                                this.boardsService.deleteBoard(boardId,
                                    () => {
                                        trElem.remove();
                                    },
                                    (error) => {
                                        console.error(error);
                                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of deleting closed board. Reason: ${error}`);
                                    });
                            },
                            () => {
                            });
                    })
                ];

                popupMenu = new PopupMenu(menuItems, this.table.getElement());

                const columns = [
                    {
                        columnName: "id",
                        columnTitle: "Id",
                        hidden: true
                    },
                    {
                        columnName: "name",
                        columnTitle: "Board",
                        width: "40%"
                    },
                    {
                        columnName: "description",
                        columnTitle: "Description",
                        width: "50%"
                    },
                    {
                        columnTitle: "Actions",
                        type: "popupMenu",
                        popupMenuInstance: popupMenu
                    }
                ];

                this.table.setDatasource(columns, boards);
            },
            (error) => {
                console.error(error);
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting closed boards. Reason: ${error}`);
            });
    }
}