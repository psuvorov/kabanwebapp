
const common = () => {

    const leftItemsAreaElem = document.querySelector(".left-items-area");
    leftItemsAreaElem.addEventListener("click", () => location.href = "/");

    const rightItemsAreaElem = document.querySelector(".right-items-area");


    const checkUserLoggedIn = () => {
        return false;
    };

    if (checkUserLoggedIn()) {

    } else {

    }






};

export default common;