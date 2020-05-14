import {ModalWindow, DialogTypes, ModalWindowElementType, ModalWindowElement} from "./modalWindow";
import {ServerBaseApiUrl, LocalStorageKeys} from "../helper";
import {AuthenticatedUserDto} from "../dtos/users";

const common = () => {

    const leftItemsAreaElem = document.querySelector(".left-items-area");
    leftItemsAreaElem.addEventListener("click", () => location.href = "/");

    const rightItemsAreaElem = document.querySelector(".right-items-area");


    const signInLinkElem = rightItemsAreaElem.querySelector(".sign-in");

    const signUpLinkElem = rightItemsAreaElem.querySelector(".sign-up");

    signInLinkElem.addEventListener("click", () => {
        /**
         *
         * @type {(function(...[*]=))[]}
         */
        const callbacks = [

            (gatheredElementsData, operationCallback) => {
                // Ok pressed

                fetch(ServerBaseApiUrl + "/users/authenticate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: gatheredElementsData
                })
                    .then(res => {
                        if (res.status === 200 || res.status === 400) {
                            return res.json();
                        } else {
                            throw new Error(res.status + " " + res.statusText);
                        }
                    })
                    .then(res => {
                        if (res.hasOwnProperty("message")) {
                            operationCallback({error: res.message});
                        } else {
                            const currentUser = new AuthenticatedUserDto(parseInt(res.id), res.firstName, res.lastName, res.userName, res.email, res.token);

                            // Set current user
                            localStorage.setItem(LocalStorageKeys.currentUser, JSON.stringify(currentUser));
                            operationCallback({});
                            console.log("Successfully signed in");

                            userSignedIn();
                        }
                    })
                    .catch(error => {
                        // TODO: simple pass the error as is
                        operationCallback({error: error});
                    });

            },
            () => {
                // Cancel pressed

            }
        ];

        /**
         * @type {ModalWindowElement[]}
         */
        const windowElements = [];
        windowElements.push(new ModalWindowElement(ModalWindowElementType.Input, "Email", "Email"));
        windowElements.push(new ModalWindowElement(ModalWindowElementType.PasswordInput, "Password", "Password"));
        new ModalWindow("Sign In", DialogTypes.OkCancel, callbacks, windowElements).show();

    });

    const userSignedIn = () => {
        window.location = "/dashboard.html";



    };

    signUpLinkElem.addEventListener("click", () => {
        /**
         *
         * @type {(function(...[*]=))[]}
         */
        const callbacks = [
            (gatheredElementsData, operationCallback) => {
                // Ok pressed

                fetch(ServerBaseApiUrl + "/users/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: gatheredElementsData
                })
                    .then(res => {
                        if (res.status === 201 || res.status === 400) {
                            return res.json();
                        } else {
                            throw new Error();
                        }
                    })
                    .then(res => {
                        if (res.hasOwnProperty("message")) {
                            operationCallback({error: res.message});
                        } else {
                            operationCallback({});
                            console.log("Successfully signed up");
                        }
                    })
                    .catch(error => {
                        // TODO: simple pass the error as is
                        operationCallback({error: error});
                    });


            },
            () => {
                // Cancel pressed

            }
        ];

        /**
         * @type {ModalWindowElement[]}
         */
        const windowElements = [];
        windowElements.push(new ModalWindowElement(ModalWindowElementType.Input, "FirstName", "FirstName"));
        windowElements.push(new ModalWindowElement(ModalWindowElementType.Input, "LastName", "LastName"));
        windowElements.push(new ModalWindowElement(ModalWindowElementType.Input, "Username", "Username"));
        windowElements.push(new ModalWindowElement(ModalWindowElementType.Input, "Email", "Email"));
        windowElements.push(new ModalWindowElement(ModalWindowElementType.PasswordInput, "Password", "Password"));
        new ModalWindow("Sign Up", DialogTypes.OkCancel, callbacks, windowElements).show();
    });



};

export default common;