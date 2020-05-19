export class BoardDto {
    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {number} userId
     */
    constructor(id, name, description, userId, listsTotal, cardsTotal, filesAttachedTotal, tagsTotal) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.userId = userId;
        /** @readonly */
        this.listsTotal = listsTotal;
        /** @readonly */
        this.cardsTotal = cardsTotal;
        /** @readonly */
        this.filesAttachedTotal = filesAttachedTotal;
        /** @readonly */
        this.tagsTotal = tagsTotal;

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