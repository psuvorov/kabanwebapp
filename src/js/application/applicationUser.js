import {LocalStorageKeys} from "../constants";

export class ApplicationUser {

    static fromAuthenticatedUserDto(authenticatedUser) {
        if (!this.hasValidFields(authenticatedUser))
            return null;

        return {
            id: authenticatedUser.id,
            firstName: authenticatedUser.firstName,
            lastName: authenticatedUser.lastName,
            username: authenticatedUser.username,
            email: authenticatedUser.email,
            token: authenticatedUser.token
        };
    }

    /**
     *
     * @return {any}
     */
    static getApplicationUserFromStorage() {
        const currentUserRaw = localStorage.getItem(LocalStorageKeys.currentUser);
        if (!currentUserRaw)
            return null;

        const currentUserParsed = JSON.parse(currentUserRaw);

        if (!this.hasValidFields(currentUserParsed))
            return null;

        return {
            id: currentUserParsed.id,
            firstName: currentUserParsed.firstName,
            lastName: currentUserParsed.lastName,
            username: currentUserParsed.username,
            email: currentUserParsed.email,
            token: currentUserParsed.token
        };
    }

    /**
     * @private
     * @param {any} userObject
     * @return {boolean}
     */
    static hasValidFields(userObject) {
        return (userObject.hasOwnProperty("id") &&
            userObject.hasOwnProperty("firstName") &&
            userObject.hasOwnProperty("lastName") &&
            userObject.hasOwnProperty("username") &&
            userObject.hasOwnProperty("email") &&
            userObject.hasOwnProperty("token"));
    }

    static signOut() {
        localStorage.removeItem(LocalStorageKeys.currentUser);
        location.href = "/";
    }
}