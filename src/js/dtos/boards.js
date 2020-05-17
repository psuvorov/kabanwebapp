export class BoardDto {

    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {number} userId
     */
    constructor(id, name, description, userId) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.userId = userId;
    }
}

export class CreateBoardDto {

    /**
     *
     * @param {string} name
     * @param {string} description
     */
    constructor(name, description) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
    }
}

export class UpdateBoardDto {

    /**
     *
     * @param {string} name
     * @param {string} description
     */
    constructor(name, description) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
    }
}