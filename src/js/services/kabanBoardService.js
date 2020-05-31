import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";
import {BoardDto, BoardInfoDto} from "../dtos/boards";

export default class KabanBoardService {

    constructor() {
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();
    }

    /**
     * @param {number} userId
     * @param {function} onSuccess
     * @param {function} onError
     */
    getAllUserBoards(userId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/get-all-user-boards?userId=${userId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
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
                const boards = [];
                for (let i = 0; i < res.length; i++) {
                    const board = new BoardInfoDto(res[i].id, res[i].name, res[i].description);
                    boards.push(board);
                }
                onSuccess(boards);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {number} userId
     * @param {string} boardId
     * @param {function} onSuccess
     * @param {function} onError
     */
    getUserBoard(userId, boardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/get-user-board?userId=${userId}&boardId=${boardId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
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
                const board = new BoardDto(res.id, res.name, res.description, res.lists, parseInt(res.userId));
                onSuccess(board);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateBoardDto} createBoardDto
     * @param {function} onSuccess
     * @param {function} onError
     */
    createBoard(createBoardDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/create-board`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createBoardDto)
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
                onSuccess({boardId: res.boardId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateListDto} createListDto
     * @param onSuccess
     * @param onError
     */
    createList(createListDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/create-list`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createListDto)
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
                onSuccess({listId: res.listId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateCardDto} createCardDto
     * @param onSuccess
     * @param onError
     */
    createCard(createCardDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/create-card`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
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

    updateBoardInfo() {

    }

    updateList() {

    }

    updateCard() {

    }

    deleteBoard() {

    }

    deleteList() {

    }

    deleteCard() {

    }

}