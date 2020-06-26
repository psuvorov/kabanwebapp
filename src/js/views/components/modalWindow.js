
export const DialogTypes = Object.freeze({
    Ok: "Ok",
    OkCancel: "OkCancel",
    YesNo: "YesNo",
    YesNoCancel: "YesNoCancel",
    Empty: "Empty"
});

export const ModalWindowElementTypes = Object.freeze({
    Input: "Input",
    EmailInput: "EmailInput",
    PasswordInput: "PasswordInput",
    Label: "Label",
    Textarea: "Textarea",
    TextareaLabel: "TextareaLabel",
    DropdownList: "DropdownList",
    Table: "Table"
});

export class ModalWindowElement {

    /**
     *
     * @param {ModalWindowElementTypes} elementType
     * @param {string} elementName
     * @param {string} elementLabel
     * @param {string} defaultValue
     * @return {ModalWindowElement}
     */
    static initPrimitiveElement(elementType, elementName, elementLabel, defaultValue) {
        if (![ModalWindowElementTypes.Input, ModalWindowElementTypes.EmailInput, ModalWindowElementTypes.PasswordInput,
            ModalWindowElementTypes.Label, ModalWindowElementTypes.Textarea, ModalWindowElementTypes.TextareaLabel]
            .includes(elementType.toString())
        )
            throw new Error(`${elementType} is not a primitive element.`);

        const element = new ModalWindowElement();
        element.elementType = elementType;
        element.elementName = elementName;
        element.elementLabel = elementLabel;
        element.defaultValue = defaultValue;

        return element;
    }

    /**
     * @param {string} elementName
     * @param {string} elementLabel
     * @param {string[][]} values
     * @return {ModalWindowElement}
     */
    static initDropDownList(elementName, elementLabel, values) {

        const element = new ModalWindowElement();
        element.elementType = ModalWindowElementTypes.DropdownList;
        element.elementName = elementName;
        element.elementLabel = elementLabel;
        element.values = values;

        return element;
    }

    /**
     *
     * @param {string} elementName
     * @param {string} elementLabel
     * @param {HTMLElement} tableElement
     * @return {ModalWindowElement}
     */
    static initTable(elementName, elementLabel, tableElement) {
        const element = new ModalWindowElement();
        element.elementType = ModalWindowElementTypes.Table;
        element.elementName = elementName;
        element.elementLabel = elementLabel;
        element.tableElement = tableElement;

        return element;
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
        /**
         * @private
         * @readonly
         * @type {string}
         */
        this.title = title;

        /**
         * @private
         * @readonly
         * @type {DialogTypes}
         */
        this.dialogType = dialogType;

        /**
         * @private
         * @readonly
         * @type {Function[]}
         */
        this.callbacks = callbacks;

        /**
         * @private
         * @readonly
         * @type {ModalWindowElement[]}
         */
        this.elements = elements;

        /**
         * @private
         * @type {HTMLElement}
         */
        this.modalWindowElem = null;



        /** @private */
        this.mouseupEventHandler = null;

        /** @private */
        this.mousemoveEventHandler = null;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }

    show() {
        this.modalWindowElem.classList.add("animated", "fadeIn");
        this.modalWindowElem.style.display = "flex";

        const formElem = this.modalWindowElem.querySelector("form");
        if (this.elements.length > 0 && formElem.children[0].children[1].focus) {
            formElem.children[0].children[1].focus();
        }
    }

    close() {
        this.modalWindowElem.style.display = "none";
        this.modalWindowElem.remove();

        document.removeEventListener("mouseup", this.mouseupEventHandler);
        document.removeEventListener("mousemove", this.mousemoveEventHandler);
        document.removeEventListener("keydown", this.keydownEventHandler);
    }

    /**
     * @private
     */
    initialize() {
        this.initWindow();
        this.initElements();

        // --- Attach events ---
        this.modalWindowElem.querySelector(".close-button").addEventListener("click", () => this.close());

        let movingWindowPositionOffset = [0, 0];
        let isMouseButtonDown = false;

        const windowTitleElem = this.modalWindowElem.querySelector(".title");
        windowTitleElem.addEventListener("mousedown", (e) => {
            isMouseButtonDown = true;
            movingWindowPositionOffset = [this.modalWindowElem.offsetLeft - e.clientX, this.modalWindowElem.offsetTop - e.clientY];
        });

        this.mouseupEventHandler = (e) => {
            isMouseButtonDown = false;
        };
        document.addEventListener("mouseup", this.mouseupEventHandler);

        this.mousemoveEventHandler = (e) => {
            if (isMouseButtonDown) {
                this.modalWindowElem.style.left = (e.clientX + movingWindowPositionOffset[0]) + "px";
                this.modalWindowElem.style.top = (e.clientY + movingWindowPositionOffset[1]) + "px";
            }

        };
        document.addEventListener("mousemove", this.mousemoveEventHandler);


        this.keydownEventHandler = (e) => {
            if (e.key === "Enter" && this.elements.some(element => element.elementType !== ModalWindowElementTypes.Textarea)) {
                // Disable closing the window if there is a textarea element to allow line break

                e.preventDefault();

                /** @type HTMLElement */
                let buttonElem = null;

                if (this.dialogType === DialogTypes.Ok || this.dialogType === DialogTypes.OkCancel) {
                    buttonElem = this.modalWindowElem.querySelector(".ok-button");
                } else if (this.dialogType === DialogTypes.YesNo || this.dialogType === DialogTypes.YesNoCancel) {
                    buttonElem = this.modalWindowElem.querySelector(".yes-button");
                }
                if (buttonElem)
                    buttonElem.dispatchEvent(new Event("click"));

            } else if (e.key === "Escape") {
                e.preventDefault();

                /** @type HTMLElement */
                let buttonElem = null;

                if (this.dialogType === DialogTypes.Ok || this.dialogType === DialogTypes.Empty) {
                    this.close();
                } else if (this.dialogType === DialogTypes.OkCancel) {
                    buttonElem = this.modalWindowElem.querySelector(".cancel-button");
                } else if (this.dialogType === DialogTypes.YesNo) {
                    buttonElem = this.modalWindowElem.querySelector(".no-button");
                } else if (this.dialogType === DialogTypes.YesNoCancel) {
                    buttonElem = this.modalWindowElem.querySelector(".cancel-button");
                }
                if (buttonElem)
                    buttonElem.dispatchEvent(new Event("click"));
            }
        };
        document.addEventListener("keydown", this.keydownEventHandler);

        this.initFooterButtons();
    }

    /**
     * @private
     */
    initElements() {
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

            if (modalWindowElement.elementType === ModalWindowElementTypes.Input) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><input type="text" name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}">`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementTypes.PasswordInput) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><input type="password" name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}">`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementTypes.Textarea) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><textarea rows="5" name="${modalWindowElement.elementName}" >${modalWindowElement.defaultValue}</textarea>`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementTypes.TextareaLabel) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><textarea rows="5" name="${modalWindowElement.elementName}" readonly >${modalWindowElement.defaultValue}</textarea>`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementTypes.Label) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><input type="text" readonly name="${modalWindowElement.elementName}" value="${modalWindowElement.defaultValue}">`;
                formElem.append(elementWrapper);
            } else if (modalWindowElement.elementType === ModalWindowElementTypes.DropdownList) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label><br />`;

                const selectElem = document.createElement("select");
                selectElem.setAttribute("name", modalWindowElement.elementName);
                for (let i = 0; i < modalWindowElement.values.length; i++) {
                    const optionElem = document.createElement("option");
                    optionElem.setAttribute("value", modalWindowElement.values[i][0]);
                    optionElem.innerText = modalWindowElement.values[i][1];
                    selectElem.append(optionElem);
                }
                elementWrapper.append(selectElem);
                formElem.append(elementWrapper);

            } else if (modalWindowElement.elementType === ModalWindowElementTypes.Table) {
                elementWrapper.innerHTML = `<label for="${modalWindowElement.elementName}">${modalWindowElement.elementLabel}</label>`;
                elementWrapper.append(modalWindowElement.tableElement);
                formElem.append(elementWrapper);
            } else {
                throw new Error("Unknown Element Type");
            }
        });
    }


    /**
     * @private
     */
    initWindow() {
        const modalWindowElem = document.createElement("div");
        modalWindowElem.classList.add("modal-window");
        this.modalWindowElem = modalWindowElem;

        const titleElem = document.createElement("div");
        titleElem.classList.add("modal-title");
        titleElem.innerHTML = `<div class="title">${this.title}</div><div class="close-button"><i class="fas fa-times"></i></div>`;
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
        const formElem = this.modalWindowElem.querySelector("form");

        if (this.dialogType === DialogTypes.Ok && this.callbacks.length === 1) {
            const okButtonElem = this.createFooterButton("Ok");
            footerElem.append(okButtonElem);

            okButtonElem.addEventListener("click", () => {
                const formData = new FormData(formElem);
                const serializedFormData = JSON.stringify(Object.fromEntries(formData));
                this.callbacks[0](serializedFormData);
            });


        } else if (this.dialogType === DialogTypes.OkCancel && this.callbacks.length === 2) {
            const okButtonElem = this.createFooterButton("Ok");
            const cancelButtonElem = this.createFooterButton("Cancel");
            footerElem.append(okButtonElem);
            footerElem.append(cancelButtonElem);

            okButtonElem.addEventListener("click", () => {
                const formData = new FormData(formElem);
                const serializedFormData = JSON.stringify(Object.fromEntries(formData));
                this.callbacks[0](serializedFormData);
            });

            cancelButtonElem.addEventListener("click", () => {
                this.callbacks[1]();
            });

        } else if (this.dialogType === DialogTypes.YesNo && this.callbacks.length === 2) {
            const yesButtonElem = this.createFooterButton("Yes");
            const noButtonElem = this.createFooterButton("No");
            footerElem.append(yesButtonElem);
            footerElem.append(noButtonElem);

            yesButtonElem.addEventListener("click", () => {
                const formData = new FormData(formElem);
                const serializedFormData = JSON.stringify(Object.fromEntries(formData));
                this.callbacks[0](serializedFormData);
            });
            noButtonElem.addEventListener("click", () => {
                this.callbacks[1]();
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
                this.close();
            });
            noButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[1]();
                this.close();
            });
            cancelButtonElem.addEventListener("click", () => {
                // TODO: gather data from fields
                this.callbacks[2]();
                this.close();
            });
        } else if (this.dialogType === DialogTypes.Empty) {
            // Nothing to add
            footerElem.style.display = "none";
        } else {
            throw new Error("Unknown Dialog Type.");
        }
    }

    /**
     * @private
     * @param {string} buttonType
     * @return {HTMLElement}
     */
    createFooterButton(buttonType) {
        const buttonElem = document.createElement("div");
        buttonElem.classList.add("button", `${buttonType.toLowerCase()}-button`);
        buttonElem.innerHTML = `<span>${buttonType[0].toUpperCase() + buttonType.slice(1)}</span>`;

        return buttonElem;
    }

}

export class ModalWindowFactory {

    /**
     *
     * @param {string} title
     * @param {string} text
     * @param [okCallback]
     */
    static showErrorOkMessage(title, text, okCallback) {
        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [];
        callbacks.push(okCallback ? okCallback : () => {modalWindow.close();});

        const windowElements = [
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.TextareaLabel, "label", "Error", text),
        ];

        modalWindow = new ModalWindow(title, DialogTypes.Ok, callbacks, windowElements);
        modalWindow.show();
    }

    /**
     *
     * @param {string} title
     * @param {string} text
     * @param [okCallback]
     */
    static showInfoOkMessage(title, text, okCallback) {
        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [];
        callbacks.push(okCallback ? okCallback : () => {modalWindow.close();});

        const windowElements = [
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.TextareaLabel, "label", "Information", text),
        ];

        modalWindow = new ModalWindow(title, DialogTypes.Ok, callbacks, windowElements);
        modalWindow.show();
    }

    /**
     *
     * @param {string} title
     * @param {string} text
     * @param [yesCallback]
     * @param [noCallback]
     */
    static showYesNoQuestion(title, text, yesCallback, noCallback) {
        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [];
        callbacks.push(yesCallback ? () => { yesCallback(); modalWindow.close(); } : () => {modalWindow.close();});
        callbacks.push(noCallback ? () => { noCallback(); modalWindow.close(); } : () => {modalWindow.close();});

        const windowElements = [
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.TextareaLabel, "label", "Question", text),
        ];

        modalWindow = new ModalWindow(title, DialogTypes.YesNo, callbacks, windowElements);
        modalWindow.show();
    }

}

