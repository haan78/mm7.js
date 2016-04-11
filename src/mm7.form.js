
(function(mm7) {
    
    if (mm7.missing(["document"],true)>-1) return;
    
    mm7["form"] = function(formElement) {
        return {
            form: mm7.node(formElement),
            setSelect: function(select, value) {
                if (value == null)
                    return;
                if (typeof value === "object") {
                    for (var i = 0; i < select.options.length; i++) {
                        select.options[i].selected = false;
                        for (var k in value)
                            if (value[k] == select.options[i].value)
                                select.options[i].selected = true;
                    }
                } else {
                    select.selectedIndex = -1;
                    for (var i = 0; i < select.options.length; i++) {
                        if (select.options[i].value == value)
                            select.selectedIndex = i;
                    }
                }
            },
            get: function(defaults) {
                var values = {};
                if ((defaults !== null) && (typeof defaults === "object"))
                    values = defaults;

                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    var type = elm.type.toLowerCase();
                    var name = elm.name;
                    var value = elm.value;
                    if (name !== "") {
                        if ((type === "checkbox") || (type === "radio")) {
                            if (elm.checked) {
                                values[name] = value;
                            } else {
                                //I am not sure;
                            }
                        } else if (type === "select-one") {
                            if (elm.selectedIndex > -1) {
                                values[name] = elm.options[elm.selectedIndex].value;
                            } else {
                                //I am not sure;
                            }
                        } else if (type === "select-multiple") {
                            var arr = [];
                            for (var j = 0; j < elm.options.length; j++) {
                                if (elm.options[j].selected)
                                    arr.push(elm.options[j].value);
                            }
                            if (arr.length > 0) {
                                values[name] = arr;
                            } else {
                                //I am not sure;
                            }
                        } else {
                            values[name] = value;
                        }
                    }
                }
                return values;
            },
            clear:function() {
                this.form.reset();
                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    var type = elm.type.toLowerCase();
                    var name = elm.name;
                    if (name !== "") {
                        if ( type === "hidden") {
                            elm.value = "";
                        }
                    }
                }
            },
            set: function(values,clear) {
                for (var i = 0; i < this.form.elements.length; i++) {
                    var elm = this.form.elements[i];
                    var type = elm.type.toLowerCase();
                    var name = elm.name;
                    if (name !== "") {
                        if (typeof values[name] !== "undefined") {
                            var value = values[name];
                            if ((type === "checkbox") || (type === "radio")) {
                                if (elm.value == value) {
                                    elm.checked = 1;
                                } else {
                                    elm.checked = 0;
                                }
                            } else if (type === "select-one") {
                                this.setSelect(elm, value);
                            } else if (type === "select-multiple") {
                                this.setSelect(elm, value);
                            } else {
                                elm.value = value;
                            }
                        } else {
                            if (clear) {
                                if (typeof elm.checked !== "undefined") {
                                    elm.checked = 0;
                                } else if (typeof elm.selectedIndex !== "undefined") {
                                    elm.selectedIndex = -1;
                                } else if ( typeof elm.value !== "undefined" ) {
                                    elm.value = "";
                                }
                            }                            
                        }
                    }
                }
            }
        };
    };

})(mm7);


