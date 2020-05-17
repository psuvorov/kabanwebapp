import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";
import {BoardDto, CreateBoardDto, UpdateBoardDto} from "../dtos/boards";
import {ListDto, CreateListDto, UpdateListDto} from "../dtos/lists";
import {CardDto, CreateCardDto, UpdateCardDto} from "../dtos/cards";

export default class BoardsService {

    /**
     * @param {function} onSuccess
     * @param {function} onError
     */
    getAllBoards(onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
        }).then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
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


    /**
     * @param {number} userId
     * @param {function} onSuccess
     * @param {function} onError
     */
    getAllUserBoards(userId, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/users/${userId}/boards/`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
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

    /**
     * @param {number} userId
     * @param {number} boardId
     * @param {function} onSuccess
     * @param {function} onError
     */
    getUserBoard(userId, boardId, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/users/${userId}/boards/${boardId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
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
                onError({message: res.message});
            } else {
                const board = new BoardDto(res.id, res.name, res.description, parseInt(res.userId));
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
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
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
            } else {
                onSuccess({boardId: res.boardId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param {UpdateBoardDto} createBoardDto
     * @param {function} onSuccess
     * @param {function} onError
     */
    updateBoard(boardId, updateBoardDto, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${boardId}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateBoardDto)
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
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

    /**
     *
     * @param {string} boardId
     * @param {function} onSuccess
     * @param {function} onError
     */
    deleteBoard(boardId,onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${boardId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 204) {
                return;
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            onSuccess();
        }).catch(error => {
            onError(error);
        });
    }



}