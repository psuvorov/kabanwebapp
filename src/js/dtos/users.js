
export class AuthenticateUserDto {

    /**
     *
     * @param {string} email
     * @param {string} password
     */
    constructor(email, password) {
        this._email = email;
        this._password = password;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
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
}

export class RegisterUserDto {

    /**
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} userName
     * @param {string} email
     * @param {string} password
     */
    constructor(firstName, lastName, userName, email, password) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
        this._email = email;
        this._password = password;
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

    get password() {
        return this._password;
    }

}

export class UpdateUserDto {

    /**
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} userName
     * @param {string} password
     */
    constructor(firstName, lastName, userName, password) {

        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
        this._password = password;
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

    get password() {
        return this._password;
    }
}

export class UserDto {

    /**
     *
     * @param {number} id
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} userName
     */
    constructor(id, firstName, lastName, userName) {

        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._userName = userName;
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

}
