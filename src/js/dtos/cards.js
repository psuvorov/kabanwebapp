export class CardDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {number} orderNumber
     * @param {string} listId
     */
    constructor(id, name, orderNumber, listId) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.listId = listId;
    }
}

export class CardDetailsDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {number} orderNumber
     * @param {string} listId
     * @param {string} listName
     * @param {string} created
     * @param {CardCommentDto[]} comments
     */
    constructor(id, name, description, orderNumber, listId, listName, created, comments) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.listId = listId;
        /** @readonly */
        this.listName = listName;
        /** @readonly */
        this.created = created;
        /** @readonly */
        this.comments = comments;
    }
}

export class CreateCardDto {

    /**
     * @param {string} name
     * @param {string} description
     * @param {number} orderNumber
     * @param {string} listId
     */
    constructor(name, description, orderNumber, listId) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.listId = listId;
    }

}

export class UpdateCardDto {

    /**
     * @param {string} id
     * @param {string | null} name
     * @param {string | null} description
     * @param {number | null} orderNumber
     * @param {string} listId
     */
    constructor(id, name, description, orderNumber, listId) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.description = description;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.listId = listId;
    }
}

export class RenumberCardDto {

    /**
     * @param {string} id
     * @param {number} orderNumber
     */
    constructor(id, orderNumber) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.orderNumber = orderNumber;
    }
}