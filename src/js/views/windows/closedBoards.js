import {Table} from "../components/table";

export class ClosedBoards {

    constructor(kabanBoardService) {
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

        const pageContainerElem = document.querySelector(".page-container");
        pageContainerElem.append(this.closedBoardsWindowElem);
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

    }







}