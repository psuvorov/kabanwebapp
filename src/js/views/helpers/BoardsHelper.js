import {CreateBoardDto} from "../../dtos/boards";
import {ApplicationPageUrls} from "../../constants";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";

export class BoardsHelper {

    /**
     * @param {KabanBoardService} kabanBoardService
     */
    createBoard(kabanBoardService) {
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
                kabanBoardService.createBoard(createBoardDto,
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