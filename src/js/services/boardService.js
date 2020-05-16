import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";

export default class BoardService {

    /**
     *
     * @param {string} createBoardDtoSerialized
     * @param {function} onSuccess
     * @param {function} onError
     */
    createBoard(createBoardDtoSerialized, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: createBoardDtoSerialized
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else {
                onSuccess({boardId: res.boardId});
            }
        }).catch(error => {
            onError(error);
        });
    }


}