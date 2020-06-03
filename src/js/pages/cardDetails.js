import {CardDetailsDto, UpdateCardDto} from "../dtos/cards";
import utils from "../utils";
import {UpdateBoardDto} from "../dtos/boards";
import {ModalWindowFactory} from "../components/modalWindow";

export class CardDetails {

    /**
     *
     * @param {CardDetailsDto} cardDetails
     * @param {KabanBoardService} kabanBoardService
     * @param {HTMLElement} cardElem
     */
    constructor(cardDetails, kabanBoardService, cardElem) {

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

        this.initialize();
    }

    show() {
        this.cardDetailsWindowElem.classList.add("animated", "fadeIn");
        this.cardDetailsWindowElem.style.display = "block";
    }

    close() {
        this.cardDetailsWindowElem.style.display = "none";
        this.cardDetailsWindowElem.parentElement.remove();
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
                    <div class="description">${this.cardDetails.description}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id egestas mi, vel ultricies lacus. Donec viverra augue ut mauris porttitor, eget sagittis lorem ultricies. Suspendisse in nisl mauris. Maecenas leo enim, egestas quis diam id, dictum aliquam est. Etiam ultricies dui ac consectetur tristique. In eget sem egestas est consequat blandit. Vivamus rutrum dolor in orci ultricies, pulvinar tincidunt lectus dapibus. Quisque quis libero orci. Praesent vitae interdum mauris. Nullam faucibus mattis augue, a dictum orci porttitor sit amet. Nulla mollis est sed ante pulvinar, eget pharetra eros blandit. Donec magna diam, tristique at nibh sed, malesuada sodales mi. Cras fringilla rutrum arcu quis pretium. Duis suscipit, turpis sed aliquet molestie, felis augue pulvinar quam, a porta erat risus non lacus. Maecenas ut tempus nisi, ac tempus tellus.

                        Nullam non placerat neque. Pellentesque consequat nisl a semper eleifend. Nulla malesuada ornare arcu eu luctus. Nulla bibendum, nibh sit amet varius commodo, diam odio laoreet erat, vel dapibus mauris sem in turpis. Nulla tincidunt interdum eros sit amet dignissim. Nunc sit amet ipsum sit amet ligula laoreet feugiat. Mauris placerat, dolor sit amet tincidunt egestas, justo nulla accumsan tellus, in sollicitudin turpis nisi tincidunt magna. Vivamus sodales tincidunt lacus eget semper. Nulla tempor sed sem vel sollicitudin. Praesent rhoncus dapibus neque vel aliquam. Suspendisse consequat mi a sapien viverra, tristique pretium arcu pharetra. Vivamus congue feugiat sapien, in tempus augue pharetra sit amet. Pellentesque laoreet nulla quis faucibus interdum. Donec sit amet feugiat neque, sed consequat quam. Proin imperdiet gravida ex, in molestie sapien volutpat in.
                        
                        
                    </div>                
                </div>
                <div class="actions">
                    <div class="button edit"><i class="fas fa-file-alt"></i><span>Edit</span></div>
                    <div class="button participants"><i class="fas fa-user-tie"></i><span>Participants</span></div>
                    <div class="button attachments"><i class="fas fa-paperclip"></i><span>Attachments</span></div>
                    <div class="button card-cover"><i class="far fa-image"></i><span>Cover</span></div>
                    <div class="button archive"><i class="fas fa-archive"></i><span>Archive</span></div>
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
            console.log("Edit button clicked");
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
        cardCoverButtonElem.addEventListener("click", (e) => {
            console.log("Card cover button clicked");
        });

        const archiveButtonElem = this.cardDetailsWindowElem.querySelector(".actions .archive");
        archiveButtonElem.addEventListener("click", (e) => {
            console.log("Archive button clicked");
        });

        const leaveCommentLinkElem = this.cardDetailsWindowElem.querySelector(".leave-comment .link");
        leaveCommentLinkElem.addEventListener("click", (e) => {
            console.log("Leave a new one clicked");
        });

    }



}