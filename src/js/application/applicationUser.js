import {LocalStorageKeys} from "../constants";
import {AuthenticateUserDto, AuthenticatedUserDto} from "../dtos/users";

export class ApplicationUser {

    /**
     *
     * @param {number} id
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} username
     * @param {string} email
     * @param {string} token
     */
    constructor(id, firstName, lastName, username, email, token) {

        /** @readonly */
        this.id = id;
        /** @readonly */
        this.firstName = firstName;
        /** @readonly */
        this.lastName = lastName;
        /** @readonly */
        this.username = username;
        /** @readonly */
        this.email = email;
        /** @readonly */
        this.token = token;
    }

    /**
     *
     * @param {AuthenticatedUserDto} authenticatedUserDto
     */
    static fromAuthenticatedUserDto(authenticatedUserDto) {
        if (this.checkFields(authenticatedUserDto) === false)
            return null;

        return new ApplicationUser(authenticatedUserDto.id, authenticatedUserDto.firstName,
            authenticatedUserDto.lastName, authenticatedUserDto.username, authenticatedUserDto.email, authenticatedUserDto.token);
    }

    /**
     *
     * @return {ApplicationUser}
     */
    static getApplicationUserFromStorage() {
        const currentUserRaw = localStorage.getItem(LocalStorageKeys.currentUser);
        if (!currentUserRaw)
            return null;

        const currentUserParsed = JSON.parse(currentUserRaw);

        if (this.checkFields(currentUserParsed) === false)
            return null;

        return new ApplicationUser(parseInt(currentUserParsed.id), currentUserParsed.firstName,
            currentUserParsed.lastName, currentUserParsed.username, currentUserParsed.email, currentUserParsed.token);
    }

    /**
     * @private
     * @param userObject
     * @return {boolean|boolean}
     */
    static checkFields(userObject) {
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