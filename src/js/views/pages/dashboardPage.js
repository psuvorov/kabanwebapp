import {LocalStorageKeys, ServerBaseApiUrl, ApplicationPageUrls, ServerBaseUrl} from "../../constants";
import {ApplicationUser} from "../../application/applicationUser";
import {
    ModalWindowFactory
} from "../components/modalWindow";
import utils from "../../utils";
import {LoadingScreen} from "../components/loadingScreen";
import {BoardsHelper} from "../helpers/BoardsHelper";
import {DashboardsService} from "../../services/dashboardsService";
import BoardsService from "../../services/boardsService";

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
         * @type {DashboardsService}
         */
        this.dashboardsService = new DashboardsService();

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
    }

    initBoardsList() {
        this.loadingScreen.show();
        this.dashboardsService.getUserBoards(
            (boards) => {
                this.initUserBoards(boards);
                this.loadingScreen.close();
            },
            (error) => {
                console.error(error);
                this.loadingScreen.close();
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting user boards. Reason: ${error}`);
            });
    }

    /**
     *
     * @param {any[]} boards
     */
    initUserBoards(boards) {
        const boardsContainerElem = document.querySelector(".boards-container");
        utils.removeAllChildren(".boards-container");

        boards.forEach(board => {
            const boardItemElem = document.createElement("div");
            boardItemElem.classList.add("board-item");
            boardItemElem.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${ServerBaseUrl + board.wallpaperPreviewPath})`;
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

            createOneLink.addEventListener("click", (e) => {
                (new BoardsHelper).createBoard(this.boardsService);
            });
        } else {
            dashboardTopDescriptionElem.innerText = `Here are all your boards:`;
        }
    }
}