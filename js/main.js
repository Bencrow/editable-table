YUI({
    lang: "fr",
    combine: false,
    groups: {
        "widget": {
            combine: false,
            base: "js/widgets/",
            modules: {
                "editableTable": {
                    path: "editableTable.js",
                    require: ["node", "event", "widget", "substitute"] 
                }
            }
        }
    },
}).use("widget", function(Y) {
});
