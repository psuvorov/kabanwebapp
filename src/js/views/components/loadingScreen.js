

export class LoadingScreen {

    constructor() {

        /**
         * @private
         * @type {HTMLElement}
         */
        this.loadingScreeenElem = null;

        this.initialize();
    }

    show() {
        this.loadingScreeenElem.style.display = "block";
    }

    close() {
        this.loadingScreeenElem.style.display = "none";
    }

    /**
     * @private
     */
    initialize() {
        this.loadingScreeenElem = document.createElement("div");
        this.loadingScreeenElem.classList.add("loading-screen");

        document.body.append(this.loadingScreeenElem);
    }

}