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
import {AuthHelper} from "../helpers/AuthHelper";

export class UserProfileWindowMenu extends WindowMenu {

    /**
     *
     * @param {HTMLElement} callerElem
     * @param {KabanBoardService} kabanBoardService
     */
    constructor(callerElem, kabanBoardService) {
        super(callerElem, kabanBoardService);

        /**
         * @private
         * @type {AuthService}
         */
        this.authService = new AuthService();

    }


    initialize() {
        super.initialize();

        this.windowMenuElem.innerHTML = `
            <div class="user-profile--window-menu">
                
                
                <div class="sign-out"><span class="highlight link">Sign Out</span></div>
            </div>`;
    }

    setupInteractions() {
        super.setupInteractions();


        const signOutLinkElem = this.windowMenuElem.querySelector(".sign-out .link");


        signOutLinkElem.addEventListener("click", () => {
            AuthHelper.signOut();
        });

    }

}