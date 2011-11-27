YUI().add("editableTable", function(Y) {
	/* Frequently used shortcuts, strings and constants */
    // var Lang = Y.Lang;
    // var Each = Y.each;

	/**
	 * @class EditableTable
	 * @constructor
	 * @extends Widget
	 */
	function EditableTable(config) {
		EditableTable.superclass.constructor.apply(this, arguments);
	}
	
	EditableTable.NAME = "editableTable";
	
	/* Attributes */
	EditableTable.ATTRS = {
	};
	
	/* 
     * The HTML_PARSER static constant is used if the Widget supports progressive enhancement, and is
     * used to populate the configuration for the MyWidget instance from markup already on the page.
     */
    EditableTable.HTML_PARSER = {
	};
	
	Y.extend(EditableTable, Y.Widget, {
		initializer: function() {
			var tableNode = this.get("srcNode");
			/* Create our table object */
			this.table = new Y.Table({
				node: tableNode,
				childSelector: 'td,th',
			});

			this.table.selectCellByCoords({x:1,y:1});			
		},
		destructor: function() {
		},
		renderUI: function() {
			var actionNode = Y.one(".actions");
			var table = this.table;
			/* Create button to add row and column */

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
			
			/* Create button to move left, up, right and down */
			var left = Y.Node.create("<button/>");
			left.setContent("left");
			left.addClass("btn");
			actionNode.append(left);

			left.on("click", table.selectLeftCell, table);
			
			var right = Y.Node.create("<button/>");
			right.setContent("right");
			right.addClass("btn");
			actionNode.append(right);

			right.on("click", table.selectRightCell, table);
			
			var up = Y.Node.create("<button/>");
			up.setContent("up");
			up.addClass("btn");
			actionNode.append(up);

			up.on("click", table.selectAboveCell, table);
			
			var down = Y.Node.create("<button/>");
			down.setContent("down");
			down.addClass("btn");
			actionNode.append(down);

			down.on("click", table.selectBelowCell, table);
		},
		/* Event binding */
		bindUI: function() {
			this.table.get("node").delegate("click", Y.bind(this._select, this), "td, th");
		},
		syncUI: function() {
		},

		/* Toggle the select status of the clicked cell */		
		_select: function(e) {
			var cell = e.target.data;
			cell.toggleSelected();
		},
	});
	
	Y.EditableTable = EditableTable;

}, "0.1", {
	requires: ["node", "table", "cell", "event", "event-key"]
});

