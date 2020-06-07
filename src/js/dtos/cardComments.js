export class CardCommentDto {

    /**
     *
     * @param {string} id
     * @param {string} userName
     * @param {string} text
     * @param {string} created
     */
    constructor(id, userName, text, created) {
        /** @readonly */
        this.id = id;
        /** @readonly */
        this.userName = userName;
        /** @readonly */
        this.text = text;
        /** @readonly */
        this.created = created;
    }
}

export class CreateCardCommentDto {

    /**
     * @param {string} text
     * @param {string} cardId
     */
    constructor(text, cardId) {
        /** @readonly */
        this.text = text;
        /** @readonly */
        this.cardId = cardId;
    }

}