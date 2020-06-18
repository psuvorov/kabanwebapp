export class Table {


    /**
     *
     * @param {string} title
     */
    constructor(title) {
        /**
         * @private
         * @readonly
         * @type {string}
         */
        this.title = title;

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

    }

    getElement() {
        return this.tableElem;
    }



}