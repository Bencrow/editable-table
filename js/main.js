YUI({
    lang: "fr",
    combine: false,
    groups: {
        "classes": {
            combine: false,
            base: "js/classes/",
            modules: {
                "cell": {
                    path: "cell.js",
                    require: ["node", "base", "substitute"] 
                },
                "table": {
                    path: "table.js",
                    require: ["node", "base", "array-extras"]
                },
            }
        }
    },
}).use(
    "console",
    "node", 
    "base",
    "table",
    "cell", 
function(Y) {

    /* Utiliy / shortcut */
    var selector = "td, th";

    /* Create our table object */
    var table = new Y.Table({
        node: Y.one("table#table"),
        childSelector: 'td,th',
    });

    /* Toggle the select status of the clicked cell */
    var select = function(e) {
        var cell = e.target.data;
        cell.toggleSelected();
    };
    
    /* Event binding */
    table.get("node").delegate("click", select, "td, th");

    /* Create button to add row and column */
    var actionNode = Y.one(".actions");

    var addRow = Y.Node.create("<button/>");
    addRow.setContent("add a row");
    addRow.addClass("btn");
    actionNode.append(addRow);

    addRow.on("click", table.addRow, table);

    var addCol = Y.Node.create("<button/>");
    addCol.setContent("add a column");
    addCol.addClass("btn");
    actionNode.append(addCol);

    addCol.on("click", table.addCol, table);
});
