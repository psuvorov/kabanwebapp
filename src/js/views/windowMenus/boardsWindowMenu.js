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

export class BoardsWindowMenu extends WindowMenu {


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


        const boardsListElem = this.windowMenuElem.querySelector(".boards-list");

        this.kabanBoardService.getAllUserBoards(
            /** @type BoardShortInfoDto[] */
            (boards) => {
                boards.forEach(board => {
                    const boardItemElem = document.createElement("div");
                    boardItemElem.classList.add("board-item");
                    boardItemElem.innerHTML = `<a href="${ApplicationPageUrls.boardPage}?board_id=${board.id}" class="link">${board.name}</a>`;
                    boardsListElem.append(boardItemElem);
                });
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



        createBoardLinkElem.addEventListener("click", this.createBoardEventHandler.bind(this));

        closedBoardsLinkElem.addEventListener("click", () => {
            const closedBoards = new ClosedBoards();
            closedBoards.show();
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