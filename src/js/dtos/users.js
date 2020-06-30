
export class AuthenticateUserDto {

    /**
     * @param {string} email
     * @param {string} password
     */
    constructor(email, password) {
        /** @readonly */
        this.Email = email;
        /** @readonly */
        this.Password = password;
    }
}

export class AuthenticatedUserDto {

    /**
     *
     * @param {string} id
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

}

export class RegisterUserDto {

    /**
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} username
     * @param {string} email
     * @param {string} password
     */
    constructor(firstName, lastName, username, email, password) {
        /** @readonly */
        this.firstName = firstName;
        /** @readonly */
        this.lastName = lastName;
        /** @readonly */
        this.username = username;
        /** @readonly */
        this.email = email;
        /** @readonly */
        this.password = password;
    }

}

export class UpdateUserDto {

    /**
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} username
     * @param {string} password
     */
    constructor(firstName, lastName, username, password) {
        /** @readonly */
        this.firstName = firstName;
        /** @readonly */
        this.lastName = lastName;
        /** @readonly */
        this.username = username;
        /** @readonly */
        this.password = password;
    }
}

export class UserDto {

    /**
     *
     * @param {string} id
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} username
     */
    constructor(id, firstName, lastName, username) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.firstName = firstName;
        /** @readonly */
        this.lastName = lastName;
        /** @readonly */
        this.username = username;
    }

}
