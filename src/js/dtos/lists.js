import {CardDto} from "./cards";

export class ListDto {

    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {number} orderNumber
     * @param {CardDto[]} cards
     */
    constructor(id, name, orderNumber, cards) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.cards = cards;
    }

}

export class CreateListDto {

    /**
     *
     * @param {string} name
     * @param {number} orderNumber
     * @param {string} boardId
     */
    constructor(name, orderNumber, boardId) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.boardId = boardId;
    }
}

export class UpdateListDto {

    /**
     * @param {string} id
     * @param {string | null} name
     * @param {number | null} orderNumber
     * @param {boolean | null} isArchived
     */
    constructor(id, name, orderNumber, isArchived) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.isArchived = isArchived;
    }
}

export class RenumberListDto {

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

export class CopyListDto {

    /**
     * @param {string} id
     * @param {string} boardId
     */
    constructor(id, boardId) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.boardId = boardId;
    }

}

export class ArchivedListDto {

    /**
     *
     * @param {string} id
     * @param {string} name
     * @param {string} created
     * @param {string} archived
     */
    constructor(id, name, created, archived) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.created = created;
        /** @readonly */
        this.archived = archived;
    }

}