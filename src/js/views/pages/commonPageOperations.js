import {
    ModalWindow,
    DialogTypes,
    ModalWindowElementTypes,
    ModalWindowElement,
    ModalWindowFactory
} from "../components/modalWindow";
import {ServerBaseApiUrl, LocalStorageKeys, ApplicationPageUrls} from "../../constants";
import {AuthenticatedUserDto, AuthenticateUserDto, RegisterUserDto} from "../../dtos/users";
import {ApplicationUser} from "../../application/applicationUser";
import AuthService from "../../services/authService";
import {PopupMenu, PopupMenuItem} from "../components/popupMenu";
import {UpdateCardDto} from "../../dtos/cards";
import {WindowMenu} from "../components/windowMenu";
import {BoardsWindowMenu} from "../windowMenus/boardsWindowMenu";
import KabanBoardService from "../../services/kabanBoardService";
import {UserProfileWindowMenu} from "../windowMenus/userProfileWindowMenu";
import {NotificationsWindowMenu} from "../windowMenus/notificationsWindowMenu";
import {AuthHelper} from "../helpers/AuthHelper";

export class CommonPageOperations {


    constructor(pages) {
        /**
         * @private
         * @type {AuthService}
         */
        this.authService = new AuthService();

        /**
         * @private
         * @type {KabanBoardService}
         */
        this.kabanBoardService = new KabanBoardService();

        this.pages = pages;


    }

    initialize() {
        this.initTopLeftItems();
        this.initTopRightItems();


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
        this.setupTopElementsVisibility();

        // --- Attach event handlers ---
        const rightItemsAreaElem = document.querySelector(".right-items-area");

        /** @type HTMLElement */
        const boardsListElem = rightItemsAreaElem.querySelector(".boards-list");

        /** @type HTMLElement */
        const notificationsElem = rightItemsAreaElem.querySelector(".notifications");

        /** @type HTMLElement */
        const profileElem = rightItemsAreaElem.querySelector(".profile");

        const signInLinkElem = rightItemsAreaElem.querySelector(".sign-in");
        const signUpLinkElem = rightItemsAreaElem.querySelector(".sign-up");

        signInLinkElem.addEventListener("click", () => {
            AuthHelper.signIn(this.authService);
        });

        signUpLinkElem.addEventListener("click", () => {
            AuthHelper.signUp(this.authService);
        });

        boardsListElem.addEventListener("click", () => {
            const windowMenu = new BoardsWindowMenu(boardsListElem, this.kabanBoardService, this.pages.dashboardPage);
            windowMenu.show();
        });

        notificationsElem.addEventListener("click", () => {
            const windowMenu = new NotificationsWindowMenu(notificationsElem, this.kabanBoardService);
            windowMenu.show();
        });

        profileElem.addEventListener("click", () => {
            const windowMenu = new UserProfileWindowMenu(profileElem, this.kabanBoardService);
            windowMenu.show();
        });
    }

    /**
     * @private
     */
    setupTopElementsVisibility() {
        const rightItemsAreaElem = document.querySelector(".right-items-area");
        const authWrapperElem = rightItemsAreaElem.querySelector(".auth-wrapper");
        const userAreaElem = rightItemsAreaElem.querySelector(".user-area");

        const applicationUser = ApplicationUser.getApplicationUserFromStorage();
        if (!applicationUser) {
            authWrapperElem.classList.remove("hidden");
            userAreaElem.classList.add("hidden");
        } else {
            authWrapperElem.classList.add("hidden");
            userAreaElem.classList.remove("hidden");
        }
    }




}

