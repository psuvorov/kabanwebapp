import {ApplicationUser} from "../application/applicationUser";
import {LocalStorageKeys, ServerBaseApiUrl} from "../constants";
import {BoardDto} from "../dtos/boards";
import {AuthenticatedUserDto} from "../dtos/users";

export default class AuthService {


    /**
     *
     * @param {AuthenticateUserDto} authenticateUserDto
     * @param {function} onSuccess
     * @param {function} onError
     */
    authenticate(authenticateUserDto, onSuccess, onError) {

        fetch(ServerBaseApiUrl + "/users/authenticate-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(authenticateUserDto)
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
                const currentUser = new AuthenticatedUserDto(res.id, res.firstName, res.lastName, res.username, res.email, res.token);
                onSuccess(currentUser);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {RegisterUserDto} registerUserDto
     * @param {function} onSuccess
     * @param {function} onError
     */
    register(registerUserDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + "/users/register-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerUserDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
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
                onSuccess({userId: res.userId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {UpdateUserDto} updateUserDto
     * @param {function} onSuccess
     * @param {function} onError
     */
    updateUser(updateUserDto, onSuccess, onError) {
        const applicationUser = ApplicationUser.getApplicationUserFromStorage();

        fetch(ServerBaseApiUrl + "/users/update-user", {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateUserDto)
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