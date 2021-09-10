import {WindowMenu} from "../components/windowMenu";
import {
    ModalWindowFactory
} from "../components/modalWindow";
import {ApplicationPageUrls} from "../../constants";
import {ClosedBoards} from "../windows/closedBoards";
import utils from "../../utils";
import {BoardsHelper} from "../helpers/BoardsHelper";

export class BoardsWindowMenu extends WindowMenu {
    /**
     *
     * @param callerElem
     * @param dashboardsService
     * @param boardsService
     * @param {DashboardPage} dashboardPage
     */
    constructor(callerElem, dashboardsService, boardsService, dashboardPage) {
        super(callerElem);

        this.dashboardsService = dashboardsService;
        this.boardsService = boardsService;

        this.dashboardPage = dashboardPage;
    }

    initialize() {
        super.initialize();

        this.windowMenuElem.innerHTML = `
            <div class="boards-window-menu">
                <input placeholder="Search by board name..." class="board-search-input">
                <div class="boards-list">
                </div>
                <div class="menu-items">
                    <div class="open-dashboard"><a class="link highlight" href="${ApplicationPageUrls.dashboardPage}">Dashboard</a></div>
                    <div class="create-board"><span class="highlight link">Create board</span></div>
                    <div class="closed-boards"><span class="highlight link">Closed boards</span></div>
                </div>
                
            </div>`;

        this.setupInteractions();
        this.drawAvailableBoards();
    }

    /**
     * @private
     */
    drawAvailableBoards() {
        const boardsListElem = this.windowMenuElem.querySelector(".boards-list");
        utils.removeAllChildren(".boards-list");

        this.dashboardsService.getUserBoards(
            (boards) => {
                boards.forEach(board => {
                    const description = board.description.replace(/<br \/>/g, "\r\n");

                    const boardItemElem = document.createElement("a");
                    boardItemElem.classList.add("board-item", "link");
                    boardItemElem.setAttribute("href", `${ApplicationPageUrls.boardPage}?board_id=${board.id}`);
                    boardItemElem.innerHTML = `<div class="board-name" title="${board.name}">${board.name}</div><div class="board-description" title="${description}">${description}</div>`;
                    boardsListElem.append(boardItemElem);
                });

                this.windowMenuElem.querySelector(".board-search-input").focus();
            },
            (error) => {
                console.error(error);
                ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of getting user boards. Reason: ${error}`);
            });
    }

    setupInteractions() {
        super.setupInteractions();

        const boardsListElem = this.windowMenuElem.querySelector(".boards-list");
        const createBoardLinkElem = this.windowMenuElem.querySelector(".create-board .link");
        const closedBoardsLinkElem = this.windowMenuElem.querySelector(".closed-boards .link");
        const boardSearchInputElem = this.windowMenuElem.querySelector(".board-search-input");

        createBoardLinkElem.addEventListener("click", (e) => {
            this.close();
            (new BoardsHelper).createBoard(this.boardsService);
        });

        closedBoardsLinkElem.addEventListener("click", () => {
            this.close();

            const refreshCallbacks = [this.drawAvailableBoards.bind(this)];
            if (this.dashboardPage) // if it's the Dashboard Page
                refreshCallbacks.push(this.dashboardPage.initBoardsList.bind(this.dashboardPage));

            const closedBoards = new ClosedBoards(this.dashboardsService, this.boardsService, refreshCallbacks);
            closedBoards.show();
        });

        boardSearchInputElem.addEventListener("keyup", (e) => {
            const val = e.target.value.toLowerCase();

            boardsListElem.children.forEach(boardItem => {
                const boardName = boardItem.querySelector(".board-name").textContent.toLowerCase();
                if (!boardName.includes(val))
                    boardItem.style.display = "none";
                else
                    boardItem.style.display = "block";
            });
        });
    }
}