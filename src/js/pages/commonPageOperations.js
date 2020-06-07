import {
    ModalWindow,
    DialogTypes,
    ModalWindowElementType,
    ModalWindowElement,
    ModalWindowFactory
} from "../components/modalWindow";
import {ServerBaseApiUrl, LocalStorageKeys, ApplicationPageUrls} from "../constants";
import {AuthenticatedUserDto, AuthenticateUserDto, RegisterUserDto} from "../dtos/users";
import {ApplicationUser} from "../application/applicationUser";
import AuthService from "../services/authService";

export class CommonPageOperations {


    constructor() {
        /**
         * @private
         * @type {AuthService}
         */
        this.authService = new AuthService();


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
        const boardsListElem = rightItemsAreaElem.querySelector(".boards-list");
        const notificationsElem = rightItemsAreaElem.querySelector(".notifications");
        const profileElem = rightItemsAreaElem.querySelector(".profile");
        const signInLinkElem = rightItemsAreaElem.querySelector(".sign-in");
        const signUpLinkElem = rightItemsAreaElem.querySelector(".sign-up");
        const signOutLinkElem = rightItemsAreaElem.querySelector(".sign-out");


        boardsListElem.addEventListener("click", () => {
            location.href = "/dashboard.html";
        });



        notificationsElem.addEventListener("click", () => {

        });

        profileElem.addEventListener("click", () => {

        });

        signInLinkElem.addEventListener("click", () => {

            /** @type ModalWindow */
            let modalWindow = null;

            const callbacks = [

                /**
                 *
                 * @param {string} serializedFormData
                 */
                (serializedFormData) => {
                    // Ok pressed

                    const authenticateUserDtoRaw = JSON.parse(serializedFormData);
                    /** @type AuthenticateUserDto */
                    const authenticateUserDto = new AuthenticateUserDto(authenticateUserDtoRaw.email, authenticateUserDtoRaw.password);

                    this.authService.authenticate(authenticateUserDto, (authenticatedUserDto) => {
                        const applicationUser = ApplicationUser.fromAuthenticatedUserDto(authenticatedUserDto);
                        localStorage.setItem(LocalStorageKeys.currentUser, JSON.stringify(applicationUser));
                        window.location = ApplicationPageUrls.dashboardPage;

                        modalWindow.close();

                    }, (error) => {
                        console.error(error);
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of signing in. Reason: ${error}`);
                    });
                },
                () => {
                    // Cancel pressed
                    modalWindow.close();
                }
            ];

            const windowElements = [
                new ModalWindowElement(ModalWindowElementType.Input, "email", "Email", ""),
                new ModalWindowElement(ModalWindowElementType.PasswordInput, "password", "Password", "")
            ];

            modalWindow = new ModalWindow("Sign In", DialogTypes.OkCancel, callbacks, windowElements);
            modalWindow.show();

        });

        signUpLinkElem.addEventListener("click", () => {

            /** @type ModalWindow */
            let modalWindow = null;

            const callbacks = [
                /**
                 * @param {string} serializedFormData
                 */
                (serializedFormData) => {
                    // Ok pressed

                    const registerUserDtoRaw = JSON.parse(serializedFormData);
                    /** @type RegisterUserDto */
                    const registerUserDto = new RegisterUserDto(registerUserDtoRaw.firstName, registerUserDtoRaw.lastName,
                        registerUserDtoRaw.username, registerUserDtoRaw.email, registerUserDtoRaw.password);

                    this.authService.register(registerUserDto, (userId) => {
                        modalWindow.close();
                        ModalWindowFactory.showInfoOkMessage("User created", "User has been successfully created");

                    }, (error) => {
                        console.error(error);
                        modalWindow.close();
                        ModalWindowFactory.showErrorOkMessage("Error occurred", `Error of signing up. Reason: ${error}`);
                    });

                },
                () => {
                    // Cancel pressed
                    modalWindow.close();
                }
            ];

            const windowElements = [
                new ModalWindowElement(ModalWindowElementType.Input, "firstName", "FirstName", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "lastName", "LastName", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "username", "Username", ""),
                new ModalWindowElement(ModalWindowElementType.Input, "email", "Email", ""),
                new ModalWindowElement(ModalWindowElementType.PasswordInput, "password", "Password", "")
            ];

            modalWindow = new ModalWindow("Sign Up", DialogTypes.OkCancel, callbacks, windowElements);
            modalWindow.show();
        });

        signOutLinkElem.addEventListener("click", () => {
            localStorage.removeItem(LocalStorageKeys.currentUser);
            location.href = "/";
        });


    }

    /**
     * @private
     */
    setupTopElementsVisibility() {
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
    }




}

