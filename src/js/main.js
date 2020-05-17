import {HomePage} from "./modules/home/homePage";
import {DashboardPage} from "./modules/dashboard/dashboardPage";
import {BoardPage} from "./modules/boards/boardPage";
import {CommonPageOperations} from "./modules/commonPageOperations";
import {ApplicationPageUrls} from "./constants";


window.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    if (window.location.pathname === ApplicationPageUrls.homePage) {
        new HomePage().initialize();
    } else if (window.location.pathname === ApplicationPageUrls.dashboardPage) {
        new DashboardPage().initialize();
    } else if (window.location.pathname === ApplicationPageUrls.boardPage) {
        new BoardPage().initialize();
    }

    new CommonPageOperations().initialize();
});
