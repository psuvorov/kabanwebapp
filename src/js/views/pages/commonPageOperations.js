import {ApplicationUser} from "../../application/applicationUser";
import UsersService from "../../services/usersService";
import {BoardsWindowMenu} from "../windowMenus/boardsWindowMenu";
import {UserProfileWindowMenu} from "../windowMenus/userProfileWindowMenu";
import {NotificationsWindowMenu} from "../windowMenus/notificationsWindowMenu";
import {AuthHelper} from "../helpers/AuthHelper";
import {DashboardsService} from "../../services/dashboardsService";
import BoardsService from "../../services/boardsService";

export class CommonPageOperations {

    constructor(pages) {
        /**
         * @private
         * @type {UsersService}
         */
        this.authService = new UsersService();

        /**
         * @private
         * @type {DashboardsService}
         */
        this.dashboardsService = new DashboardsService();

        /**
         * @private
         * @type {BoardsService}
         */
        this.boardsService = new BoardsService();

        /**
         * @private
         * @type {UsersService}
         */
        this.usersService = new UsersService();

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
            (new AuthHelper).signIn(this.authService);
        });

        signUpLinkElem.addEventListener("click", () => {
            (new AuthHelper).signUp(this.authService);
        });

        boardsListElem.addEventListener("click", () => {
            const windowMenu = new BoardsWindowMenu(boardsListElem, this.dashboardsService, this.boardsService, this.pages.dashboardPage);
            windowMenu.initialize();
            windowMenu.show();
        });

        notificationsElem.addEventListener("click", () => {
            const windowMenu = new NotificationsWindowMenu(notificationsElem);
            windowMenu.initialize();
            windowMenu.show();
        });

        profileElem.addEventListener("click", () => {
            const windowMenu = new UserProfileWindowMenu(profileElem, this.usersService);
            windowMenu.initialize();
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

