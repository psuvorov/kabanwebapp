export class BoardDto {

    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {number} userId
     */
    constructor(id, name, description, userId) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._userId = userId;
    }


    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get userId() {
        return this._userId;
    }
}