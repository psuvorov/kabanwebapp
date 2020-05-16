import {ApplicationUser} from "../../application/applicationUser";
import {ApplicationPageUrls} from "../../constants";

export class BoardPage {

    constructor() {
        if (ApplicationUser.getApplicationUserFromStorage() === null) {
            window.location = ApplicationPageUrls.homePage;
            return;
        }


    }

    initInteractions() {
        const listContainerElem = document.querySelector(".lists-container");

        const addCardLink = document.querySelector(".fake-list span");
        addCardLink.addEventListener("click", () => {
            // TODO: ---> const listName = prompt();

            
            this.createNewList(listName);
        });

        let timeoutId = null;
        listContainerElem.addEventListener("keyup", (e) => {
            if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("list-title")){
                clearTimeout(timeoutId);

                timeoutId = setTimeout(() => {
                    let listId = e.target.parentElement.parentElement.parentElement.getAttribute("data-list-id");
                    console.log(listId + " " + e.target.value);
                }, 1000);
            }
        });

        listContainerElem.addEventListener("click", (e) => {
            if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("card-composer")) {
                // "+ Add a card" was clicked

                // TODO: ---> const cardName = prompt();
                this.createNewCard(e.target.parentElement.parentElement, cardName);
            }
        });

        listContainerElem.addEventListener("dragstart", (e) => {
            if (e.target.classList.contains("list-card")) {
                // List card started dragging
                //e.dataTransfer.setData("text", e.target.id);

            }
        });

        listContainerElem.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        listContainerElem.addEventListener("drop", (e) => {
            e.preventDefault();

            const targetList = e.target.closest(".list");
            if (targetList) {
                // console.log(targetList);
                // var data = e.dataTransfer.getData("text");
                // console.log(data);
            }


        });


    }


    /**
     * @private
     * @param {string} listName
     */
    createNewList(listName) {
        if (!listName)
            throw new Error("List name is missing");

        const newList = document.createElement("div");
        newList.classList.add("animated", "fadeIn", "list");
        // TODO: set id after successful write to db
        //newList.setAttribute("data-list-id", "");
        newList.innerHTML = `
                <div class="list-header">
                    <div class="list-title">
                        <input type="text" value="${listName}" >
                    </div>
                    <div class="list-menu">
                        <span>***</span>
                    </div>
                </div>
                <div class="list-cards">
                </div>
                <div class="card-composer">
                    <span>+ Add a card</span>
                </div>
            `;

        const listContainerElem = document.querySelector(".lists-container");
        const fakeListElem = document.querySelector(".fake-list");
        listContainerElem.insertBefore(newList, fakeListElem);
    }

    /**
     *
     * @param {HTMLElement} listElem
     * @param {string} cardName
     */
    createNewCard(listElem, cardName) {
        if (!cardName)
            throw new Error("Card name is missing");

        const listCards = listElem.querySelector(".list-cards");

        const listCard = document.createElement("div");
        listCard.classList.add("animated", "fadeIn", "list-card");
        listCard.setAttribute("draggable", "true");
        //listCard.setAttribute("ondragstart", "drag(event)");
        // TODO: set id after successful write to db
        //listCard.setAttribute("data-card-id", "");

        const cardTitle = document.createElement("span");
        cardTitle.textContent = cardName;
        listCard.append(cardTitle);

        listCards.append(listCard);
    }


    initialize() {
        this.initInteractions();










    }


}
