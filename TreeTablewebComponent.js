(function() {
    let _shadowRoot;
    let _id;

    let div;
    let widgetName;
    var Ar = [];

    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
    <style>
    </style>      
    `;

    class NetworkGraphForceBased extends HTMLElement {

        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            //_shadowRoot.querySelector("#oView").id = "oView";

            this._export_settings = {};
            this._export_settings.title = "";
            this._export_settings.subtitle = "";
            this._export_settings.icon = "";
            this._export_settings.unit = "";
            this._export_settings.footer = "";

            this.addEventListener("click", event => {
                console.log('click');

            });

            this._firstConnection = 0;
            this.data = [];
        }

        //Get Table Data into Custom Widget Function
            async setDataSource(source) {
                console.log(source);
                
                //Preparing the data
                    var transfers = [],
                        bFirstRun = true;

                    for(var i = 0; i < source.length; i++){
                        if(bFirstRun === true){
                            transfers.push({
                                "Batchname": source[0].Child_TargetBatch.description,
                                "transfers": [{"Batchname": source[0].Child_SourceBatch.description, "transfers": []}]
                            });

                            bFirstRun = false;
                        }

                        if(bFirstRun === false){
                            if(parseInt(source[i].ReferenceID_Child.id.length / 36) === 2){
                                transfers[0].transfers[0].transfers.push({
                                    "Batchname": source[0].Child_SourceBatch.description,
                                    "transfers": []
                                });
                            }
                            else if(parseInt(source[i].ReferenceID_Child.id.length / 36) === 1){
                                transfers[0].transfers.push({
                                    "Batchname": source[0].Child_SourceBatch.description,
                                    "transfers": []
                                });
                            }
                        }
                    }
                //Preparing the data

                var that = this;
                loadthis(that);
            }
        //Get Table Data into Custom Widget Function

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"

                    if (outlineContainer && outlineContainer.getReactProps) {
                        let parseReactState = state => {
                            let components = {};

                            let globalState = state.globalState;
                            let instances = globalState.instances;
                            let app = instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
                            let names = app.names;

                            for (let key in names) {
                                let name = names[key];

                                let obj = JSON.parse(key).pop();
                                let type = Object.keys(obj)[0];
                                let id = obj[type];

                                components[id] = {
                                    type: type,
                                    name: name
                                };
                            }

                            for (let componentId in components) {
                                let component = components[componentId];
                            }

                            let metadata = JSON.stringify({
                                components: components,
                                vars: app.globalVars
                            });

                            if (metadata != this.metadata) {
                                this.metadata = metadata;

                                this.dispatchEvent(new CustomEvent("propertiesChanged", {
                                    detail: {
                                        properties: {
                                            metadata: metadata
                                        }
                                    }
                                }));
                            }
                        };

                        let subscribeReactStore = store => {
                            this._subscription = store.subscribe({
                                effect: state => {
                                    parseReactState(state);
                                    return {
                                        result: 1
                                    };
                                }
                            });
                        };

                        let props = outlineContainer.getReactProps();
                        if (props) {
                            subscribeReactStore(props.store);
                        } else {
                            let oldRenderReactComponent = outlineContainer.renderReactComponent;
                            outlineContainer.renderReactComponent = e => {
                                let props = outlineContainer.getReactProps();
                                subscribeReactStore(props.store);

                                oldRenderReactComponent.call(outlineContainer, e);
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        disconnectedCallback() {
            if (this._subscription) { // react store subscription
                this._subscription();
                this._subscription = null;
            }
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            console.log(changedProperties);
            var that = this;
            //loadthis(that, changedProperties);
        }

        _renderExportButton() {
            let components = this.metadata ? JSON.parse(this.metadata)["components"] : {};
            console.log("_renderExportButton-components");
            console.log(components);
            console.log("end");
        }

        _firePropertiesChanged() {
            this.title = "FD";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        title: this.title
                    }
                }
            }));
        }

        // SETTINGS
        get title() {
            return this._export_settings.title;
        }
        set title(value) {
            console.log("setTitle:" + value);
            this._export_settings.title = value;
        }

        get subtitle() {
            return this._export_settings.subtitle;
        }
        set subtitle(value) {
            this._export_settings.subtitle = value;
        }

        get icon() {
            return this._export_settings.icon;
        }
        set icon(value) {
            this._export_settings.icon = value;
        }

        get unit() {
            return this._export_settings.unit;
        }
        set unit(value) {
            this._export_settings.unit = value;
        }

        get footer() {
            return this._export_settings.footer;
        }
        set footer(value) {
            this._export_settings.footer = value;
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue != newValue) {
                this[name] = newValue;
            }
        }

    }
    customElements.define("com-fd-djaja-sap-sac-networkgraphforcebased", NetworkGraphForceBased);

    // UTILS
    function loadthis(that) {
        var that_ = that;

        widgetName = "networkgraphForcebased_1";
        console.log("widgetName:" + widgetName);
        if (typeof widgetName === "undefined") {
            widgetName = that._export_settings.title.split("|")[0];
            console.log("widgetName_:" + widgetName);
        }

        div = document.createElement('div');
        div.slot = "content_" + widgetName;

        if (that._firstConnection === 0) {
            console.log("--First Time --");

            let div0 = document.createElement('div');
            //Create SAPUI5 Element 
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View id="graph_' + widgetName + '" controllerName="myView.Template" xmlns="sap.ui.table" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%" displayBlock="true"> <TreeTable rows="{' + widgetName + '>/categories}" selectionMode="None" enableSelectAll="false"> <columns> <Column> <m:Label text="Categories"/> <template> <m:Text text="{'+ widgetName +'>name}"/> </template> </Column> <Column> <m:Label text="Price"/> <template> <m:Text text="{'+ widgetName +'>amount}"/> </template> </Column> </columns> </TreeTable> </mvc:View></script>';
            //Create SAPUI5 Element
            _shadowRoot.appendChild(div0);

            let div1 = document.createElement('div');
            div1.innerHTML = '<div id="ui5_content_' + widgetName + '" name="ui5_content_' + widgetName + '"><slot name="content_' + widgetName + '"></slot></div>';
            _shadowRoot.appendChild(div1);

            that_.appendChild(div);

            var mapcanvas_divstr = _shadowRoot.getElementById('oView_' + widgetName);
            Ar.push({
                'id': widgetName,
                'div': mapcanvas_divstr
            });
            console.log(Ar);
        }

        that_._renderExportButton();

        sap.ui.getCore().attachInit(function() {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "sap/ui/core/mvc/Controller",
                "sap/ui/model/json/JSONModel",
                "sap/m/Popover"
            ], function(Controller, JSONModel, Popover) {
                "use strict";

                return Controller.extend("myView.Template", {

                    linePress: function (oEvent) {
                        if (!this._oPopoverForLine) {
                            this._oPopoverForLine = new Popover({
                                title: "Line popover"
                            });
                        }
                        // Prevents render a default tooltip
                        oEvent.preventDefault();
                        this._oPopoverForLine.openBy(oEvent.getParameter("opener"));
                    },

                    onInit: function () {
                        var this_ = this;
                        if (that._firstConnection === 0) {

                            that._firstConnection = 1;

                            var data = [
                                {"categories": [
                                    {"name": "Women", "categories": [
                                        {"name":"Clothing", "categories": [
                                            {"name": "Dresses", "categories": [
                                                {"name": "Casual Red Dress", "amount": 16.99, "currency": "EUR", "size": "S"},
                                                {"name": "Short Black Dress", "amount": 47.99, "currency": "EUR", "size": "M"},
                                                {"name": "Long Blue Dinner Dress", "amount": 103.99, "currency": "USD", "size": "L"}
                                            ]},
                                            {"name": "Tops", "categories": [
                                                {"name": "Printed Shirt", "amount": 24.99, "currency": "USD", "size": "M"},
                                                {"name": "Tank Top", "amount": 14.99, "currency": "USD", "size": "S"}
                                            ]},
                                            {"name": "Pants", "categories": [
                                                {"name": "Red Pant", "amount": 32.99, "currency": "USD", "size": "M"},
                                                {"name": "Skinny Jeans", "amount": 44.99, "currency": "USD", "size": "S"},
                                                {"name": "Black Jeans", "amount": 99.99, "currency": "USD", "size": "XS"},
                                                {"name": "Relaxed Fit Jeans", "amount": 56.99, "currency": "USD", "size": "L"}
                                            ]},
                                            {"name": "Skirts", "categories": [
                                                {"name": "Striped Skirt", "amount": 24.99, "currency": "USD", "size": "M"},
                                                {"name": "Black Skirt", "amount": 44.99, "currency": "USD", "size": "S"}
                                            ]}
                                        ]}
                                    ]}
                                ]}
                            ] 

                            if(that.data !== undefined){
                                var oModel = new JSONModel(data[0]);
                            } else{
                                var oModel = new JSONModel(data[0]);
                            }
                            
                            oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);

                            this_.getView().setModel(oModel, that.widgetName);

                            /*this_.oModelSettings = new JSONModel({
                                maxIterations: 200,
                                maxTime: 500,
                                initialTemperature: 200,
                                coolDownStep: 1,
                                mergeEdges: true,
                                nodePlacement: sap.suite.ui.commons.networkgraph.NodePlacement.LinearSegments,
                                nodeSpacing: 50,
                                lineSpacingFactor: 0.25
                            });
                            this_.getView().setModel(this_.oModelSettings, "settings");*/

                            this_.oGraph = this_.byId("graph_" + widgetName);
                            //this_.oGraph._fZoomLevel = 0.75;
                        }
                    }
                });
            });

            console.log("widgetName Final:" + widgetName);
            var foundIndex = Ar.findIndex(x => x.id == widgetName);
            var divfinal = Ar[foundIndex].div;
            console.log(divfinal);

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function loadScript(src, shadowRoot) {
        return new Promise(function(resolve, reject) {
            let script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                console.log("Load: " + src);
                resolve(script);
            }
            script.onerror = () => reject(new Error(`Script load error for ${src}`));

            shadowRoot.appendChild(script)
        });
    }
})();