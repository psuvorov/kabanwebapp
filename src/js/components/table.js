export class Table {



    constructor() {
        /**
         * @private
         * @type {HTMLElement}
         */
        this.tableElem = null;

        /**
         * @private
         * @type {{columnName: string, columnTitle: string}[]}
         */
        this.columns = null;

        /**
         * @private
         */
        this.datasource = null;


        this.initialize();
    }

    /**
     * @private
     */
    initialize() {
        this.tableElem = document.createElement("table");
        this.tableElem.classList.add("table");

    }

    /**
     *
     * @return {HTMLElement}
     */
    getElement() {
        return this.tableElem;
    }

    /**
     * @param {{columnName: string, columnTitle: string, hidden: boolean | undefined, type: string | undefined, width: string | undefined}[]} columns
     * @param data
     */
    setDatasource(columns, data) {
        this.clearTableElement();
        this.setColumns(columns);
        this.setData(data);


    }

    clearTableElement() {
        this.tableElem.innerHTML = `<table></table>`;
    }

    /**
     * @private
     */
    setColumns(columns) {
        this.columns = columns;

        const theadElem = document.createElement("thead");
        let trElem = document.createElement("tr");
        this.columns.forEach(columnItem => {
            let thElem = document.createElement("th");
            thElem.setAttribute("data-column-name", `${columnItem.columnName}`);
            if (columnItem.hidden)
                thElem.classList.add("hidden");
            if (columnItem.width)
                thElem.style.width = columnItem.width;

            let linkElem = document.createElement("span");
            linkElem.textContent = columnItem.columnTitle;
            linkElem.classList.add("link");
            linkElem.classList.add("highlight");
            thElem.append(linkElem);

            trElem.append(thElem);
        });
        theadElem.append(trElem);

        this.tableElem.append(theadElem);
    }

    /**
     * @private
     */
    setData(data) {
        this.datasource = data;

        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour:'2-digit', minute: '2-digit'};

        const tbodyElem = document.createElement("tbody");

        this.datasource.forEach(rowItem => {
            let trElem = document.createElement("tr");
            for (let column of this.columns) {
                const tdElem = document.createElement("td");

                if (column.type && column.type === "popupMenu") {
                    tdElem.innerHTML = `<span class="actions-menu-button"><i class="fas fa-ellipsis-h"></i></span>`;
                    tdElem.style.textAlign = "center";
                    tdElem.firstElementChild.addEventListener("click", (e) => {
                        column.popupMenuInstance.setCaller(e.currentTarget);
                        column.popupMenuInstance.show();
                    });
                } else {
                    const cellValue = rowItem[column.columnName];

                    if (column.type && column.type === "date") {
                        tdElem.innerText = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(cellValue));
                    } else {
                        tdElem.innerText = `${cellValue}`;
                    }
                }

                if (column.hidden)
                    tdElem.classList.add("hidden");

                trElem.append(tdElem);

            }
            tbodyElem.append(trElem);
        });

        this.tableElem.append(tbodyElem);
    }





}