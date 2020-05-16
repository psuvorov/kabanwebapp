
export const DialogTypes = Object.freeze({
    Ok: "Ok",
    OkCancel: "OkCancel",
    YesNo: "YesNo",
    YesNoCancel: "YesNoCancel"
});

export const ModalWindowElementType = Object.freeze({
    Input: "Input",
    EmailInput: "EmailInput",
    PasswordInput: "PasswordInput",
    Label: "Label",
    Textarea: "Textarea"
});

export class ModalWindowElement {

    /**
     *
     * @param {ModalWindowElementType} elementType
     * @param {string} elementName
     * @param {string} elementLabel
     * @param {string} defaultValue
     */
    constructor(elementType, elementName, elementLabel, defaultValue) {
        /** @readonly */
        this.elementType = elementType;
        /** @readonly */
        this.elementName = elementName;
        /** @readonly */
        this.elementLabel = elementLabel;
        /** @readonly */
        this.defaultValue = defaultValue;
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
        this.initWindowElements();

        // --- Attach events ---
        this.modalWindowElem.querySelector(".close-button").addEventListener("click", () => this.dispose());
        this.initFooterButtons();
    }

    /**
     * @private
     */
    initWindowElements() {
        if (this.elements.length === 0)
            return;

        const mainAreaElem = this.modalWindowElem.querySelector(".modal-main-area");
        const formElem = document.createElement("form");
        formElem.setAttribute("name", "modal-form");
        formElem.setAttribute("method", "post");
        mainAreaElem.append(formElem);


        this.elements.forEach(modalWindowElement => {
            const elementWrapper = document.createElement("div");
            elementWrapper.classList.add("element-wrapper");

            if (modalWindowElement.elementType === ModalWindowElementType.Input) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><input type="text" name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}">`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementType.PasswordInput) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><input type="password" name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}">`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementType.Textarea) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><textarea rows="5" name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}"></textarea>`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementType.Label) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><input type="text" disabled name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}">`;
                formElem.append(elementWrapper);
            } else {
                throw new Error("Unknown Element Type.");
            }
        });
    }


    /**
     * @private
     */
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

        const infoAreaElem = document.createElement("div");
        infoAreaElem.classList.add("modal-info-area");
        infoAreaElem.append(document.createElement("div"));
        modalWindowElem.append(infoAreaElem);

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
        const formElem = this.modalWindowElem.querySelector("form");

        if (this.dialogType === DialogTypes.Ok && this.callbacks.length === 1) {
            const okButtonElem = this.createFooterButton("Ok");
            footerElem.append(okButtonElem);

            okButtonElem.addEventListener("click", () => {
                const formData = new FormData(formElem);
                console.log(formData);

                this.callbacks[0]();
                this.dispose();
            });


        } else if (this.dialogType === DialogTypes.OkCancel && this.callbacks.length === 2) {
            const okButtonElem = this.createFooterButton("Ok");
            const cancelButtonElem = this.createFooterButton("Cancel");
            footerElem.append(okButtonElem);
            footerElem.append(cancelButtonElem);

            okButtonElem.addEventListener("click", () => {
                const formData = new FormData(formElem);
                const json = JSON.stringify(Object.fromEntries(formData));

                const operationResultCallback = (data) => {
                    if (!data) {
                        this.dispose();
                        return;
                    }

                    if (data.error) {
                        this.setDialogErrorMessage(data.error);
                        //setTimeout(() => {this.dispose()}, 5000);
                    } else if (data.message) {
                        this.setDialogInformationMessage(data.message);
                        setTimeout(() => {this.dispose()}, 5000);
                    }
                    else {
                        this.dispose();
                    }
                };
                this.callbacks[0](json, operationResultCallback);

            });
            cancelButtonElem.addEventListener("click", () => {

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
            throw new Error("Unknown Dialog Type.");
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

    /**
     * @private
     * @param {string} message
     */
    setDialogErrorMessage(message) {
        const modalInfoElem = this.modalWindowElem.querySelector(".modal-info-area");
        const messagePlaceholder = modalInfoElem.querySelector("div");
        messagePlaceholder.innerHTML = `<span style="color: #a1180c">${message}</span>`;
        modalInfoElem.style.display = "block";
    }

    /**
     * @private
     * @param {string} message
     */
    setDialogInformationMessage(message) {
        const modalInfoElem = this.modalWindowElem.querySelector(".modal-info-area");
        const messagePlaceholder = modalInfoElem.querySelector("div");
        messagePlaceholder.innerHTML = `<span style="color: #175910">${message}</span>`;
        modalInfoElem.style.display = "block";
    }


    show() {
        this.modalWindowElem.classList.add("animated", "fadeIn");
        this.modalWindowElem.style.display = "flex";
    }

    /**
     * @private
     */
    dispose() {
        this.modalWindowElem.style.display = "none";
        this.modalWindowElem.remove();
    }





}

