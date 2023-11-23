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
            if(changedProperties.dateTime !== ""){
                this.dateTimeUI = new Date(changedProperties.dateTime).toISOString().split(".")[0];
            }
            else{
                this.dateTimeUI = "";
            }
            if(changedProperties.placeholder !== undefined){
                this.placeholderUI = changedProperties.placeholder;
            }
            if(changedProperties.title !== undefined){
                this.titleUI = changedProperties.title;
            }

            _shadowRoot.querySelector("script").innerHTML = '<mvc:View controllerName="myView.Template" xmlns:l="sap.ui.layout" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"><l:VerticalLayout width="100%"><l:content><Label text="'+this.titleUI+':"/><DateTimePicker id="DTP_1" placeholder="'+this.placeholderUI+'"  change="onDTPChanged" value="'+this.dateTimeUI+'"/> </l:content></l:VerticalLayout></mvc:View>'

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
                "sap/ui/core/mvc/Controller",
                "sap/m/MessageBox"
            ], function(Controller, MessageBox){
                "use strict";

                return Controller.extend("myView.Template", {
                    onInit: function(){
                        console.log("onInit");
                    },

                    onDTPChanged: function(oEvent){
                        _dateTime = oView.byId("DTP_1").getValue();

                        if(new Date(_dateTime).toDateString() !== "Invalid Date" || _dateTime === ""){
                            that._firePropertiesChanged();
                            that.dispatchEvent(new Event('onChange'));
                        }
                        else{
                            MessageBox.error("The entered date is invalid. Please enter a valid date.", {
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK
                            });
                        }
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