import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";
import {ServerBaseUrl} from "../../constants";
import {ArchivedItems} from "./archivedItems";

export class BoardDetails {

    /**
     *
     * @param {string} boardId
     * @param {any} boardDetails
     * @param {BoardsService} boardsService
     * @param {ListsService} listsService
     * @param {CardsService} cardsService
     * @param {Function} drawBoardCb
     */
    constructor(boardId, boardDetails, boardsService, listsService, cardsService, drawBoardCb) {

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
         * @type {any}
         */
        this.boardDetails = boardDetails;

        /**
         * @private
         * @readonly
         * @type {BoardsService}
         */
        this.boardsService = boardsService;

        /**
         * @private
         * @readonly
         * @type {ListsService}
         */
        this.listsService = listsService;

        /**
         * @private
         * @readonly
         * @type {CardsService}
         */
        this.cardsService = cardsService;

        /**
         * @private
         * @readonly
         * @type {Function}
         */
        this.drawBoardCb = drawBoardCb;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }

    show() {
        this.boardDetailsWindowElem.classList.add("animated", "fadeIn");
        this.boardDetailsWindowElem.style.display = "flex";
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
        this.boardDetailsWindowElem.classList.add("base-window", "board-details-window");

        this.boardDetailsWindowElem.innerHTML = `
            <div class="left-area">
                <div class="section">
                    <div class="icon-area">
                        <div class="icon"><i class="fas fa-user"></i></div>
                    </div>
                    <div class="content-area">
                        <div class="caption">Author info</div>
                        <div class="content">
                            <div class="avatar"></div>
                            <div class="title">${this.boardDetails.author.firstName} ${this.boardDetails.author.lastName}</div>
                            <div class="username">@${this.boardDetails.author.username}</div>      
                            <div class="email">Available by <a class="link highlight" href="mailto:${this.boardDetails.author.email}">${this.boardDetails.author.email}</a></div>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="icon-area">
                        <div class="icon"><i class="far fa-file-alt"></i></div>
                    </div>
                    <div class="content-area">
                        <div class="caption">Board description</div>
                        <div class="content">
                            <div class="board-description">${this.boardDetails.description}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-area">
                <div class="close-button"><i class="fas fa-times"></i></div>
                <div class="actions">
                    <div class="button edit-description"><i class="fas fa-file-alt"></i><span>Edit descriptions</span></div>
                    <div class="button board-participants"><i class="fas fa-user-tie"></i><span>Board participants</span></div>
                    <div class="button board-wallpaper"><i class="far fa-image"></i><span>Board wallpaper</span></div>
                    <input id="board-wallpaper-file-input" type="file" name="board-wallpaper" style="display: none;" />
                    <div class="button archived-items"><i class="fas fa-archive"></i><span>Archived items</span></div>
                    <div class="button close-board"><i class="far fa-window-close"></i><span>Close board</span></div>
                </div>
            </div>
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
        const closeButtonElem = this.boardDetailsWindowElem.querySelector(".close-button");
        closeButtonElem.addEventListener("click", (e) => {
            this.close();
        });

        const editDescriptionButtonElem = this.boardDetailsWindowElem.querySelector(".actions .edit-description");
        editDescriptionButtonElem.addEventListener("click", (e) => {

            /** @type ModalWindow */
            let modalWindow = null;

            const callbacks = [
                /**
                 * @param {string} serializedFormData
                 */
                    (serializedFormData) => {
                    // Ok pressed

                    const newDescriptionRaw = JSON.parse(serializedFormData).description; // to be set to html right now
                    const newDescription = newDescriptionRaw.replace(/\r?\n/g, "<br />"); // server version with <br /> tags

                    this.boardsService.updateBoardInfo(this.currentBoardId, {boardId: this.boardDetails.id, description: newDescription},
                        () => {
                            this.boardDetails.description = newDescription;
                            this.boardDetailsWindowElem.querySelector(".board-description").innerText = newDescriptionRaw;

                            modalWindow.close();
                        },
                        (error) => {
                            console.error(error);
                            modalWindow.close();
                            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of editing board description. Reason: ${error}`);
                        });
                },
                () => {
                    // Cancel pressed
                    modalWindow.close();
                }
            ];

            const windowElements = [
                ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Textarea, "description", "Board description",
                    this.boardDetails.description.replace(/<br \/>/g, "\r\n"))
            ];

            modalWindow = new ModalWindow("Edit board description", DialogTypes.OkCancel, callbacks, windowElements);
            modalWindow.show();
        });

        const participantsButtonElem = this.boardDetailsWindowElem.querySelector(".actions .board-participants");
        participantsButtonElem.addEventListener("click", (e) => {
            console.log("Participants button clicked");
        });

        const boardWallpaperButtonElem = this.boardDetailsWindowElem.querySelector(".actions .board-wallpaper");
        const boardWallpaperInputElem = document.querySelector("#board-wallpaper-file-input");
        boardWallpaperButtonElem.addEventListener("click", (e) => {
            boardWallpaperInputElem.click();
        });

        boardWallpaperInputElem.addEventListener("change", (e) => {
            const formData = new FormData();
            const fileExtensionWithDot = boardWallpaperInputElem.files[0].name.substring(boardWallpaperInputElem.files[0].name.lastIndexOf("."));
            formData.append("imageFile", boardWallpaperInputElem.files[0], "board-" + this.currentBoardId + fileExtensionWithDot);

            this.boardsService.setBoardWallpaper(this.currentBoardId, formData,
                (res) => {
                    const pageContainerElem = document.querySelector(".page-container");
                    pageContainerElem.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${ServerBaseUrl + res.wallpaperPath})`;
                    pageContainerElem.style.display = "block";

                },
                (error) => {
                    console.error(error);
                    ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of setting board wallpaper. Reason: ${error}`);
                });
        });

        const archivedItemsButtonElem = this.boardDetailsWindowElem.querySelector(".actions .archived-items");
        archivedItemsButtonElem.addEventListener("click", (e) => {
            const archivedItems = new ArchivedItems(this.currentBoardId, this.listsService, this.cardsService, this.drawBoardCb);
            archivedItems.show();
        });

        const closeBoardButtonElem = this.boardDetailsWindowElem.querySelector(".actions .close-board");
        closeBoardButtonElem.addEventListener("click", (e) => {

            ModalWindowFactory.showYesNoQuestion("Close board", "Do you want to close this board?",
                () => {
                    this.boardsService.updateBoardInfo(this.currentBoardId, {boardId: this.currentBoardId, isClosed: true},
                        () => {
                            location.href = "/dashboard.html";
                        },
                        (error) => {
                            console.error(error);
                            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of closing board. Reason: ${error}`);
                        });
                });
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