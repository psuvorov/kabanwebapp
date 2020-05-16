import {ServerBaseApiUrl} from "../constants";
import {ApplicationUser} from "../application/applicationUser";
import {BoardDto, CreateBoardDto} from "../dtos/boards";

export default class DashboardService {


    /**
     *
     * @param {function} onSuccess
     * @param {function} onError
     */
    getUserBoards(onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/users/${applicationUser.id}/boards/`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " -- " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError({message: res.message});
            } else {
                const boards = [];
                for (let i = 0; i < res.length; i++) {
                    const board = new BoardDto(res[i].id, res[i].name, res[i].description, parseInt(res[i].userId));
                    boards.push(board);
                }
                onSuccess(boards);
            }
        }).catch(error => {
            onError(error);
        });
    }




}