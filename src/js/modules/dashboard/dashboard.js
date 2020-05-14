import {LocalStorageKeys, ServerBaseApiUrl} from "../../helper";
import {ApplicationUser} from "../../application/applicationUser";
import {AuthenticatedUserDto} from "../../dtos/users";
import {BoardDto} from "../../dtos/boards";

const dashboard = () => {

    if (!localStorage.getItem(LocalStorageKeys.currentUser)) {
        window.location = "/";
        return;
    }

    /**
     * @type {ApplicationUser}
     */
    const applicationUser = ApplicationUser.getApplicationUserFromStorage();

    const authWrapperElem = document.querySelector(".auth-wrapper");
    authWrapperElem.classList.add("hidden");

    const userAreaElem = document.querySelector(".user-area");
    userAreaElem.classList.remove("hidden");


    const getUserBoards = (userId) => {
        const userBoards = [];

        fetch(ServerBaseApiUrl + `/users/${userId}/boards/`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + applicationUser.token,
                "Content-Type": "application/json"
            },
        })
            .then(res => {
                if (res.status === 200 || res.status === 400) {
                    return res.json();
                } else {
                    throw new Error(res.status + " " + res.statusText);
                }
            })
            .then(res => {
                if (res.hasOwnProperty("message")) {
                    console.log(res.message);
                } else {
                    for (let i = 0; i < res.length; i++) {
                        const board = new BoardDto(res[i].id, res[i].name, res[i].description, parseInt(res[i].userId));
                        userBoards.push(board);
                    }


                    //userBoards.push(board);
                    initBoardsList();



                }
            })
            .catch(error => {
                // TODO: simple pass the error as is
                //operationCallback({error: error});
                console.log(error);
            });

        return userBoards;
    };
    const boards = getUserBoards(applicationUser.id);

    const initBoardsList = () => {
        const boardsContainerElem = document.querySelector(".boards-container");

        boards.forEach(board => {
            const boardItemElem = document.createElement("div");
            boardItemElem.classList.add("board-item");
            boardItemElem.setAttribute("data-board-id", `${board.id}`);
            boardItemElem.innerHTML = `
                <div class="title">
                    <span>${board.name}</span>
                </div>
                <div class="description">
                    ${board.description}
                </div>
            `;

            boardItemElem.addEventListener("click", () => {
                window.location = `/board.html?board_id=${board.id}`;
            });

            boardsContainerElem.append(boardItemElem);
        });

    };





};

export default dashboard;