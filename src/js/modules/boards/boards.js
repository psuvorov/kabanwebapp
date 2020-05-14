import {LocalStorageKeys} from "../../helper";

const boards = () => {

    if (!localStorage.getItem(LocalStorageKeys.currentUser)) {
        window.location = "/";
        return;
    }

    const authWrapperElem = document.querySelector(".auth-wrapper");
    authWrapperElem.classList.add("hidden");

    const userAreaElem = document.querySelector(".user-area");
    userAreaElem.classList.remove("hidden");



    const listContainerElem = document.querySelector(".lists-container");

    const addCardLink = document.querySelector(".fake-list span");
    addCardLink.addEventListener("click", () => {
        const listName = prompt();
        createNewList(listName);
    });

    const createNewList = (listName) => {
        if (!listName)
            return;

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
    };




    let timeoutId = null;
    listContainerElem.addEventListener("keyup", function(e) {
        if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("list-title")){
            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                let listId = e.target.parentElement.parentElement.parentElement.getAttribute("data-list-id");
                console.log(listId + " " + e.target.value);
            }, 1000);
        }
    });

    listContainerElem.addEventListener("click", function(e) {
        if (e.target && e.target.parentElement && e.target.parentElement.classList.contains("card-composer")) {
            // "+ Add a card" was clicked
            const cardName = prompt();
            createNewCard(e.target.parentElement.parentElement, cardName);
        }
    });

    listContainerElem.addEventListener("dragstart", function(e) {
        if (e.target.classList.contains("list-card")) {
            // List card started dragging
            //e.dataTransfer.setData("text", e.target.id);

        }
    });

    listContainerElem.addEventListener("dragover", function(e) {
        e.preventDefault();
    });

    listContainerElem.addEventListener("drop", function(e) {
        e.preventDefault();

        const targetList = e.target.closest(".list");
        if (targetList) {
            // console.log(targetList);
            // var data = e.dataTransfer.getData("text");
            // console.log(data);
        }


    });


    const createNewCard = (listElem, cardName) => {
        if (!cardName)
            return;

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
    };




};

export default boards;