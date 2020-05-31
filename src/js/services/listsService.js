import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";
import {BoardDto, CreateBoardDto, UpdateBoardDto} from "../dtos/boards";
import {ListDto, CreateListDto, UpdateListDto} from "../dtos/lists";
import {CardDto, CreateCardDto, UpdateCardDto} from "../dtos/cards";

export default class ListsService {


    /**
     *
     * @param boardId
     * @param onSuccess
     * @param onError
     */
    getAllBoardLists(boardId, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${boardId}/lists/`, {
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
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                const lists = [];
                for (let i = 0; i < res.length; i++) {
                    const list = new ListDto(res[i].id, res[i].name, res[i].orderNumber, res[i].boardId, res[i].cards);
                    lists.push(list);
                }
                onSuccess(lists);
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
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${createListDto.boardId}/lists`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
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
     * @param {string} boardId
     * @param {string} listId
     * @param {UpdateListDto} updateListDto
     * @param onSuccess
     * @param onError
     */
    updateList(boardId, listId, updateListDto, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${boardId}/lists/${listId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateListDto)
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
                onSuccess();
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param {updateListOrderNumberDto[]} updateListOrderNumberDto
     * @param onSuccess
     * @param onError
     */
    updateListOrderNumbers(boardId, updateListOrderNumberDto, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${boardId}/lists/${listId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateListDto)
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
                onSuccess();
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param {string} listId
     * @param {function} onSuccess
     * @param {function} onError
     */
    deleteList(boardId, listId, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + `/boards/${boardId}/lists/${listId}`, {
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
