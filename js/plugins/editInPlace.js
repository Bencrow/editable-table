YUI().add('editInPlace', function(Y) {
    function EditInPlace(config) {
        config.inputNode = config.host;
        EditInPlace.superclass.constructor.apply(this, arguments);
    }    
    
    var Plugin = Y.Plugin;

    EditInPlace.NAME = 'editInPlace';
    
    EditInPlace.NS = 'editInPlace';

    EditInPlace.INPUT_CELL_TEMPLATE = '<input type="hidden" value="{value}" class="value" />';
    EditInPlace.SPAN_CELL_TEMPLATE = '<span class="content">{value}</span>';

    EditInPlace.ATTRS = {
        
    };

    Y.extend(EditInPlace, Y.Plugin.Base, {
        editMode: false,

        initializer: function(config) {
           var cell = this.get("host").get("node");
           var cellValue = this.get("host").get("value");
           var span =  Y.Lang.sub(EditInPlace.SPAN_CELL_TEMPLATE, {
		       value: cellValue				
		   }); 

           var input = Y.Lang.sub(EditInPlace.INPUT_CELL_TEMPLATE, {
		       value: cellValue				
		   }); 
           cell.setContent("");
           cell.append(span);
		   cell.append(input);
           this.bindUI(); 
        },

        bindUI: function() {
            var cell = this.get("host").get("node");
            cell.delegate("blur", Y.bind(this.endEdit, this), "input.value");
            cell.delegate("key", Y.bind(this.endEdit, this), "down:9,27", "input.value");
            cell.delegate("key", Y.bind(this.endEdit, this), "press:13", "input.value");
            cell.delegate("dblclick", Y.bind(this.enterEditMode, this), "td");
            cell.delegate("keypress", Y.bind(this.enterEditMode, this), "td:focus");
        },
        
        enterEditMode: function(e) {
		    if (e.type == "keypress" && e.keyCode == 13) {
                this.edit(e.currentTarget);
            } else if (e.type == "keypress") {
    		    var char = String.fromCharCode(e.keyCode);
    		    var numcheck = new RegExp(/\d/);
    		    if (numcheck.test(char) && this.editMode == false) {
    		        this.edit(e.currentTarget, char);
    		    }
		    } else if (e.type == "dblclick") {
		        this.edit(e.currentTarget);
		    }
		},

		edit: function(src, char) {
			var content = src.one("span.content");
			var input  = src.one("input.value");
			
			content.hide();
			input.set("type", "text");
			if (char) {
			    input.set("value", char);
			}
			
			// Positionne le mode edition avant d'enlever le focus à l'élément,
			// Sinon, le "input.focus()" déclenche l'événement blur()
			// la fonction "_deselect" sera donc appelé avec le mode edition non positionné
			this.editMode = true; 
			input.focus();
		},

		endEdit: function(e) {
            if(!this.editMode) {
                return;
            }
            
            e.stopImmediatePropagation();
            
			var input = e.target;
			var cell = input.ancestor("td");
			var content = cell.one("span.content");
			var validate = this.get("cellValidation");

			if (e.keyCode == 27) {
					input.set("value", content.getContent());
			} else {
			    var isValid = true;
		        if (validate != null) {
		            if (!validate(input.get("value"))) {
		                isValid = false;
		                input.addClass("error");
		                e.preventDefault();  // Pas du soumission ou de TAB si erreur
		                return;
		            }
		        }	        
		        if (isValid) {
		            content.setContent(input.get("value"));
		        }
			}
			content.show();
            input.set("type", "hidden");
            this.editMode = false;
            cell.focus();
            
            if (e.keyCode == 9) {
                return; 
            }
		},
    
    });        
    Plugin.EditInPlace = EditInPlace;
        
}, '0.1', {requires: ["plugin", "event", "node-pluginhost"]});        
