import {AuthenticateUserDto, AuthenticatedUserDto} from "../dtos/users";

export default class AuthService {

    constructor() {
        /**
         * Server address
         * @type {string}
         * @readonly
         */
        this.serverAddress = "https://";
    }

    /**
     *
     * @param {AuthenticateUserDto} authenticateUserDto
     */
    async authenticate(authenticateUserDto) {




        const response = await fetch(this.serverAddress + "/users/authenticate", {
            method: "POST",
            body: JSON.stringify({username, password})
        });


    }


}