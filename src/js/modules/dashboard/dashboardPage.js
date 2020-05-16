import {LocalStorageKeys, ServerBaseApiUrl, ApplicationPageUrls} from "../../constants";
import {ApplicationUser} from "../../application/applicationUser";
import {AuthenticatedUserDto} from "../../dtos/users";
import {BoardDto} from "../../dtos/boards";
import DashboardService from "../../services/dashboardService";
import {ModalWindow, DialogTypes, ModalWindowElementType, ModalWindowElement} from "../modalWindow";

export class DashboardPage {

    constructor() {
        if (ApplicationUser.getApplicationUserFromStorage() === null) {
            window.location = ApplicationPageUrls.homePage;
            return;
        }

        /**
         * @private
         * @type {DashboardService}
         */
        this.dashboardService = new DashboardService();





    }

    initialize() {
        this.initBoardsList();

    }



    initBoardsList() {

        this.dashboardService.getUserBoards((boards) => {
                this.initUserBoards(boards);
            },
            (error) => {
                new ModalWindow("Error of getting user boards", DialogTypes.Ok, [() => {
                    window.location = ApplicationPageUrls.homePage;
                }], [new ModalWindowElement(ModalWindowElementType.Label, "error", "Error", error)]).show();
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
                    <div>${board.name}</div>
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