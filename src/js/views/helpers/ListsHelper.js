import {ModalWindowFactory} from "../components/modalWindow";

export class ListsHelper {

    /**
     *
     * @param boardId
     * @param {ListsService} listsService
     * @param {HTMLElement} listElem
     */
    archiveList(boardId, listsService, listElem) {
        ModalWindowFactory.showYesNoQuestion("Archive list", "Do you wand to archive this list?",
            () => {
                const listId = listElem.getAttribute("data-list-id");
                listsService.updateList(boardId, {listId, isArchived: true},
                    (res) => {
                        listElem.parentElement.remove();
                    },
                    (error) => {
                        console.error(error);
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of updating list. Reason: ${error}`);
                    });
            });
    }
}