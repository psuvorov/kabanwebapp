
export const DialogTypes = Object.freeze({
    Ok: "Ok",
    OkCancel: "OkCancel",
    YesNo: "YesNo",
    YesNoCancel: "YesNoCancel"
});

export const ModalWindowElementType = Object.freeze({
    Input: "Input",
    PasswordInput: "PasswordInput",
    Textarea: "Textarea"
});

export class ModalWindowElement {

    /**
     *
     * @param {ModalWindowElementType} elementType
     * @param {string} elementName
     * @param {string} elementClass
     */
    constructor(elementType, elementName, elementClass) {
        this._elementType = elementType;
        this._elementName = elementName;
        this._elementClass = elementClass;
    }

    get elementType() {
        return this._elementType;
    }

    get elementName() {
        return this._elementName;
    }

    get elementClass() {
        return this._elementClass;
    }

}

export class ModalWindow {

    /**
     *
     * @param {string} title
     * @param {DialogTypes} dialogType
     * @param {function[]} callbacks
     * @param {ModalWindowElement[]} elements
     */
    constructor(title, dialogType, callbacks, elements) {
        this.title = title;
        this.dialogType = dialogType;
        this.callbacks = callbacks;
        this.elements = elements;

        this.initialize();
    }

    /**
     * @private
     */
    initialize() {
        this.initWindowUi();

        const mainAreaElem = this.modalWindowElem.querySelector(".modal-main-area");
        this.elements.forEach(modalWindowElement => {
            const elementWrapper = document.createElement("div");
            elementWrapper.classList.add("element-wrapper");

            if (modalWindowElement.elementType === ModalWindowElementType.Input) {
                elementWrapper.innerHTML = `<input type="text" name="${modalWindowElement.elementName}" class="${modalWindowElement.elementClass}">`;
                mainAreaElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementType.PasswordInput) {
                elementWrapper.innerHTML = `<input type="password" name="${modalWindowElement.elementName}" class="${modalWindowElement.elementClass}">`;
                mainAreaElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementType.Textarea) {
                elementWrapper.innerHTML = `<textarea rows="5" name="${modalWindowElement.elementName}" class="${modalWindowElement.elementClass}"></textarea>`;
                mainAreaElem.append(elementWrapper);
            } else {
                throw Error("Unknown Element Type.");
            }
        });

        // --- Attach events ---
        this.modalWindowElem.querySelector(".close-button").addEventListener("click", () => this.dispose());
        this.initFooterButtons();



    }

    initWindowUi() {
        const modalWindowElem = document.createElement("div");
        modalWindowElem.classList.add("modal-window");
        this.modalWindowElem = modalWindowElem;

        const titleElem = document.createElement("div");
        titleElem.classList.add("modal-title");
        titleElem.innerHTML = `<div class="title">${this.title}</div><div class="close-button"><span>x</span></div>`;
        modalWindowElem.append(titleElem);

        const mainAreaElem = document.createElement("div");
        mainAreaElem.classList.add("modal-main-area");
        modalWindowElem.append(mainAreaElem);

        const footerElem = document.createElement("div");
        footerElem.classList.add("modal-footer");
        modalWindowElem.append(footerElem);

        const pageContainerElem = document.querySelector('.page-container');
        pageContainerElem.append(modalWindowElem);

    }

    /**
     * @private
     */
    initFooterButtons() {
        const footerElem = this.modalWindowElem.querySelector(".modal-footer");

        if (this.dialogType === DialogTypes.Ok && this.callbacks.length === 1) {
            const okButtonElem = this.createFooterButton("Ok");
            footerElem.append(okButtonElem);

            okButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[0]();
                this.dispose();
            });


        } else if (this.dialogType === DialogTypes.OkCancel && this.callbacks.length === 2) {
            const okButtonElem = this.createFooterButton("Ok");
            const cancelButtonElem = this.createFooterButton("Cancel");
            footerElem.append(okButtonElem);
            footerElem.append(cancelButtonElem);

            okButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[0]();
                this.dispose();
            });
            cancelButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[1]();
                this.dispose();
            });

        } else if (this.dialogType === DialogTypes.YesNo && this.callbacks.length === 2) {
            const yesButtonElem = this.createFooterButton("Yes");
            const noButtonElem = this.createFooterButton("No");
            footerElem.append(yesButtonElem);
            footerElem.append(noButtonElem);

            yesButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[0]();
                this.dispose();
            });
            noButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[1]();
                this.dispose();
            });

        } else if (this.dialogType === DialogTypes.YesNoCancel && this.callbacks.length === 3) {
            const yesButtonElem = this.createFooterButton("Yes");
            const noButtonElem = this.createFooterButton("No");
            const cancelButtonElem = this.createFooterButton("Cancel");
            footerElem.append(yesButtonElem);
            footerElem.append(noButtonElem);
            footerElem.append(cancelButtonElem);

            yesButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[0]();
                this.dispose();
            });
            noButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[1]();
                this.dispose();
            });
            cancelButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[2]();
                this.dispose();
            });
        } else {
            throw Error("Unknown Dialog Type.");
        }
    }

    /**
     *
     * @param {string} buttonType
     * @return {HTMLElement}
     */
    createFooterButton(buttonType) {
        const buttonElem = document.createElement("div");
        buttonElem.classList.add("button", `${buttonType.toLowerCase()}-button`);
        buttonElem.innerHTML = `<span>${buttonType[0].toUpperCase() + buttonType.slice(1)}</span>`;

        return buttonElem;
    }




    show() {
        this.modalWindowElem.classList.add("animated", "fadeIn");
        this.modalWindowElem.style.display = "flex";
    }

    /**
     * @private
     */
    dispose() {
        this.modalWindowElem.remove();
    }





}

