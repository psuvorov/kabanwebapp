import {HomePage} from "./views/pages/homePage";
import {DashboardPage} from "./views/pages/dashboardPage";
import {BoardPage} from "./views/pages/boardPage";
import {CommonPageOperations} from "./views/pages/commonPageOperations";
import {ApplicationPageUrls} from "./constants";


window.addEventListener("DOMContentLoaded", (e) => {
    "use strict";

    const pages = {};

    if (window.location.pathname === ApplicationPageUrls.homePage) {
        let homePage = new HomePage();
        homePage.initialize();
        pages["homePage"] = homePage;
    } else if (window.location.pathname === ApplicationPageUrls.dashboardPage) {
        let dashboardPage = new DashboardPage();
        dashboardPage.initialize();
        pages["dashboardPage"] = dashboardPage;
    } else if (window.location.pathname === ApplicationPageUrls.boardPage) {
        let boardPage = new BoardPage();
        boardPage.initialize();
        pages["boardPage"] = boardPage;
    }

    new CommonPageOperations(pages).initialize();
});
