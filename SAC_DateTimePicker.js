(function(){

    let _shadowRoot,
        _id,
        _dateTime,
        template = document.createElement("template");

    template.innerHTML = `
        <style></style>
        <div id="ui5_content name="ui5_content>
            <slot name="content"></slot>
        </div>

        <script id="oView" name="oView" type="sapui5/xmlview">
            <mvc:View
                controllerName="myView.Template"
                xmlns:l="sap.ui.layout"
                xmlns:mvc="sap.ui.core.mvc"
                xmlns="sap.m">
                <l:VerticalLayout
                    width="100%">
                        <l:content>
                            <Label text="Enter date:"/>
                            <DateTimePicker
                                id="DTP_1"
                                placeholder="Enter date"
                                change="onDTPChanged"
                                value=""/>
                        </l:content>
                </l:VerticalLayout>
            </mvc:View>
        </script>
    `;
                        
    class DateTimePicker extends HTMLElement{
        constructor(){
            super();

            _shadowRoot = this.attachShadow({mode: "open"});
            _shadowRoot.appendChild(template.content.cloneNode(true));

            _id = createGuid();

            _shadowRoot.querySelector("#oView").id = _id + "_oView";
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            loadDateTimePicker(this);
        }

        _firePropertiesChanged() {
            this.dateTime = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        dateTime: this.dateTime
                    }
                }
            }));
        }

        setPlaceholder(sPlaceholderText){
            console.log(sPlaceholderText);
            _shadowRoot.querySelector("script").innerHTML = _shadowRoot.querySelector("script").innerHTML.replace('placeholder="Enter date"', 'placeholder="'+sPlaceholderText+'" ');
            loadDateTimePicker(this);
        }

        setDateTime(sDateTime){
            console.log(sDateTime);

            let dtInputDateTime = new Date(sDateTime).toISOString().split(".")[0];
            _shadowRoot.querySelector("script").innerHTML = _shadowRoot.querySelector("script").innerHTML.replace('value=""', 'value="'+dtInputDateTime+'" ');
            loadDateTimePicker(this);
        }

        setTitle(sTitle){
            console.log(sTitle);
            _shadowRoot.querySelector("script").innerHTML = _shadowRoot.querySelector("script").innerHTML.replace('text="Enter date:"', 'text="'+sTitle+':" ');
            loadDateTimePicker(this);
        }

        get dateTime(){
            return this._export_settings_dateTime;
        }
        set dateTime(value){
            value = _dateTime;
            this._export_settings_dateTime = value;
        }
    }
    customElements.define("krones-sac-customwidget-sapui5-datetimepicker", DateTimePicker);

    function loadDateTimePicker(that){
        var that_ = that;

        if(that_.childElementCount > 0){
            that_.removeChild(that_.childNodes[0]);
        }

        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);

        sap.ui.getCore().attachInit(function(){
            "use strict";

            sap.ui.define([
                "sap/ui/core/mvc/Controller"
            ], function(Controller){
                "use strict";

                return Controller.extend("myView.Template", {
                    onInit: function(){
                        console.log("onInit");
                    },

                    onDTPChanged: function(oEvent){
                        _dateTime = oView.byId("DTP_1").getValue();
                        that._firePropertiesChanged();
                        that.dispatchEvent(new Event('onChange'));
                    }
                });
            });
        });

        var oView  = sap.ui.xmlview({
            viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
        });
        oView.placeAt(content);
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }  

})();