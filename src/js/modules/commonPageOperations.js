import {ModalWindow, DialogTypes, ModalWindowElementType, ModalWindowElement} from "./modalWindow";
import {ServerBaseApiUrl, LocalStorageKeys, ApplicationPageUrls} from "../constants";
import {AuthenticatedUserDto, AuthenticateUserDto} from "../dtos/users";
import BoardService from "../services/boardService";
import {CreateBoardDto} from "../dtos/boards";
import {ApplicationUser} from "../application/applicationUser";
import AuthService from "../services/authService";

export class CommonPageOperations {


    constructor() {
        /**
         * @private
         * @type {AuthService}
         */
        this.authService = new AuthService();

        /**
         * @private
         * @type {BoardService}
         */
        this.boardService = new BoardService();
    }

    /**
     * @private
     */
    initTopLeftItems() {
        const leftItemsAreaElem = document.querySelector(".left-items-area");
        leftItemsAreaElem.addEventListener("click", () => {
            location.href = "/"
        });
    }

    /**
     * @private
     */
    initTopRightItems() {
        // --- Set visibility of specific elements ---

        const rightItemsAreaElem = document.querySelector(".right-items-area");
        const authWrapperElem = rightItemsAreaElem.querySelector(".auth-wrapper");
        const userAreaElem = rightItemsAreaElem.querySelector(".user-area");

        if (window.location.pathname === "/" || window.location.pathname.startsWith("/board.html")) {
            userAreaElem.querySelector(".create-board").classList.add("hidden");
        } else if (window.location.pathname.startsWith("/dashboard.html")) {
            userAreaElem.querySelector(".boards-list").classList.add("hidden");
        }

        const applicationUser = ApplicationUser.getApplicationUserFromStorage();
        if (!applicationUser) {
            authWrapperElem.classList.remove("hidden");
            userAreaElem.classList.add("hidden");
        } else {
            authWrapperElem.classList.add("hidden");
            userAreaElem.classList.remove("hidden");
        }


        // --- Attach event handlers ---

        const boardsListElem = rightItemsAreaElem.querySelector(".boards-list");
        const createBoardElem = rightItemsAreaElem.querySelector(".create-board");
        const notificationsElem = rightItemsAreaElem.querySelector(".notifications");
        const profileElem = rightItemsAreaElem.querySelector(".profile");
        const signInLinkElem = rightItemsAreaElem.querySelector(".sign-in");
        const signUpLinkElem = rightItemsAreaElem.querySelector(".sign-up");
        const signOutLinkElem = rightItemsAreaElem.querySelector(".sign-out");


        boardsListElem.addEventListener("click", () => {
            location.href = "/dashboard.html";
        });

        createBoardElem.addEventListener("click", () => {

            const callbacks = [
                (gatheredElementsData, operationCallback) => {
                    // Ok pressed

                    this.boardService.createBoard(gatheredElementsData,
                        () => {
                            operationCallback(); // Simply close the dialog
                            window.location.reload();
                        },
                        (error) => {
                            operationCallback({error: error});
                        });
                },
                () => {
                    // Cancel pressed

                }
            ];

            const windowElements = [
                new ModalWindowElement(ModalWindowElementType.Input, "name", "Board name", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "description", "Board description", "")
            ];

            new ModalWindow("Create new board", DialogTypes.OkCancel, callbacks, windowElements).show();

        });

        notificationsElem.addEventListener("click", () => {

        });

        profileElem.addEventListener("click", () => {

        });

        signInLinkElem.addEventListener("click", () => {

            const callbacks = [

                (gatheredElementsData, operationCallback) => {
                    // Ok pressed

                    this.authService.authenticate(gatheredElementsData, (authenticatedUserDto) => {
                        const applicationUser = ApplicationUser.fromAuthenticatedUserDto(authenticatedUserDto);
                        localStorage.setItem(LocalStorageKeys.currentUser, JSON.stringify(applicationUser));

                        operationCallback(); // Simply close the dialog
                        window.location = ApplicationPageUrls.dashboardPage;

                    }, (error) => {
                        operationCallback({error: error});
                    });
                },
                () => {
                    // Cancel pressed

                }
            ];

            const windowElements = [
                new ModalWindowElement(ModalWindowElementType.Input, "email", "Email", ""),
                new ModalWindowElement(ModalWindowElementType.PasswordInput, "password", "Password", "")
            ];

            new ModalWindow("Sign In", DialogTypes.OkCancel, callbacks, windowElements).show();

        });

        signUpLinkElem.addEventListener("click", () => {

            const callbacks = [
                (gatheredElementsData, operationCallback) => {
                    // Ok pressed

                    this.authService.register(gatheredElementsData, (userId) => {
                        operationCallback({message: "User has been successfully created"});
                    }, (error) => {
                        operationCallback({error: error});
                    });

                },
                () => {
                    // Cancel pressed

                }
            ];

            const windowElements = [
                new ModalWindowElement(ModalWindowElementType.Input, "FirstName", "FirstName", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "LastName", "LastName", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "Username", "Username", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "Email", "Email", ""),
                new ModalWindowElement(ModalWindowElementType.PasswordInput, "Password", "Password", "")
            ];

            new ModalWindow("Sign Up", DialogTypes.OkCancel, callbacks, windowElements).show();
        });

        signOutLinkElem.addEventListener("click", () => {
            localStorage.removeItem(LocalStorageKeys.currentUser);
            location.href = "/";
        });


    }


    initialize() {
        this.initTopLeftItems();
        this.initTopRightItems();


    }

}

