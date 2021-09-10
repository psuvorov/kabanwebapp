
export default class Utils {

    /**
     * Used to guard against undefined or null values.
     * @param value - The value to check.
     * @return boolean - False if the value is undefined or null, true if the value is initialized.
     */
    static isInit(...value) {
        for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === "undefined" || value[i] === null)
                return false;
        }
        return true;
    }

    /**
     * Used to guard against string undefined, null, and empty values.
     * @param {string} value - The value to check.
     * @return boolean - True if the value is undefined, null, or whitespace, false if the value is initialized.
     */
    static isNullOrWhitespace(...value) {
        for (let i = 0; i < value.length; i++) {
            if (!this.isInit(value[i]) || value[i].replace(/\s/g, "").length < 1)
                return true;
        }
        return false;
    }

    /**
     * Formats a number by padding with zeros up to a certain width. An example: if number to format is 23, and width
     * is 4, then we would get back the string "0023"
     * @param {number} numberToFormat The number to format with zeros
     * @param {number} width The width of the string to pad with zeros
     * @return {string} A formatted string representing the numberToFormat.
     */
    static zeroFill(numberToFormat, width) {
        width -= numberToFormat.toString().length;
        if (width > 0)
            return new Array(width + (/\./.test(numberToFormat.toString()) ? 2 : 1)).join("0") + numberToFormat;

        return numberToFormat + ""; // always return a string
    }

    /**
     * Outputs an empty guid.
     * @return string
     */
    static emptyGuid() {
        return "00000000-0000-0000-0000-000000000000";
    }

    /**
     *
     * @return {string} A new guid
     */
    static newGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Retrieves cookie value based on cookie name.
     * @param {string} cName The name of the cookie to retrieve the value from.
     */
    static getCookieValue(cName) {
        let cValue = document.cookie;
        let cStart = cValue.indexOf(cName + "=");
        if (cStart <= -1) {
            return null;
        } else {
            cStart = cValue.indexOf("=", cStart) + 1;
            let cEnd = cValue.indexOf(";", cStart);
            if (cEnd === -1)
                cEnd = cValue.length;
            cValue = cValue.substring(cStart, cEnd);

            return cValue;
        }
    }

    /**
     * Sets a cookie with a given name and value.
     * @param {string} cName Cookie name
     * @param {string} cValue Cookie value
     * @param {number} [cTime] Lifespan of Cookie in seconds (default of 10 years)
     */
    static setCookieValue(cName, cValue, cTime) {
        let date = new Date();
        let expire = cTime || (10 * 365 * 24 * 60 * 60);
        date.setSeconds(expire);
        document.cookie = cName + "=" + cValue.toString() + ";expires=" + date.toUTCString() + ";";
    }

    /**
     *
     * @param {Date} dateTime
     * @return {string} Datetime string representation
     */
    static formatDateTime(dateTime) {
        let day = dateTime.getDate().toString();
        let month = (dateTime.getMonth() + 1).toString();
        let year = dateTime.getFullYear().toString();
        let hours = this.zeroFill(dateTime.getHours() % 12, 2);

        if (hours === "00")
            hours = "12";
        let ampm = dateTime.getHours() >= 12 ? " PM" : " AM";
        let minutes = this.zeroFill(dateTime.getMinutes(), 2);
        let seconds = this.zeroFill(dateTime.getSeconds(), 2);

        return month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds + ampm;
    }

    /**
     *
     * @param {string} selector
     */
    static removeAllChildren(selector) {
        const parentElem = document.querySelector(selector);
        while (parentElem.firstElementChild) {
            parentElem.firstElementChild.remove();
        }
    }
}