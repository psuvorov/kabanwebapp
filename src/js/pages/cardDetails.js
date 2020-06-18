import {CardDetailsDto, UpdateCardDto} from "../dtos/cards";
import utils from "../utils";
import {CreateBoardDto, UpdateBoardDto} from "../dtos/boards";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";
import {ImageOrientation, ServerBaseUrl} from "../constants";
import {CardsHelper} from "./helpers/CardsHelper";

export class CardDetails {

    /**
     *
     * @param {string} currentBoardId
     * @param {CardDetailsDto} cardDetails
     * @param {KabanBoardService} kabanBoardService
     * @param {FilesService} filesService
     * @param {HTMLElement} cardElem
     */
    constructor(currentBoardId, cardDetails, kabanBoardService, filesService, cardElem) {

        /**
         * @private
         * @readonly
         * @type {string}
         */
        this.currentBoardId = currentBoardId;

        /**
         * @private
         * @type {HTMLElement}
         */
        this.cardDetailsWindowElem = null;

        /**
         * @private
         * @readonly
         * @type {CardDetailsDto}
         */
        this.cardDetails = cardDetails;

        /**
         * @private
         * @readonly
         * @type {HTMLElement}
         */
        this.cardElem = cardElem;

        /**
         * @private
         * @readonly
         * @type {KabanBoardService}
         */
        this.kabanBoardService = kabanBoardService;

        /**
         * @private
         * @readonly
         * @type {FilesService}
         */
        this.filesService = filesService;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }

    show() {
        this.cardDetailsWindowElem.classList.add("animated", "fadeIn");
        this.cardDetailsWindowElem.style.display = "block";
    }

    close() {
        this.cardDetailsWindowElem.style.display = "none";
        this.cardDetailsWindowElem.parentElement.remove(); // remove gray overlay as well

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
        this.cardDetailsWindowElem = document.createElement("div");
        this.cardDetailsWindowElem.classList.add("card-details-window");
        this.cardDetailsWindowElem.innerHTML = `
            <div class="header">
                <div class="icon-section"><i class="far fa-window-maximize"></i></div>
                <div class="card-info">
                    <div class="section-caption card-caption"><input type="text" value="${this.cardDetails.name}"></div>
                    <div class="list-info">in list <span class="highlight link">${this.cardDetails.listName}</span></div>           
                    <div class="tags">Card tags: </div>     
                </div>
                <div class="close-button"><i class="fas fa-times"></i></div>            
            </div>
            <div class="main-area">
                <div class="icon-section"><i class="far fa-file-alt"></i></div>
                <div class="content">
                    <div class="section-caption">Description</div>
                    <div class="description">${this.cardDetails.description}</div>                
                </div>
                <div class="actions">
                    <div class="button edit"><i class="fas fa-file-alt"></i><span>Edit description</span></div>
                    <div class="button participants"><i class="fas fa-user-tie"></i><span>Participants</span></div>
                    <div class="button attachments"><i class="fas fa-paperclip"></i><span>Attachments</span></div>
                    <div class="button card-cover"><i class="far fa-image"></i><span>Card cover</span></div>
                    <input id="card-cover-file-input" type="file" name="card-cover" style="display: none;" />
                    <div class="button archive"><i class="fas fa-archive"></i><span>Archive card</span></div>
                </div>            
            </div>
            
            <div class="comments-area">
                <div class="icon-section"><i class="far fa-comments"></i></div>
                <div class="section-caption">Comments</div>
                <div class="leave-comment">Leave a <span class="highlight link">new one</span></div>
                <div class="comments"></div>
            </div>
        `;

        const windowOverlayElem = document.createElement("div");
        windowOverlayElem.classList.add("window-overlay");
        windowOverlayElem.append(this.cardDetailsWindowElem);

        document.body.append(windowOverlayElem);

    }

    /**
     * @private
     */
    initElements() {
        const cardCaptionInputElem = this.cardDetailsWindowElem.querySelector(".card-caption input");

        // Update card name after delay
        let cardNameUpdateTimeoutId = null;
        cardCaptionInputElem.addEventListener("keyup", (e) => {
            clearTimeout(cardNameUpdateTimeoutId);


            cardNameUpdateTimeoutId = setTimeout(() => {
                if (utils.isNullOrWhitespace(e.target.value)) {
                    e.target.value = this.cardDetails.name;
                }
                e.target.blur();

                this.kabanBoardService.updateCard(new UpdateCardDto(this.cardDetails.id, e.target.value, null, null, this.cardDetails.listId),
                    () => {
                        console.log("Card name updated");
                        this.cardElem.querySelector("span").innerText = e.target.value;
                    },
                    (error) => {
                        console.error(error);
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of setting new card name. Reason: ${error}`);
                    });

            }, 1000);
        });

        const listNameLinkElem = this.cardDetailsWindowElem.querySelector(".list-info .link");
        listNameLinkElem.addEventListener("click", (e) => {
            console.log("list name click");
        });


        const closeButtonElem = this.cardDetailsWindowElem.querySelector(".close-button");
        closeButtonElem.addEventListener("click", (e) => {
            this.close();
        });

        const editButtonElem = this.cardDetailsWindowElem.querySelector(".actions .edit");
        editButtonElem.addEventListener("click", (e) => {

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

                    const updateCardDto = new UpdateCardDto(this.cardDetails.id, null, newDescription, null, this.cardDetails.listId);
                    this.kabanBoardService.updateCard(updateCardDto,
                        () => {
                            this.cardDetails.description = updateCardDto.description;
                            this.cardDetailsWindowElem.querySelector(".description").innerText = newDescriptionRaw;

                            modalWindow.close();
                        },
                        (error) => {
                            console.error(error);
                            modalWindow.close();
                            ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of editing card description. Reason: ${error}`);
                        });


                },
                () => {
                    // Cancel pressed
                    modalWindow.close();
                }
            ];

            const windowElements = [
                new ModalWindowElement(ModalWindowElementTypes.Textarea, "description", "Card description",
                    this.cardDetails.description.replace(/<br \/>/g, "\r\n"))
            ];

            modalWindow = new ModalWindow("Edit card description", DialogTypes.OkCancel, callbacks, windowElements);
            modalWindow.show();


        });

        const participantsButtonElem = this.cardDetailsWindowElem.querySelector(".actions .participants");
        participantsButtonElem.addEventListener("click", (e) => {
            console.log("Participants button clicked");
        });

        const attachmentsButtonElem = this.cardDetailsWindowElem.querySelector(".actions .attachments");
        attachmentsButtonElem.addEventListener("click", (e) => {
            console.log("Attachments button clicked");
        });

        const cardCoverButtonElem = this.cardDetailsWindowElem.querySelector(".actions .card-cover");
        const cardCoverInputElem = document.querySelector("#card-cover-file-input");
        cardCoverButtonElem.addEventListener("click", (e) => {
            cardCoverInputElem.click();
        });

        cardCoverInputElem.addEventListener("change", (e) => {
            console.log("Card cover input changed");
            const formData = new FormData();
            const fileExtensionWithDot = cardCoverInputElem.files[0].name.substring(cardCoverInputElem.files[0].name.lastIndexOf("."));
            formData.append("imageFile", cardCoverInputElem.files[0], "card-" + this.cardDetails.id + fileExtensionWithDot);

            this.filesService.setCardCover(formData, this.currentBoardId, this.cardDetails.id,
                (res) => {
                    const coverPlaceholderElem = this.cardElem.querySelector(".card-cover");
                    coverPlaceholderElem.style.backgroundImage = `url(${ServerBaseUrl + res.coverImagePath})`;
                    coverPlaceholderElem.style.display = "block";
                    if (res.orientation === ImageOrientation.vertical)
                        coverPlaceholderElem.classList.add("vertical-orientation");
                    else
                        coverPlaceholderElem.classList.add("horizontal-orientation");
                },
                (error) => {
                    console.error(error);
                    ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of setting card cover. Reason: ${error}`);
                });
        });

        const archiveButtonElem = this.cardDetailsWindowElem.querySelector(".actions .archive");
        archiveButtonElem.addEventListener("click", (e) => {
            CardsHelper.archiveCard(this.kabanBoardService, this.cardElem);
        });

        const leaveCommentLinkElem = this.cardDetailsWindowElem.querySelector(".leave-comment .link");
        leaveCommentLinkElem.addEventListener("click", (e) => {
            console.log("Leave a new one clicked");
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