import {ApplicationUser} from "../application/applicationUser";
import {LocalStorageKeys, ServerBaseApiUrl} from "../constants";

export default class UsersService {

    constructor() {
        this.endpointRootName = "users";
    }

    /**
     *
     * @param {any} authenticateUser
     * @param {function} onSuccess
     * @param {function} onError
     */
    authenticate(authenticateUser, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/authenticate-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(authenticateUser)
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
                    firstName: res.firstName,
                    lastName: res.lastName,
                    username: res.username,
                    email: res.email,
                    token: res.token
                });
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {any} registerUser
     * @param {function} onSuccess
     * @param {function} onError
     */
    register(registerUser, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/register-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerUser)
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            }  else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else {
                onSuccess({userId: res.entityId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {any} updateUser
     * @param {function} onSuccess
     * @param {function} onError
     */
    updateUser(updateUser, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/update-user`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateUser)
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
}