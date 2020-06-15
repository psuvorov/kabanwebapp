import {ServerBaseApiUrl} from "../constants";
import {ApplicationUser} from "../application/applicationUser";

export default class FilesService {

    constructor() {
        /**
         * @private
         * @readonly
         * @type {ApplicationUser}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();
    }

    /**
     *
     * @param {FormData} data
     * @param {string} boardId
     * @param {string} cardId
     * @param onSuccess
     * @param onError
     */
    uploadCardCover(data, boardId, cardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/upload-card-cover?boardId=${boardId}&cardId=${cardId}`, {
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
     * @param {FormData} data
     * @param {string} boardId
     * @param onSuccess
     * @param onError
     */
    uploadBoardWallpaper(data, boardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/upload-board-wallpaper?boardId=${boardId}`, {
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


}