import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";
import {BoardDto, CreateBoardDto, UpdateBoardDto} from "../dtos/boards";
import {ListDto, CreateListDto, UpdateListDto} from "../dtos/lists";
import {CardDto, CreateCardDto, UpdateCardDto} from "../dtos/cards";

export default class CardsService {

    /**
     *
     * @param {CreateCardDto} createCardDto
     * @param onSuccess
     * @param onError
     */
    createCard(createCardDto, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/lists/${createCardDto.listId}/cards`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createCardDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess({cardId: res.cardId});
            }
        }).catch(error => {
            onError(error);
        });
    }

}