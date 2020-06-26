import {HomePage} from "./views/pages/homePage";
import {DashboardPage} from "./views/pages/dashboardPage";
import {BoardPage} from "./views/pages/boardPage";
import {CommonPageOperations} from "./views/pages/commonPageOperations";
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
