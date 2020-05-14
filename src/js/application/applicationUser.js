import {LocalStorageKeys} from "../helper";

export class ApplicationUser {

    /**
     *
     * @param {number} id
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} userName
     * @param {string} email
     * @param {string} token
     */
    constructor(id, firstName, lastName, userName, email, token) {

        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
        this._email = email;
        this._token = token;
    }

    get id() {
        return this._id;
    }

    get firstName() {
        return this._firstName;
    }

    get lastName() {
        return this._lastName;
    }

    get userName() {
        return this._userName;
    }

    get email() {
        return this._email;
    }

    get token() {
        return this._token;
    }

    /**
     *
     * @return {ApplicationUser}
     */
    static getApplicationUserFromStorage() {
        const currentUserRaw = localStorage.getItem(LocalStorageKeys.currentUser);
        if (!currentUserRaw)
            throw new Error("Please sign in first.");

        const currentUserParsed = JSON.parse(currentUserRaw);

        if (!currentUserParsed.hasOwnProperty("_id") ||
            !currentUserParsed.hasOwnProperty("_firstName") ||
            !currentUserParsed.hasOwnProperty("_lastName") ||
            !currentUserParsed.hasOwnProperty("_userName") ||
            !currentUserParsed.hasOwnProperty("_email") ||
            !currentUserParsed.hasOwnProperty("_token")
        )
            throw new Error("Stored current user is corrupted.");

        return new ApplicationUser(parseInt(currentUserParsed._id), currentUserParsed._firstName,
            currentUserParsed._lastName, currentUserParsed._userName, currentUserParsed._email, currentUserParsed._token);
    }
}