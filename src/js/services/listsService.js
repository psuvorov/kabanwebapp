import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";

export class ListsService {

    constructor() {
        /**
         * @private
         * @readonly
         * @type {any}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();

        this.endpointRootName = "lists";
    }

    /**
     *
     * @param {string} boardId
     * @param {string} listId
     * @param onSuccess
     * @param onError
     */
    getList(boardId, listId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/get-list/${listId}`, {
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
                onSuccess({
                    id: res.id,
                    name: res.name,
                    orderNumber: parseInt(res.orderNumber),
                    cards: res.cards
                });
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param onSuccess
     * @param onError
     */
    getArchivedLists(boardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/get-archived-lists`, {
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
                const lists = [];
                for (let i = 0; i < res.length; i++) {
                    lists.push({
                        id: res[i].id,
                        name: res[i].name,
                        created: res[i].created,
                        archived: res[i].archived
                    });
                }
                onSuccess(lists);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {any} createList
     * @param onSuccess
     * @param onError
     */
    createList(boardId, createList, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/create-list`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createList)
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
                onSuccess({listId: res.entityId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param listId
     * @param onSuccess
     * @param onError
     */
    copyList(boardId, listId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/copy-list/${listId}`, {
            method: "POST",
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
                onSuccess({listId: res.entityId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {any} updateList
     * @param onSuccess
     * @param onError
     */
    updateList(boardId, updateList, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/update-list`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateList)
        }).then(res => {
            if (res.status === 200) {
                return {};
            } else if (res.status === 400) {
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
     * @param {string} boardId
     * @param {any[]} renumberedLists
     * @param onSuccess
     * @param onError
     */
    reorderLists(boardId, renumberedLists, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/reorder-lists`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(renumberedLists)
        }).then(res => {
            if (res.status === 200) {
                return {};
            } else if (res.status === 400) {
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
     * @param onSuccess
     * @param onError
     */
    deleteList(boardId, listId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/delete-list/${listId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 204) {
                return {};
            } else if (res.status === 400) {
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
}