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
     * @param {UsersService} usersService
     */
    signUp(usersService) {
        /** @type ModalWindow */
        let modalWindow = null;

        const callbacks = [
            /**
             * @param {string} serializedFormData
             */
                (serializedFormData) => {
                // Ok pressed

                const registerUserDtoRaw = JSON.parse(serializedFormData);

                usersService.register({
                    firstName: registerUserDtoRaw.firstName,
                    lastName: registerUserDtoRaw.lastName,
                    username: registerUserDtoRaw.username,
                    email: registerUserDtoRaw.email,
                    password: registerUserDtoRaw.password
                }, (userId) => {
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
     * @param {UsersService} usersService
     */
    signIn(usersService) {
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

                usersService.authenticate({
                    email: authenticateUserDtoRaw.email,
                    password: authenticateUserDtoRaw.password
                }, (authenticatedUserDto) => {
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