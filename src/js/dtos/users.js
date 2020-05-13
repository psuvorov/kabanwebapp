
export class AuthenticateUserDto {

    /**
     *
     * @param {string} email
     * @param {string} password
     */
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

export class AuthenticatedUserDto {

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
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.token = token;
    }
}

