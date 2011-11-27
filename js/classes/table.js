YUI().add("table", function(Y) {
	/**
	 * @class Table
	 * @constructor
	 * @extends Base
	 */
    function Table(config) {
        Table.superclass.constructor.apply(this, arguments);
    }

    Y.extend(Table, Y.Base, {
		/**
		 * Automatically called by the Base superclass during
		 * the construction phase
		 * - Prepare the object : create the array list
		 * - Bind event
		 * 
		 * @method initializer
		 * @public
		 * @return void
		 */
        initializer: function() {
            this._buildCellList();

            this._bindUI();
        },
        
        /**
         * Utility to compare two coordonate object
         * 
         * @method _compareCoords
         * @private 
         * @param object coords, in form of { x:value, y:value }
         * @param object compare, in form of { x:value, y:value }
         * @return true if the coordonate are the same, or false
         */
        _compareCoords: function(coords, compare) {
			if (coords.x == compare.x && coords.y == compare.y)
				return true;
			else
				return false;
		},
		
        /**
         * Fill the cell list 
         * 
         * @method _buildCellList
         * @private 
         * @return void
         */
        _buildCellList: function() {
            var table = this.get("node");
            var list = new Array();
            var selector = this.get("childSelector");
		    table.all(selector).each(function(td) {
				var tr = td.ancestor("tr");
				var coords = {
					x: tr.get("children").indexOf(td),
					y: tr.ancestor("table").all("tr").indexOf(tr)
				};
		        var cell = new Y.Cell({
		            node: td,
		            id: td.get("id"),
		            value: td.getContent(),
		            coords: coords
		        });
		        td.data = cell;
		        list.push(cell);
		    });

            this.set("cells", list);
        },
        
        /**
         * bind event to function
         * 
         * @method _bindUI
         * @private
         * @return void
         */
        _bindUI: function() {
            Y.on("beforeCellSelect", this._beforeSelectCell, this);
            Y.on("afterCellSelect", this._afterSelectCell, this);
        },
        
        /**
         * deselect all cell before selecting a new one :
         * - setting the "selected" attribute of each cell
         * - remove css class representing selected cell
         *   and corresponding header
         * 
         * @method _beforeSelectCell
         * @private
         * @return void
         */
        _beforeSelectCell: function(e) {
            // Remove the current selected cell class
            var SELECT_CN = this.get("SELECT_CN");
            var HEADER_CN = this.get("HEADER_CN");
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
        
        /**
         * set the css class for the selected cell
         * and the corresponging header
         * 
         * @method _afterSelectCell
         * @private
         * @return void
         */
        _afterSelectCell: function(e) {
            var cell = e.cell;
            var SELECT_CN = this.get("SELECT_CN");
            var HEADER_CN = this.get("HEADER_CN");

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
        
        /**
         * add a row to the table with the right number of cell
         * then rebuild the cell list
         * 
         * @method addRow
         * @public
         * @return void
         */
        addRow: function() {
            var node = this.get("node").one("tbody");
            var newRow = node.one("tr").cloneNode(true);
            newRow.all("td, th").each(function(cell) {
                cell.setContent("");
                cell.removeClass("selected");
            });
            node.append(newRow);
            this._buildCellList();
        },
        
        /**
         * add a column (cell) to each row in the table
         * then rebuild the cell list
         * 
         * @method addCol
         * @public
         * @return void
         */
        addCol: function() {
            var node = this.get("node");
            var CELL = "<td/>";
            var HEADER = "<th/>";
            node.all("thead tr").each(function(row) {
                var newCell = Y.Node.create(HEADER);
                row.append(newCell);
            }, this);
            node.all("tbody tr, tfoot tr").each(function(row) {
                var newCell = Y.Node.create(CELL);
                row.append(newCell);
            }, this);
            this._buildCellList();
        },
        
        /**
		 * find a cell by coordonate
		 * 
		 * @method findCellByCoords
		 * @public
		 * @param object coords, inf form of { x:value, y:value }
		 * @return the cell object matching the coords or false
		 * 
		 */
        findCellByCoords: function(coords) {
			var match = null;
			Y.each(this.get("cells"), function(cell) {
				if (this._compareCoords(coords, cell.get("coords"))) {
					match = cell;
				}
			}, this);
			return match || false;
		},
		
		/**
		 * Select a cell given its coordonate
		 * 
		 * @method selectCellByCoords
		 * @public
		 * @param object coords, in form of { x:value, y:value }
		 * @return void
		 */
		 selectCellByCoords: function(coords) {
			var cell = this.findCellByCoords(coords);
			if (cell)
				cell.select();
		 },
		
		/**
		 * Select the cell at the right of the current cell
		 * 
		 * @method selectRightCell
		 * @public
		 * @return void
		 */
		selectRightCell: function() {			
			var position = this.get("selectedCell").get("coords");
			// Move to right means x + 1
			var newPosition = {
				x: position.x+1,
				y: position.y
			};
			
			this.selectCellByCoords(newPosition);
		},
		
		/**
		 * Select the cell at the left of the current cell
		 * 
		 * @method selectLeftCell
		 * @public
		 * @return void
		 */
		selectLeftCell: function() {
			var position = this.get("selectedCell").get("coords");
			// Move to left means x -1
			var newPosition = {
				x: position.x-1,
				y: position.y
			};
			
			this.selectCellByCoords(newPosition);
		},
		
		/**
		 * Select the cell above the current cell
		 * 
		 * @method selectAboveCell
		 * @public
		 * @return void
		 */
		selectAboveCell: function() {
			var position = this.get("selectedCell").get("coords");
			// Move up means y - 1
			var newPosition = {
				x: position.x,
				y: position.y - 1
			};
			
			this.selectCellByCoords(newPosition);
		},
		
		/**
		 * Select the cell below current cell
		 * 
		 * @method selectBelowCell
		 * @public
		 * @return void
		 */
		selectBelowCell: function() {
			var position = this.get("selectedCell").get("coords");
			// Move down means y + 1
			var newPosition = {
				x: position.x,
				y: position.y + 1
			};
			
			this.selectCellByCoords(newPosition);
		},
    }, {
		/**
		 * Attributes
		 */
        ATTRS: {
			/**
			 * @attribute childSelector
			 * @description css selector used to reach cell
			 * @default "td"
			 * @type string
			 */
            childSelector: { value: 'td' },
            
            /**
             * @attribute id
             * @description identify the table
             * @default null
             * @type string
             */
            id: { value: null },
            
            /**
             * @attribute node
             * @description reference to the dom node
             * @default null
             * @type Node
             */
            node: { value: null },
            
            /**
             * @attribute cells
             * @description array list of the contained cell
             * @default empty Array()
             * @type Array
             */
            cells: { value: new Array() },
            
            /**
             * @attribute SELECT_CN
             * @description css class representing a selected cell
             * @default "selected"
             * @type string
             */
            SELECT_CN: { value: "selected" },
            
            /**
             * @attribute HEADER_CN
             * @description css class for the corresponding header
             * of a selected cell
             * @default "blue"
             * @type string
             */
			HEADER_CN: { value: "blue" },
        }
    });

    Y.Table = Table;
});
