import {LoadingScreen} from "./loadingScreen";

export class WindowMenu {

    /**
     *
     * @param {HTMLElement} callerElem
     */
    constructor(callerElem) {

        /**
         * @private
         * @readonly
         * @type {HTMLElement}
         */
        this.callerElem = callerElem;

        /**
         * @protected
         * @type {LoadingScreen}
         */
        //this.loadingScreen = new LoadingScreen();

        /**
         * @protected
         * @type {HTMLElement}
         */
        this.windowMenuElem = null;

        /** @private */
        this.CloseByEscapeEventHandler = null;
        /** @private */
        this.CloseByClickingOutsideEventHandler = null;

        // this.initialize();
        // this.setupInteractions();
    }

    /**
     * @protected
     */
    initialize() {
        this.closePreviouslyOpened();
        this.windowMenuElem = document.createElement("div");
        this.windowMenuElem.classList.add("window-menu");

        const pageContainerElem = document.querySelector('.page-container');
        pageContainerElem.append(this.windowMenuElem);

        this.CloseByEscapeEventHandler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.close();
            }
        };

        this.CloseByClickingOutsideEventHandler = (e) => {
            if (e.target && !e.target.closest(".window-menu") && !this.callerElem.contains(e.target))
                this.close();
        };

        // Close menu by Escape key
        document.addEventListener("keydown", this.CloseByEscapeEventHandler);

        // Close menu by clicking outside
        document.addEventListener("click", this.CloseByClickingOutsideEventHandler);
    }

    /**
     * @private
     */
    closePreviouslyOpened() {
        this.windowMenuElem = document.querySelector(".window-menu");
        if (this.windowMenuElem)
            this.close();
    }

    /**
     * @protected
     */
    setupInteractions() {

    }

    show() {
        this.windowMenuElem.classList.add("animated", "fadeIn");
        this.windowMenuElem.style.display = "flex";
    }

    close() {
        document.removeEventListener("keydown", this.CloseByEscapeEventHandler);
        document.removeEventListener("click", this.CloseByClickingOutsideEventHandler);

        this.windowMenuElem.style.display = "none";
        this.windowMenuElem.remove();
    }
}