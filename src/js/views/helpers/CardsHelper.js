import {ModalWindowFactory} from "../components/modalWindow";
import {UpdateCardDto} from "../../dtos/cards";

export class CardsHelper {


    /**
     * @param {KabanBoardService} kabanBoardService
     * @param {HTMLElement} cardElem
     * @param caller // IClosable
     */
    archiveCard(kabanBoardService, cardElem, caller = null) {
        ModalWindowFactory.showYesNoQuestion("Archive card", "Do you wand to archive this card?",
            () => {
                const cardId = cardElem.getAttribute("data-card-id");
                kabanBoardService.updateCard(new UpdateCardDto(cardId, null, null, null, null, true),
                    (res) => {
                        cardElem.remove();
                        if (caller) {
                            if (caller) // lack of interfaces...
                                caller.close();
                        }
                    },
                    (error) => {
                        console.error(error);
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of updating card. Reason: ${error}`);
                    });
            });
    }

}