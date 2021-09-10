import {WindowMenu} from "../components/windowMenu";

export class NotificationsWindowMenu extends WindowMenu {
    /**
     *
     * @param callerElem
     */
    constructor(callerElem) {
        super(callerElem);
    }

    initialize() {
        super.initialize();

        this.windowMenuElem.style.bottom = "0";
        this.windowMenuElem.innerHTML = `
            <div class="notifications-window-menu">
                
            </div>`;

        this.setupInteractions();
    }
}