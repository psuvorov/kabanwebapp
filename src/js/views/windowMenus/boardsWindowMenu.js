import {WindowMenu} from "../components/windowMenu";
import {CreateBoardDto} from "../../dtos/boards";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";
import {ApplicationPageUrls} from "../../constants";
import {ClosedBoards} from "../windows/closedBoards";
import utils from "../../utils";

export class BoardsWindowMenu extends WindowMenu {


    /**
     *
     * @param callerElem
     * @param kabanBoardService
     * @param {DashboardPage} dashboardPage
     */
    constructor(callerElem, kabanBoardService, dashboardPage) {
        super(callerElem, kabanBoardService);

        this.dashboardPage = dashboardPage;
    }

    initialize() {
        super.initialize();

        this.windowMenuElem.innerHTML = `
            <div class="boards-window-menu">
                <input placeholder="Search by board name..." class="board-search-input">
                <div class="boards-list">
                </div>
                <a class="open-dashboard link highlight" href="${ApplicationPageUrls.dashboardPage}">Dashboard</a>
                <div class="create-board"><span class="highlight link">Create board</span></div>
                <div class="closed-boards"><span class="highlight link">Closed boards</span></div>
            </div>`;

        this.drawAvailableBoards();
    }

    /**
     * @private
     */
    drawAvailableBoards() {
        const boardsListElem = this.windowMenuElem.querySelector(".boards-list");
        utils.removeAllChildren(".boards-list");


        this.kabanBoardService.getUserBoards(
            /** @type BoardShortInfoDto[] */
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

        createBoardLinkElem.addEventListener("click", this.createBoardEventHandler.bind(this));

        closedBoardsLinkElem.addEventListener("click", () => {
            this.close();

            const refreshCallbacks = [this.drawAvailableBoards.bind(this)];
            if (this.dashboardPage) // if it's the Dashboard Page
                refreshCallbacks.push(this.dashboardPage.initBoardsList.bind(this.dashboardPage));

            const closedBoards = new ClosedBoards(this.kabanBoardService, refreshCallbacks);
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

    /**
     * @private
     * @param event
     */
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
                this.kabanBoardService.createBoard(createBoardDto,
                    (res) => {
                        modalWindow.close();

                        const createdBoardId = res.boardId;
                        window.location = `${ApplicationPageUrls.boardPage}?board_id=${createdBoardId}`;
                    },
                    (error) => {
                        console.error(error);
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
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "name", "Board name", "My board"),
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Textarea, "description", "Board description", "My board description")
        ];

        modalWindow = new ModalWindow("Create new board", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }
}