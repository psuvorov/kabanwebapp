import {ModalWindowFactory} from "../components/modalWindow";
import {UpdateListDto} from "../../dtos/lists";

export class ListsHelper {

    /**
     *
     * @param {KabanBoardService} kabanBoardService
     * @param {HTMLElement} listElem
     */
    static archiveList(kabanBoardService, listElem) {
        ModalWindowFactory.showYesNoQuestion("Archive list", "Do you wand to archive this list?",
            () => {
                const listId = listElem.getAttribute("data-list-id");
                kabanBoardService.updateList(new UpdateListDto(listId, null, null, true),
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