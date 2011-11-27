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
        },
        "widgets": {
            combine: false,
            base: "js/widgets/",
            modules: {
				"editableTable": {
					path: "editableTable.js",
					require: ["node", "table", "cell", "event", "event-key"]
				},
			},
		},
    },
}).use(
    "console",
    "node", 
    "base",
    "table",
    "cell", 
    "editableTable",
    "event-key",
function(Y) {

	var editableTable = new Y.EditableTable({
		srcNode: "table#table"
	});

	editableTable.render();

});
