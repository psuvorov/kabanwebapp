import {HomePage} from "./modules/home/homePage";
import {DashboardPage} from "./modules/dashboard/dashboardPage";
import {BoardPage} from "./modules/boards/boardPage";
import {CommonPageOperations} from "./modules/commonPageOperations";




window.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    if (window.location.pathname === "/") {
        new HomePage().initialize();
    } else if (window.location.pathname === "/dashboard.html") {
        new DashboardPage().initialize();
    } else if (window.location.pathname === "/board.html") {
        new BoardPage().initialize();
    }


    new CommonPageOperations().initialize();

});
