import {ApplicationUser} from "../application/applicationUser";
import {ServerBaseApiUrl} from "../constants";
import {BoardDetailsDto, BoardDto, BoardShortInfoDto} from "../dtos/boards";
import {ListDto} from "../dtos/lists";
import {CardDetailsDto} from "../dtos/cards";

export default class KabanBoardService {

    constructor() {
        /**
         * @private
         * @readonly
         * @type {ApplicationUser}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();
    }

    /**
     * @param {function} onSuccess
     * @param {function} onError
     */
    getAllUserBoards(onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/dashboard/get-all-user-boards`, {
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
                const boards = [];
                for (let i = 0; i < res.length; i++) {
                    const board = new BoardShortInfoDto(res[i].id, res[i].name, res[i].description, res[i].wallpaperPreviewPath);
                    boards.push(board);
                }
                onSuccess(boards);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} boardId
     * @param {function} onSuccess
     * @param {function} onError
     */
    getBoard(boardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/get-board?boardId=${boardId}`, {
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
                const board = new BoardDto(res.id, res.name, res.description, res.wallpaperPath, res.lists, parseInt(res.userId));
                onSuccess(board);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} listId
     * @param {string} boardId
     * @param onSuccess
     * @param onError
     */
    getList(listId, boardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/get-list?listId=${listId}&boardId=${boardId}`, {
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
                const list = new ListDto(res.id, res.name, parseInt(res.orderNumber), res.cards);
                onSuccess(list);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {string} cardId
     * @param {string} boardId
     * @param onSuccess
     * @param onError
     */
    getCardDetails(cardId, boardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/get-card-details?cardId=${cardId}&boardId=${boardId}`, {
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
                const cardDetails = new CardDetailsDto(res.id, res.name, res.description, res.orderNumber, res.listId, res.listName, res.created, res.comments);
                onSuccess(cardDetails);
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
    getBoardDetails(boardId, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/get-board-details?boardId=${boardId}`, {
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
                const boardDetailsDto = new BoardDetailsDto(res.id, res.name, res.description, res.author, res.participants, res.created, res.lastModified);
                onSuccess(boardDetailsDto);
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateBoardDto} createBoardDto
     * @param {function} onSuccess
     * @param {function} onError
     */
    createBoard(createBoardDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/dashboard/create-board`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createBoardDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
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
                onSuccess({boardId: res.boardId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateListDto} createListDto
     * @param onSuccess
     * @param onError
     */
    createList(createListDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/create-list`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createListDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
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
                onSuccess({listId: res.listId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CopyListDto} copyListDto
     * @param onSuccess
     * @param onError
     */
    copyList(copyListDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/copy-list`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(copyListDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
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
                onSuccess({listId: res.listId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateCardDto} createCardDto
     * @param onSuccess
     * @param onError
     */
    createCard(createCardDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/create-card`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createCardDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
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
                onSuccess({cardId: res.cardId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {CreateCardCommentDto} createCardCommentDto
     * @param onSuccess
     * @param onError
     */
    createCardComment(createCardCommentDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/create-card-comment`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(createCardCommentDto)
        }).then(res => {
            if (res.status === 201 || res.status === 400) {
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
                onSuccess({cardCommentId: res.cardCommentId});
            }
        }).catch(error => {
            onError(error);
        });
    }

    /**
     *
     * @param {UpdateBoardDto} updateBoardDto
     * @param onSuccess
     * @param onError
     */
    updateBoardInfo(updateBoardDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/update-board-info`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateBoardDto)
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
     * @param {UpdateListDto} updateListDto
     * @param onSuccess
     * @param onError
     */
    updateList(updateListDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/update-list`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateListDto)
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
     * @param {UpdateCardDto} updateCardDto
     * @param onSuccess
     * @param onError
     */
    updateCard(updateCardDto, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/update-card`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateCardDto)
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
     * @param {RenumberListDto[]} renumberedLists
     * @param onSuccess
     * @param onError
     */
    renumberAllLists(boardId, renumberedLists, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/renumber-all-lists?boardId=${boardId}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + this.applicationUser.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(renumberedLists)
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
     * @param {RenumberCardDto[]} renumberedCards
     * @param onSuccess
     * @param onError
     */
    renumberAllCardsInList(boardId, renumberedCards, onSuccess, onError) {
        fetch(ServerBaseApiUrl + `/boardpage/renumber-all-cards?boardId=${boardId}`, {
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

    deleteBoard() {

    }

    deleteList() {

    }

    deleteCard() {

    }

}