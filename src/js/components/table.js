export class Table {



    constructor() {
        /**
         * @private
         * @type {HTMLElement}
         */
        this.tableElem = null;


        this.initialize();
    }

    /**
     * @private
     */
    initialize() {
        this.tableElem = document.createElement("div");
        this.tableElem.classList.add("table");
        this.tableElem.innerHTML = `
            
        `;

    }

    /**
     *
     * @return {HTMLElement}
     */
    getElement() {
        return this.tableElem;
    }



}