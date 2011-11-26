YUI().add("cell", function(Y) {

    function Cell(config) {
        Cell.superclass.constructor.apply(this, arguments);
    }

    Y.extend(Cell, Y.Base, {
        /*
         * Intializer
         * - bind event
         * - publish event
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
        },
        /*
         * Binding event
         */
        _bindUI: function() {
            this.after("valueChange", this._afterValueChange);
        },
        /* Fire the event "valueChange" when the value has changed */
        _afterValueChange: function() {
            this.fire("valueChange");
        },
        /*
         * Public function to toggle the select status
         */
        toggleSelected: function() {
            var selected = this.get("selected");
            this.fire("beforeCellSelect");
            this.set("selected", !selected);
            this.fire("afterCellSelect", {cell: this});
        }
    }, {
        ATTRS: {
            id: { value: null },
            value: { value: '' },
            node: { value: null },
            selected: { value: null },
        }
    });

    Y.Cell = Cell;
});
