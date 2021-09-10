import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";

export class CardsService {

    constructor() {
        /**
         * @private
         * @readonly
         * @type {any}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();

        this.endpointRootName = "cards";
    }

    /**
     *
     * @param {string} boardId
     * @param {string} cardId
     * @param onSuccess
     * @param onError
     */
    getCardDetails(boardId, cardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/get-card-details/${cardId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess({
                    id: res.id,
                    name: res.name,
                    description: res.description,
                    orderNumber: res.orderNumber,
                    listId: res.listId,
                    listName: res.listName,
                    created: res.created,
                    comments: res.comments
                });
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param onSuccess
     * @param onError
     */
    getArchivedCards(boardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/get-archived-cards`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                const cards = [];
                for (let i = 0; i < res.length; i++) {
                    cards.push({
                        id: res[i].id,
                        name: res[i].name,
                        listName: res[i].listName,
                        created: res[i].created,
                        archived: res[i].archived
                    });
                }
                onSuccess(cards);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {any} createCard
     * @param onSuccess
     * @param onError
     */
    createCard(boardId, createCard, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/create-card`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createCard)
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess({cardId: res.entityId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {any} createCardComment
     * @param onSuccess
     * @param onError
     */
    createCardComment(boardId, createCardComment, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/create-card-comment`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createCardComment)
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess({cardCommentId: res.entityId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param {string} cardId
     * @param {FormData} data
     * @param onSuccess
     * @param onError
     */
    setCardCover(boardId, cardId, data, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/set-card-cover/${cardId}`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token
            },
            body: data
        }).then(res => {
            if (res.status === 200 || res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess(res);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {any} updateCard
     * @param onSuccess
     * @param onError
     */
    updateCard(boardId, updateCard, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/update-card`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateCard)
        }).then(res => {
            if (res.status === 200) {
                return {};
            } else if (res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess();
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     * @param {string} boardId
     * @param {any[]} renumberedCards
     * @param onSuccess
     * @param onError
     */
    reorderCardsInList(boardId, renumberedCards, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/reorder-cards`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(renumberedCards)
        }).then(res => {
            if (res.status === 200) {
                return {};
            } else if (res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess();
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param {string} cardId
     * @param onSuccess
     * @param onError
     */
    deleteCard(boardId, cardId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/delete-card/${cardId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 204) {
                return {};
            } else if (res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess();
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param boardId
     * @param {string} cardCommentId
     * @param onSuccess
     * @param onError
     */
    deleteCardComment(boardId, cardCommentId, onSuccess, onError) {
        fetch(`${ServerBaseApiUrl}/${this.endpointRootName}/${boardId}/delete-card-comment/${cardCommentId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 204) {
                return {};
            } else if (res.status === 400) {
                return res.json();
            } else {
                throw new Error(res.status + " " + res.statusText);
            }
        }).then(res => {
            if (res.hasOwnProperty("message")) {
                onError(res.message);
            } else if (res.hasOwnProperty("title")) {
                onError(res.title);
            } else {
                onSuccess();
            }
        }).catch(error => {
            onError(error);
        });
    }
}