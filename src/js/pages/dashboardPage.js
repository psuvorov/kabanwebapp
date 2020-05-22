import {LocalStorageKeys, ServerBaseApiUrl, ApplicationPageUrls} from "../constants";
import {ApplicationUser} from "../application/applicationUser";
import {AuthenticatedUserDto} from "../dtos/users";
import {BoardDto} from "../dtos/boards";
import BoardsService from "../services/boardsService";
import {
    ModalWindow,
    DialogTypes,
    ModalWindowElementType,
    ModalWindowElement,
    ModalWindowFactory
} from "../components/modalWindow";
import utils from "../utils";

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





    }

    initialize() {
        this.initBoardsList();

    }



    initBoardsList() {



        this.boardsService.getAllUserBoards(this.applicationUser.id, (boards) => {
                this.initUserBoards(boards);
            },
            (error) => {
                ModalWindowFactory.showErrorOkMessage("Error occurred", "Error of getting user boards");
            });
    }

    /**
     *
     * @param {BoardDto[]} boards
     */
    initUserBoards(boards) {
        const boardsContainerElem = document.querySelector(".boards-container");

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
    }



}