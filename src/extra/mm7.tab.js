(function(mm7) {
    if (mm7.missing(["document"],true)>-1) return;
    mm7["tab"] = function(list,selected) {
        var control = {
            "list":new Array(),
            "selected":-1,
            show:function(elm) {
                //Can be overide for jQuery or another tools..
                elm.style.display="block";
            },
            hide:function(elm) {
                //Can be overide for jQuery or another tools..
                elm.style.display="none";
            },
            onBeforeSet : null,
            onAfterSet : null,            
            "set":function(sel,selector) {
                if ( mm7.type(this.onBeforeSet)==="function" ) {
                    if ( ! this.onBeforeSet(sel,selector) ) return;
                }
                this.selected = sel;
                for (var i=0; i<this.list.length; i++) {
                    if ( (i===this.selected) || (this.list[i].id === this.selected ) ) {
                        this.show(this.list[i]);
                    } else {
                        this.hide(this.list[i]);                        
                    }                    
                }
                if ( mm7.type(this.onAfterSet)==="function" ) {
                    this.onAfterSet(sel,selector);
                }
                
                
            },
            "add":function(tab) {
                if ( tab.length ) {
                    for (var i=0; i < tab.length; i++) {
                        if ( mm7.document.isDom(tab[i]) ) this.list.push(tab[i]);                        
                    }
                } else {
                    if ( mm7.document.isDom(tab)  ) this.list.push(tab);
                }
            }
        };
        control.add(list);
        if (selected) control.selected = selected;
        control.set(selected);
        return control;
    };
})(mm7);