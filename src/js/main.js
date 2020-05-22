import {HomePage} from "./pages/homePage";
import {DashboardPage} from "./pages/dashboardPage";
import {BoardPage} from "./pages/boardPage";
import {CommonPageOperations} from "./pages/commonPageOperations";
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
