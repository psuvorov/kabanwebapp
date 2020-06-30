import {AuthenticateUserDto, RegisterUserDto} from "../../dtos/users";
import {
    DialogTypes,
    ModalWindow,
    ModalWindowElement,
    ModalWindowElementTypes,
    ModalWindowFactory
} from "../components/modalWindow";
import {ApplicationUser} from "../../application/applicationUser";
import {ApplicationPageUrls, LocalStorageKeys} from "../../constants";

export class AuthHelper {

    /**
     *
     * @param {AuthService} authService
     */
    signUp(authService) {
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

                authService.register(registerUserDto, (userId) => {
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
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "firstName", "FirstName", ""),
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "lastName", "LastName", ""),
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "username", "Username", ""),
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "email", "Email", ""),
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.PasswordInput, "password", "Password", "")
        ];

        modalWindow = new ModalWindow("Sign Up", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }

    /**
     *
     * @param {AuthService} authService
     */
    signIn(authService) {
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

                authService.authenticate(authenticateUserDto, (authenticatedUserDto) => {
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
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.Input, "email", "Email", ""),
            ModalWindowElement.initPrimitiveElement(ModalWindowElementTypes.PasswordInput, "password", "Password", "")
        ];

        modalWindow = new ModalWindow("Sign In", DialogTypes.OkCancel, callbacks, windowElements);
        modalWindow.show();
    }

    signOut() {
        ApplicationUser.signOut();
    }

}