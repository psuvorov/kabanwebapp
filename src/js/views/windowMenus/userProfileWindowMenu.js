import {ApplicationUser} from "../../application/applicationUser";
import {WindowMenu} from "../components/windowMenu";
import {AuthHelper} from "../helpers/AuthHelper";
import {UserProfile} from "../windows/userProfile";

export class UserProfileWindowMenu extends WindowMenu {

    /**
     *
     * @param {HTMLElement} callerElem
     * @param {UsersService} usersService
     */
    constructor(callerElem, usersService) {
        super(callerElem);

        /**
         * @private
         * @readonly
         */
        this.usersService = usersService;
    }

    initialize() {
        super.initialize();

        const user = ApplicationUser.getApplicationUserFromStorage();

        this.windowMenuElem.innerHTML = `
            <div class="user-profile-window-menu">
                <div class="user-info">
                    <div class="user-title">${user.firstName} ${user.lastName}</div>
                    <div class="user-username">@${user.username}</div>
                </div>
                <hr />
                <div class="menu-items">
                    <div class="edit-profile"><span class="highlight link">Edit profile</span></div>
                    <div class="sign-out"><span class="highlight link">Sign Out</span></div>
                </div>
            </div>`;

        this.setupInteractions();
    }

    setupInteractions() {
        super.setupInteractions();

        const editProfileLinkElem = this.windowMenuElem.querySelector(".edit-profile .link");
        const signOutLinkElem = this.windowMenuElem.querySelector(".sign-out .link");

        editProfileLinkElem.addEventListener("click", () => {
            this.close();
            new UserProfile(this.authService).show();
        });

        signOutLinkElem.addEventListener("click", () => {
            (new AuthHelper).signOut();
        });
    }
}