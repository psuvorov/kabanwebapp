import {ApplicationUser} from "../../application/applicationUser";
import {AuthenticateUserDto, UpdateUserDto} from "../../dtos/users";
import {ApplicationPageUrls, LocalStorageKeys} from "../../constants";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";

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
        this.userProfileWindowElem.style.display = "flex";
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
        this.userProfileWindowElem.classList.add("base-window", "user-profile-window");
        this.userProfileWindowElem.innerHTML = `
            <div class="left-area">
                <div class="section">
                    <div class="icon-area">
                        <div class="icon"></div>
                    </div>
                    <div class="content-area">
                        <div class="content">
                            <div class="avatar"></div>
                            <div class="title">${this.applicationUser.firstName} ${this.applicationUser.lastName}</div>
                            <div class="username">@${this.applicationUser.username}</div>      
                            <div class="email">Available by <a class="link highlight" href="mailto:${this.applicationUser.email}">${this.applicationUser.email}</a></div> 
                            <div class="about">Ut sodales sit amet turpis vel imperdiet. Etiam sed auctor massa. Pellentesque vel lorem eu ipsum semper luctus. Proin in viverra nisl, sit amet placerat nibh. Cras vitae mattis mi. Etiam pulvinar a mi at porttitor. Praesent vitae nibh mi. Nulla eu enim vel eros blandit porttitor. Suspendisse potenti. In ultricies orci ex, ac sodales nisl pretium ac.</div>                         
                        </div>
                    </div>
                </div>
            </div>
            <div class="right-area">
                <div class="close-button"><i class="fas fa-times"></i></div>
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

        const changePasswordElem = this.userProfileWindowElem.querySelector(".change-password");
        changePasswordElem.addEventListener("click", () => {

            /** @type ModalWindow */
            let modalWindow = null;

            const callbacks = [

                /**
                 *
                 * @param {string} serializedFormData
                 */
                    (serializedFormData) => {
                    // Ok pressed

                    const updateUserDtoRaw = JSON.parse(serializedFormData);
                    if (updateUserDtoRaw.newPassword !== "" && updateUserDtoRaw.newPassword !== updateUserDtoRaw.newPasswordAgain) {
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of changing password. Reason: You didn't input equal passwords twice.`);
                        return;
                    }

                    const applicationUser = ApplicationUser.getApplicationUserFromStorage();

                    /** @type UpdateUserDto */
                    const updateUserDto = new UpdateUserDto(applicationUser.id, null, null, updateUserDtoRaw.currentPassword, updateUserDtoRaw.newPassword);

                    this.authService.updateUser(updateUserDto,
                        () => {
                        ModalWindowFactory.showInfoOkMessage("Success", "Password has been changed");
                        modalWindow.close();
                    }, (error) => {
                        console.error(error);
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of changing password. Reason: ${error}`);
                    });
                },
                () => {
                    // Cancel pressed
                    modalWindow.close();
                }
            ];

            const windowElements = [
                ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.PasswordInput, "currentPassword", "Current password", ""),
                ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.PasswordInput, "newPassword", "New password", ""),
                ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.PasswordInput, "newPasswordAgain", "New password again", "")
            ];

            modalWindow = new ModalWindow("Change password", DialogTypes.OkCancel, callbacks, windowElements);
            modalWindow.show();
        });

        const userAvatarElem = this.userProfileWindowElem.querySelector(".user-avatar");
        userAvatarElem.addEventListener("click", () => {
            console.log("set avatar");
        });

        const participantElem = this.userProfileWindowElem.querySelector(".participant");
        participantElem.addEventListener("click", () => {
            console.log("participant");
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