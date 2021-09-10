import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";

export default class BoardsService {

    constructor() {
        /**
         * @private
         * @readonly
         * @type {any}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();

        this.endpointRootName = "boards";
    }

    /**
     *
     * @param {string} boardId
     * @param {function} onSuccess
     * @param {function} onError
     */
    getBoard(boardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/get-board/${boardId}`, {
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
                    description: res.description,
                    wallpaperPath: res.wallpaperPath,
                    lists: res.lists,
                    userId: res.userId
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
    getBoardDetails(boardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/get-board-details/${boardId}`, {
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
                    description: res.description,
                    author: res.author,
                    participants: res.participants,
                    created: res.created,
                    lastModified: res.lastModified
                });
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {any} createBoard
     * @param {function} onSuccess
     * @param {function} onError
     */
    createBoard(createBoard, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/create-board`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createBoard)
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
                onSuccess({boardId: res.entityId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {FormData} data
     * @param {string} boardId
     * @param onSuccess
     * @param onError
     */
    setBoardWallpaper(boardId, data, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/set-board-wallpaper`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token
            },
            body: data
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
                onSuccess(res);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {any} updateBoard
     * @param onSuccess
     * @param onError
     */
    updateBoardInfo(boardId, updateBoard, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/update-board-info`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateBoard)
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
     * @param onSuccess
     * @param onError
     */
    deleteBoard(boardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/delete-board`, {
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