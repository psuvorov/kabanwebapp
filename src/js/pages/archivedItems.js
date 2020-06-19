import {Table} from "../components/table";

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

        const table = new Table();
        const tableElem = table.getElement();

        this.archivedItemsWindowElem.querySelector(".main-area").append(tableElem);

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







}