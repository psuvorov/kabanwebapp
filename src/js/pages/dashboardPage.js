import {LocalStorageKeys, ServerBaseApiUrl, ApplicationPageUrls} from "../constants";
import {ApplicationUser} from "../application/applicationUser";
import {AuthenticatedUserDto} from "../dtos/users";
import {BoardDto, CreateBoardDto} from "../dtos/boards";
import BoardsService from "../services/boardsService";
import {
    ModalWindow,
    DialogTypes,
    ModalWindowElementType,
    ModalWindowElement,
    ModalWindowFactory
} from "../components/modalWindow";
import utils from "../utils";
import {LoadingScreen} from "../components/loadingScreen";

export class DashboardPage {

    constructor() {
        /** @private */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();
        if (!utils.isInit(this.applicationUser)) {
            window.location = ApplicationPageUrls.homePage;
            return;
        }

        /**
         * @private
         * @type {BoardsService}
         */
        this.boardsService = new BoardsService();


        /**
         * @private
         * @type {LoadingScreen}
         */
        this.loadingScreen = new LoadingScreen();
    }

    initialize() {
        this.initBoardsList();
        this.setupInteractions();

    }



    initBoardsList() {

        this.loadingScreen.show();
        this.boardsService.getAllUserBoards(this.applicationUser.id, (boards) => {
                this.initUserBoards(boards);
                this.loadingScreen.close();
            },
            (error) => {
                this.loadingScreen.close();
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting user boards. Reason: ${error}`);
            });
    }

    /**
     *
     * @param {BoardDto[]} boards
     */
    initUserBoards(boards) {
        const boardsContainerElem = document.querySelector(".boards-container");
        while (boardsContainerElem.firstChild) {
            boardsContainerElem.removeChild(boardsContainerElem.lastChild);
        }

        boards.forEach(board => {
            const boardItemElem = document.createElement("div");
            boardItemElem.classList.add("board-item");
            boardItemElem.setAttribute("data-board-id", `${board.id}`);
            boardItemElem.innerHTML = ` 
                <div class="title">
                    ${board.name}
                </div>
                <div class="description">
                    ${board.description}
                </div>
            `;

            boardItemElem.addEventListener("click", () => {
                window.location = `${ApplicationPageUrls.boardPage}?board_id=${board.id}`;
            });

            boardsContainerElem.append(boardItemElem);
        });

        /** @type HTMLElement */
        const dashboardTopDescriptionElem = document.querySelector(".dashboard-top-description");
        if (boards.length === 0) {
            dashboardTopDescriptionElem.innerHTML = `There is no any board, but you can <span class="highlight link">create one</span>`;
            const createOneLink = dashboardTopDescriptionElem.querySelector("span");
            createOneLink.addEventListener("click", this.createBoardEventHandler.bind(this));
        } else {
            dashboardTopDescriptionElem.innerText = `Here are all your boards:`;
        }


    }

    /**
     * @private
     */
    setupInteractions() {
        const rightItemsAreaElem = document.querySelector(".right-items-area");

        const createBoardElem = rightItemsAreaElem.querySelector(".create-board");

        createBoardElem.addEventListener("click", this.createBoardEventHandler.bind(this));
    }

    createBoardEventHandler(event) {
        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [
            /**
             *
             * @param {string} serializedFormData
             */
                (serializedFormData) => {
                // Ok pressed

                const createBoardDtoRaw = JSON.parse(serializedFormData);
                /** @type CreateBoardDto */
                const createBoardDto = new CreateBoardDto(createBoardDtoRaw.name, createBoardDtoRaw.description);
                this.boardsService.createBoard(createBoardDto,
                    () => {
                        modalWindow.close();
                        this.initBoardsList();
                    },
                    (error) => {
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of creating new board. Reason: ${error}`);
                    });
            },
            () => {
                // Cancel pressed
                modalWindow.close();
            }
        ];

        const windowElements = [
            new ModalWindowElement(ModalWindowElementType.Input, "name", "Board name", "My board"),
            new ModalWindowElement(ModalWindowElementType.Textarea, "description", "Board description", "My board description")
        ];

        modalWindow = new ModalWindow("Create new board", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }


}