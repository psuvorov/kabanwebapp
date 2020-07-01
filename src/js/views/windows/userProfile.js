import {ApplicationUser} from "../../application/applicationUser";

export class UserProfile {


    /**
     *
     * @param {AuthService} authService
     */
    constructor(authService) {

        /**
         * @private
         * @readonly
         * @type {ApplicationUser}
         */
        this.applicationUser = ApplicationUser.getApplicationUserFromStorage();

        /**
         * @private
         * @readonly
         * @type {AuthService}
         */
        this.authService = authService;

        /**
         * @private
         * @type {HTMLElement}
         */
        this.userProfileWindowElem = null;

        /** @private */
        this.keydownEventHandler = null;

        this.initialize();
    }


    show() {
        this.userProfileWindowElem.classList.add("animated", "fadeIn");
        this.userProfileWindowElem.style.display = "block";
    }

    close() {
        this.userProfileWindowElem.style.display = "none";
        this.userProfileWindowElem.parentElement.remove(); // remove gray overlay as well

        document.removeEventListener("keydown", this.keydownEventHandler);
    }

    /**
     * @private
     */
    initialize() {
        this.initWindow();
        this.initElements();

    }

    /**
     * @private
     */
    initWindow() {
        this.userProfileWindowElem = document.createElement("div");
        this.userProfileWindowElem.classList.add("user-profile-window");
        this.userProfileWindowElem.innerHTML = `
            <div class="header">
                <div class="close-button"><i class="fas fa-times"></i></div>            
            </div>
            <div class="main-area">                
                <div class="content">
                    <div class="section">
                        <div class="main-info">
                            <div class="left-area">
                                <div class="avatar"></div>
                            </div>
                            <div class="right-area">
                                <div class="title">${this.applicationUser.firstName} ${this.applicationUser.lastName}</div>
                                <div class="username">@${this.applicationUser.username}</div>      
                                <div class="email">Available by <a class="link highlight" href="mailto:${this.applicationUser.email}">${this.applicationUser.email}</a></div>                          
                            </div>                            
                        </div>
                        <div class="about">Ut sodales sit amet turpis vel imperdiet. Etiam sed auctor massa. Pellentesque vel lorem eu ipsum semper luctus. Proin in viverra nisl, sit amet placerat nibh. Cras vitae mattis mi. Etiam pulvinar a mi at porttitor. Praesent vitae nibh mi. Nulla eu enim vel eros blandit porttitor. Suspendisse potenti. In ultricies orci ex, ac sodales nisl pretium ac.</div>
                    </div>
                </div>
                <div class="actions">
                    <div class="button change-password"><i class="fas fa-key"></i><span>Change password</span></div>
                    <div class="button user-avatar"><i class="fas fa-user-circle"></i><span>Set avatar</span></div>                    
                    <input id="user-avatar-file-input" type="file" name="user-avatar" style="display: none;" />
                    <div class="button participant"><i class="fas fa-cog"></i><span>Participant in</span></div>                    
                </div>
            </div>
        `;

        const windowOverlayElem = document.createElement("div");
        windowOverlayElem.classList.add("window-overlay");
        windowOverlayElem.append(this.userProfileWindowElem);

        document.body.append(windowOverlayElem);

    }

    /**
     * @private
     */
    initElements() {
        const closeButtonElem = this.userProfileWindowElem.querySelector(".close-button");
        closeButtonElem.addEventListener("click", (e) => {
            this.close();
        });

        this.keydownEventHandler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                this.close();
            }
        };
        document.addEventListener("keydown", this.keydownEventHandler);
    }



}