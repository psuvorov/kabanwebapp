import {ModalWindowFactory} from "../components/modalWindow";

export class CardsHelper {

    /**
     * @param boardId
     * @param {CardsService} cardsService
     * @param {HTMLElement} cardElem
     * @param caller
     */
    archiveCard(boardId, cardsService, cardElem, caller = null) {
        ModalWindowFactory.showYesNoQuestion("Archive card", "Do you want to archive this card?",
            () => {

            const cardId = cardElem.getAttribute("data-card-id");
            cardsService.updateCard(boardId, {
                    cardId,
                    isArchived: true
                },
                (res) => {
                    cardElem.remove();
                    if (caller) {
                        if (caller)
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