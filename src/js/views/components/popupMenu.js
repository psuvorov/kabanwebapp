export class PopupMenuItem {

    constructor(title, actionCb) {
        /** @readonly */
        this.title = title;
        /** @readonly */
        this.actionCb = actionCb;
    }
}

export class PopupMenuItemSeparator {

}


export class PopupMenu {

    /**
     *
     * @param {[PopupMenuItem, PopupMenuItemSeparator]} items
     * @param {HTMLElement} callerElem
     */
    constructor(items, callerElem) {
        if (items.length === 0)
            throw new Error("Popup menu should contains at least one item");

        /**
         * @private
         * @readonly
         * @type {[PopupMenuItem, PopupMenuItemSeparator]}
         */
        this.items = items;

        /**
         * @private
         * @readonly
         * @type {HTMLElement}
         */
        this.callerElem = callerElem;

        /**
         * @private
         * @type {HTMLElement}
         */
        this.popupMenuElem = null;

        /** @private */
        this.CloseByEscapeEventHandler = null;
        /** @private */
        this.CloseByClickingOutsideEventHandler = null;

        this.initialize();
    }

    show() {
        this.CloseByEscapeEventHandler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.close();
            }
        };

        this.CloseByClickingOutsideEventHandler = (e) => {
            if (e.target && !e.target.closest(".popup-menu") && !this.callerElem.contains(e.target))
                this.close();
        };

        // Close menu by Escape key
        document.addEventListener("keydown", this.CloseByEscapeEventHandler);

        // Close menu by clicking outside
        document.addEventListener("click", this.CloseByClickingOutsideEventHandler);


        // ! This code doesn't detect right popup menu placement
        this.popupMenuElem.style.left = this.callerElem.getBoundingClientRect().x + this.callerElem.getBoundingClientRect().width / 2 +  "px";
        this.popupMenuElem.style.top = this.callerElem.getBoundingClientRect().y + this.callerElem.getBoundingClientRect().height / 2 + "px";

        this.popupMenuElem.classList.add("animated", "fadeIn");
        this.popupMenuElem.style.display = "flex";
    }


    close() {
        this.popupMenuElem.style.display = "none";

        document.removeEventListener("keydown", this.CloseByEscapeEventHandler);
        document.removeEventListener("click", this.CloseByClickingOutsideEventHandler);

        console.log("PopupMenu closed");
    }

    /**
     * @private
     */
    initialize() {
        this.initMenu();
    }

    /**
     * @private
     */
    initMenu() {
        this.popupMenuElem = document.createElement("div");
        this.popupMenuElem.classList.add("popup-menu");

        this.items.forEach(item => {
            if (item instanceof PopupMenuItem) {
                const menuItemElem = document.createElement("div");
                menuItemElem.classList.add("menu-item");
                menuItemElem.innerHTML = `<span>${item.title}</span>`;
                menuItemElem.addEventListener("click", (e) => {item.actionCb()});
                this.popupMenuElem.append(menuItemElem);
            } else if (item instanceof PopupMenuItemSeparator) {
                const menuSeparatorElem = document.createElement("hr");
                this.popupMenuElem.append(menuSeparatorElem);
            }
        });

        const pageContainerElem = document.querySelector('.page-container');
        pageContainerElem.append(this.popupMenuElem);
    }


    /**
     *
     * @param {HTMLElement} callerElem
     */
    setCaller(callerElem) {
        this.callerElem = callerElem;
    }

    /**
     *
     * @return {HTMLElement}
     */
    getCaller() {
        return this.callerElem;
    }
}