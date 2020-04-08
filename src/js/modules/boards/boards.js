const boards = () => {



    const listContainerElem = document.querySelector(".list-container");

    const addCardLink = document.querySelector(".fake-list span");
    addCardLink.addEventListener("click", () => {
        const listName = prompt();
        createNewList(listName);
    });

    const createNewList = (listName) => {
        if (!listName)
            return;

        const newList = document.createElement("div");
        newList.classList.add("list");
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

        const listContainerElem = document.querySelector(".list-container");
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
            const cardName = prompt();
            createNewCard(e.target.parentElement.parentElement.parentElement, cardName);
        }
    });

    const createNewCard = (listCardsElem, cardName) => {
        if (!cardName)
            return;

        const listCards = listCardsElem.querySelector(".list-cards");

        const listCard = document.createElement("div");
        listCard.classList.add("list-card");
        // TODO: set id after successful write to db
        //listCard.setAttribute("data-card-id", "");

        const cardTitle = document.createElement("span");
        cardTitle.textContent = cardName;
        listCard.append(cardTitle);

        listCards.append(listCard);
    };




};

export default boards;