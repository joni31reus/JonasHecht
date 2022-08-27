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

    class TreeTable extends HTMLElement {

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
            this.aTransferOverviewTree = null;
        }

        //Get Table Data into Custom Widget Function
            async setDataSource(source) {
                console.log(source);
                
                //Preparing the data
                    var aRootNodes = source.filter(source => source.ReferenceID_Child.id.length / 36 === 1);

                    this.aTransferOverviewTree = {
                        "Transfers":{
                            "Batch": aRootNodes[0].Child_TargetBatch.id,
                            "Unit": "",
                            "MaterialNr": "",
                            "MaterialDesc": "",
                            "QTY": "",
                            "UOM": "",
                            "TransferStart": "",
                            "TransferEnd": "",
                            "Multiple": []
                        }
                    };

                    if(aRootNodes !== undefined && aRootNodes.length > 0){
                        function recrusiveHeriarchie(sID){
                            var aChildNodes = [],
                                aNodes = source.filter(source => source.Child_TargetBatch.id === sID );
                            if(aNodes !== undefined && aNodes.length > 0){
                                for(var j in aNodes){
                                    var oCurrObj = aNodes[j],
                                        aChildItems = recrusiveHeriarchie(oCurrObj.Child_SourceBatch.id);
                                    
                                    if(aChildItems.length > 0){
                                        aChildNodes.push({
                                            "Batch": oCurrObj.Child_SourceBatch.id,
                                            "Unit": oCurrObj.SOURCEEQUIIDENT.id,
                                            "MaterialNr": oCurrObj.SOURCEPRODUCTID.id,
                                            "MaterialDesc": "",
                                            "QTY": oCurrObj['@MeasureDimension'].rawValue,
                                            "UOM": oCurrObj.UNITOFMEASURE.id,
                                            "TransferStart": oCurrObj.STARTTRANSFER.id,
                                            "TransferEnd": oCurrObj.ENDTRANSFER.id
                                        });
                                    }
                                    else{
                                        aChildNodes.push({
                                            "Batch": oCurrObj.Child_SourceBatch.id,
                                            "Unit": oCurrObj.SOURCEEQUIIDENT.id,
                                            "MaterialNr": oCurrObj.SOURCEPRODUCTID.id,
                                            "MaterialDesc": "",
                                            "QTY": oCurrObj['@MeasureDimension'].rawValue,
                                            "UOM": oCurrObj.UNITOFMEASURE.id,
                                            "TransferStart": oCurrObj.STARTTRANSFER.id,
                                            "TransferEnd": oCurrObj.ENDTRANSFER.id
                                        });
                                    }
                                }
                            }

                            return aChildNodes;
                        }

                        for(var i in aRootNodes){
                            var oCurrRootObj = aRootNodes[i],
                                aChildItems = recrusiveHeriarchie(oCurrRootObj.Child_SourceBatch.id);

                            this.aTransferOverviewTree.Transfers.Multiple.push({
                                "Batch": oCurrRootObj.Child_SourceBatch.id,
                                "Unit": oCurrRootObj.SOURCEEQUIIDENT.id,
                                "MaterialNr": oCurrRootObj.SOURCEPRODUCTID.id,
                                "MaterialDesc": "",
                                "QTY": oCurrRootObj['@MeasureDimension'].rawValue,
                                "UOM": oCurrRootObj.UNITOFMEASURE.id,
                                "TransferStart": oCurrRootObj.STARTTRANSFER.id,
                                "TransferEnd": oCurrRootObj.ENDTRANSFER.id,
                                "Multiple": aChildItems,
                                "RootNode": true
                            });
                        }
                    }

                console.log(this.aTransferOverviewTree);
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
            console.log("AfterUpdate" + changedProperties);
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
    customElements.define("sac-tree-table-track-and-trace", TreeTable);

    // UTILS
    function loadthis(that) {
        var that_ = that;

        widgetName = "cw_TreeTable_TT";
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
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View id="graph_' + widgetName + '" controllerName="myView.Template" xmlns="sap.ui.table" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%" displayBlock="true"> <TreeTable rows="{' + widgetName + '>/Transfers}" selectionMode="None" enableSelectAll="false"> <columns><Column><m:Label text="Batch"/><template><m:Text text="{'+ widgetName +'>Batch}"/></template></Column><Column><m:Label text="Unit"/><template><m:Text text="{'+ widgetName +'>Unit}"/></template></Column><Column><m:Label text="Materialnumber"/><template><m:Text text="{'+ widgetName +'>MaterialNr}"/></template></Column><Column><m:Label text="Material"/><template><m:Text text="{'+ widgetName +'>Material}"/></template></Column><Column><m:Label text="Quantity"/><template><m:Text text="{'+ widgetName +'>QTY}"/></template></Column><Column><m:Label text="UOM"/><template><m:Text text="{'+ widgetName +'>UOM}"/></template></Column><Column><m:Label text="Transfer-Start"/><template><m:Text text="{'+ widgetName +'>TransferEnd}"/></template></Column><Column><m:Label text="EndTransfer"/><template><m:Text text="{'+ widgetName +'>TransferStart}"/></template></Column></columns> </TreeTable> </mvc:View></script>';
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

                            var oModel = new JSONModel(that.aTransferOverviewTree);
                            
                            oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);

                            this_.getView().setModel(oModel, that.widgetName);

                            this_.oModelSettings = new JSONModel({
                                RowCount: 20
                            });
                            this_.getView().setModel(this_.oModelSettings, "settings");

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