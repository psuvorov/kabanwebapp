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
     * @param {string} boardId
     * @param {CardDto[]} cards
     */
    constructor(id, name, orderNumber, boardId, cards) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;
        /** @readonly */
        this.boardId = boardId;
        /** @readonly */
        this.cards = cards;
    }

}

export class UpdateListDto {

    constructor(name, orderNumber) {
        /** @readonly */
        this.name = name;
        /** @readonly */
        this.orderNumber = orderNumber;

    }
}