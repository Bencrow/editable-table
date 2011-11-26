YUI().add("table", function(Y) {
    
    var SELECT_CN = "selected";
    var HEADER_CN = "blue";

    function Table(config) {
        Table.superclass.constructor.apply(this, arguments);
    }

    Y.extend(Table, Y.Base, {
        initializer: function() {
            this._buildCellList();
            this._buildRowList();

            this._bindUI();
        },
        // Create row list containing cell
        _buildRowList: function() {
            var rows = new Array();
            var selector = this.get("childSelector");
            this.get("node").all("tr").each(function(tr) {
                var row = {
                    cells: new Array(),
                    id: tr.get("id"),
                    node: tr
                };
                tr.all(selector).each(function(td) {
                    row.cells.push(td.data);
                    td.data.set("row", row);
                });
                tr.data = row;
                rows.push(row);
            });

            this.set("rows", rows);
        },
        // Fill the cell list 
        _buildCellList: function() {
            var table = this.get("node");
            var list = new Array();
            var selector = this.get("childSelector");
		    table.all(selector).each(function(td) {
		        var cell = new Y.Cell({
		            node: td,
		            id: td.get("id"),
		            value: td.getContent()
		        });
		        td.data = cell;
		        list.push(cell);
		    });

            this.set("cells", list);
        },
        _bindUI: function() {
            Y.on("beforeCellSelect", this._beforeSelectCell, this);
            Y.on("afterCellSelect", this._afterSelectCell, this);
        },
        _beforeSelectCell: function(e) {
            Y.log("beforeSelectCell");
            // Remove the current selected cell class
            var selectedChildSelector = "td." + SELECT_CN + ", th." + SELECT_CN;
            this.get("node").all(selectedChildSelector).removeClass(SELECT_CN);

            // Remove the selected header class
            this.get("node").all("th." + HEADER_CN).each(function(th) {
                th.removeClass(HEADER_CN);
            });

            // Set the selected attribute to false
            Y.each(this.get("cells"), function(cell) {
                cell.set("selected", false);
            }, this);
        },
        _afterSelectCell: function(e) {
            Y.log("afterSelectCell");
            var cell = e.cell;
            Y.log(cell.get("selected"));

            if (cell.get("selected")) {
                // Store the selected cell
                this.set("selectedCell", e.cell); 
    
                // add class to the cell parent
                cell.get("node").ancestor("tr").one("th").addClass(HEADER_CN);

                var row = cell.get("node").ancestor("tr");
                var index = row.get("children").indexOf(cell.get("node"));
                var th= this.get("node").one("tr").get("children").item(index);

                th.addClass(HEADER_CN);

                cell.get("node").addClass(SELECT_CN);
            }
        },
        addRow: function() {
            var node = this.get("node").one("tbody");
            var newRow = this.get("rows")[0].node.cloneNode(true);
            newRow.all("td, th").each(function(cell) {
                cell.setContent("");
            });
            node.append(newRow);
            this._buildCellList();
            this._buildRowList();
        },
        addCol: function() {
            var node = this.get("node");
            var CELL = "<td/>";
            node.all("tr").each(function(row) {
                var newCell = Y.Node.create(CELL);
                row.append(newCell);
            }, this);
            this._buildCellList();
            this._buildRowList();
        }
    }, {
        ATTRS: {
            childSelector: { value: 'td' },
            id: { value: null },
            value: { value: '' },
            node: { value: null },
            rows: { value: new Array() },
            cells: { value: new Array() },
        }
    });

    Y.Table = Table;
});
