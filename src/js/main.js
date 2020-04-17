import home from "./modules/home/home";
import dashboard from "./modules/dashboard/dashboard";
import boards from "./modules/boards/boards";


window.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    if (window.location.pathname === "/")
        home();
    else if (window.location.pathname === "/dashboard.html")
        dashboard();
    else if (window.location.pathname === "/board.html")
        boards();
});
