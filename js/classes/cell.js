YUI().add("cell", function(Y) {
	/**
	 * @class Cell
	 * @constructor
	 * @extends Base
	 */
    function Cell(config) {
        Cell.superclass.constructor.apply(this, arguments);
    }

    Y.extend(Cell, Y.Base, {
        /**
         * Automatically called by the Base superclass during
		 * the construction phase
         * - bind event
         * - publish event
         * 
         * @method initializer
		 * @public
		 * @return void
         */ 
        initializer: function() {
           this._bindUI();

            // Publish event
            this.publish("valueChange", {
                emitFacade: true,
                broadcast: 1,
            });

            this.publish("beforeCellSelect", {
                emitFacade: true,
                broadcast: 1,
            });

            this.publish("afterCellSelect", {
                emitFacade: true,
                broadcast: 1,
            });
            this.plug(Y.Plugin.EditInPlace);
        },
        
        /**
         * Bind event
         *
         * @method _bindUI
		 * @private
		 * @return void
         */
        _bindUI: function() {
            this.after("valueChange", this._afterValueChange);
        },
        
        /**
         * Fire the event "valueChange" when the value has changed
        /* 
         * @method _afterValueChange
         * @private
         * @return void
         */
        _afterValueChange: function() {
            this.fire("valueChange");
        },
        
        /**
         * Toggle the select status
         * 
         * @method toggleSelected
         * @public
         * @return void
         */
        toggleSelected: function() {
            var selected = this.get("selected");
            this.fire("beforeCellSelect");
            this.set("selected", !selected);
            this.fire("afterCellSelect", {cell: this});
        },
        
        /**
         * Set the selected attribute
         * Fire the "beforeCellSelect" event before setting the value
         * set the value and then fire the "afterCellSeelect" event
         * 
         * @method _setSelected
         * @private
         * @param boolean val, select or deselect the cell
         * @return void
         */
        _setSelected: function(val) {
			this.fire("beforeCellSelect");
			this.set("selected", val);
			this.fire("afterCellSelect", { cell: this });
		},
		
		/**
		 * Select a cell. Call the _setSelected method with param true
		 * 
		 * @method select
		 * @public
		 * @return void
		 */
		select: function() {
			this._setSelected(true);
		},
		
		/**
		 * Deselect the cell. Call the _setSelected method with param false
		 * 
		 * @method deselect
		 * @public
		 * @return void
		 */
		deselect: function() {
			this._setSelected(false);
		}
    }, {
		/* Attributes */
        ATTRS: {
			/**
			 * @attribute id
			 * @description id of the cell
			 * @default null
			 * @type string
			 */
            id: { value: null },
            
            /**
             * @attribute value
             * @description the content of the cell
             * @default ''
             * @type string
             */
            value: { value: '' },
            
            /**
             * @attribute node
             * @description reference to the dom node
             * @default null
             * @type Node
             */
            node: { value: null },
            
            /**
             * @attribute selected
             * @description represent the select status of the cell
             * @default false
             * @type boolean
             */
            selected: { value: false },
            
            /**
             * @attribute coords
             * @description coords of the cell in the table
             * @type Object
             */
            coords: { value:  {x:null, y:null} }
        }
    });

    Y.Cell = Cell;
});
