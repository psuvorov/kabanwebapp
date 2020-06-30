import {WindowMenu} from "../components/windowMenu";
import {ApplicationPageUrls} from "../../constants";

export class NotificationsWindowMenu extends WindowMenu{

    /**
     *
     * @param callerElem
     * @param kabanBoardService
     */
    constructor(callerElem, kabanBoardService) {
        super(callerElem, kabanBoardService);
    }

    initialize() {
        super.initialize();

        this.windowMenuElem.style.bottom = "0";
        this.windowMenuElem.innerHTML = `
            <div class="notifications-window-menu">
                
            </div>`;


    }


}