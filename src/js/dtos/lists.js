import {CardDto} from "./cards";

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

export class UpdateListDto {

    /**
     *
     * @param name
     * @param orderNumber
     */
    constructor(name, orderNumber) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;

    }
}

export class UpdateListOrderNumberDto {

    /**
     *
     * @param {string} listId
     * @param {number} orderNumber
     */
    constructor(listId, orderNumber) {
        /** @readonly */
        this.listId = listId;
        /** @readonly */
        this.orderNumber = orderNumber;
    }

}