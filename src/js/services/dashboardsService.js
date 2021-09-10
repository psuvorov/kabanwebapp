import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";

export class DashboardsService {

    constructor() {
        /**
         * @private
         * @readonly
         * @type {any}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();

        this.endpointRootName = "dashboards";
    }

    /**
     * @param {function} onSuccess
     * @param {function} onError
     */
    getUserBoards(onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/get-user-boards`, {
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
                    boards.push({
                        id: res[i].id,
                        name: res[i].name,
                        description: res[i].description,
                        wallpaperPreviewPath: res[i].wallpaperPreviewPath
                    });
                }
                onSuccess(boards);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     * @param {function} onSuccess
     * @param {function} onError
     */
    getClosedUserBoards(onSuccess, onError) {
        // TODO: Add the corresponding endpoint
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/get-closed-user-boards`, {
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
                    boards.push({
                        id: res[i].id,
                        name: res[i].name,
                        description: res[i].description
                    });
                }
                onSuccess(boards);
            }
        }).catch(error => {
            onError(error);
        });
    }
}