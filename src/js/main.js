import home from "./modules/home/home";
import dashboard from "./modules/dashboard/dashboard";
import boards from "./modules/boards/boards";


window.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    home();
    dashboard();
    boards();
});
