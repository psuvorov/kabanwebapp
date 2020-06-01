export class CardDto {

    /**
     * @param {string} id
     * @param {string} name
     * @param {string} description
     * @param {number} orderNumber
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
     * @param {string} name
     * @param {string} description
     * @param {number} orderNumber
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