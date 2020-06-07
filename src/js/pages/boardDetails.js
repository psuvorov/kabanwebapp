export class BoardDetails {

    /**
     *
     * @param {string} boardId
     * @param {KabanBoardService} kabanBoardService
     */
    constructor(boardId, kabanBoardService) {

        /**
         * @private
         * @type {HTMLElement}
         */
        this.boardDetailsWindowElem = null;

        /**
         * @private
         * @readonly
         * @type {string}
         */
        this.currentBoardId = boardId;

        /**
         * @private
         * @readonly
         * @type {KabanBoardService}
         */
        this.kabanBoardService = kabanBoardService;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }

    show() {
        this.boardDetailsWindowElem.classList.add("animated", "fadeIn");
        this.boardDetailsWindowElem.style.display = "block";
    }

    close() {
        this.boardDetailsWindowElem.style.display = "none";
        this.boardDetailsWindowElem.parentElement.remove(); // remove gray overlay as well

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
        this.boardDetailsWindowElem = document.createElement("div");
        this.boardDetailsWindowElem.classList.add("board-details-window");

        this.boardDetailsWindowElem.innerHTML = `
            
        `;

        const windowOverlayElem = document.createElement("div");
        windowOverlayElem.classList.add("window-overlay");
        windowOverlayElem.append(this.boardDetailsWindowElem);

        document.body.append(windowOverlayElem);
    }

    /**
     * @private
     */
    initElements() {




        this.keydownEventHandler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.close();
            }
        };
        document.addEventListener("keydown", this.keydownEventHandler);
    }



}