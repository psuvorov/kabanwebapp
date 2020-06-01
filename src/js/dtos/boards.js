/**
 * Contains only dashboard page related data.
 */
export class BoardInfoDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} description
     */
    constructor(id, name, description) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
    }

}

/**
 * Contains full almost full information on specific board
 * (Comments are not included).
 */
export class BoardDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {ListDto[]} lists
     * @param {number} userId
     */
    constructor(id, name, description, lists, userId) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.lists = lists;
        /** @readonly */
        this.userId = userId;
    }
}

export class CreateBoardDto {

    /**
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
     * @param {string} id
     * @param {string} name
     * @param {string} description
     */
    constructor(id, name, description) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
    }
}