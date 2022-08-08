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

        async setDataSource(source) {
            console.log(source);
            var lines = [],
                nodes = [];
            for(var i = 0; i <= 2; i++){

                //Build Nodes Array for NetworkGraph
                nodes.push({
                    key: source[i]._C_Botec_B.id.split("&")[1].split("[")[1].split("]")[0],
                    title: source[i]._C_Botec_B.properties._C_Botec_B_Child_BotecMaterialDesc
                });

                if(i > 0){
                    //Build Lines Array for NetworkGraph
                    lines.push({
                        from: source[i-1]._C_Botec_B.id.split("&")[1].split("[")[1].split("]")[0],
                        to: source[i]._C_Botec_B.id.split("&")[1].split("[")[1].split("]")[0]
                    });
                }
            }
            this.data.push({
                nodes: nodes,
                lines: lines
            });
            var that = this;
            loadthis(that);
        }

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

        static get observedAttributes() {
            return [
                "title",
                "subtitle",
                "icon",
                "unit",
                "footer",
                "link"
            ];
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
            //div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%"><Graph enableWheelZoom="false" height="100%" width="100%" nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '"><layoutData><m:FlexItemData minWidth="75%" maxWidth="75%"/></layoutData><layoutAlgorithm><layout:ForceDirectedLayout optimalDistanceConstant="0.26" maxIterations="{settings>/maxIterations}" maxTime="{settings>/maxTime}" initialTemperature="{settings>/initialTemperature}" coolDownStep="{settings>/coolDownStep}"></layout:ForceDirectedLayout></layoutAlgorithm><nodes><Node height="{settings>/height}" key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" shape="{' + widgetName + '>shape}" status="{' + widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}"><attributes><ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/></attributes></Node></nodes><lines><Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}"></Line></lines><groups><Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group></groups></Graph></mvc:View></script>';
            div0.innerHTML = '<?xml version="1.0"?><script id="oView_' + widgetName + '" name="oView_' + widgetName + '" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns="sap.suite.ui.commons.networkgraph" xmlns:layout="sap.suite.ui.commons.networkgraph.layout" xmlns:mvc="sap.ui.core.mvc" xmlns:m="sap.m" xmlns:l="sap.ui.layout" height="100%"><l:FixFlex><l:fixContent><m:FlexBox fitContainer="true" renderType="Bare" wrap="Wrap" id="graphWrapper"><m:items><Graph enableWheelZoom="false" height="100%" width="100%" nodes="{' + widgetName + '>/nodes}" lines="{' + widgetName + '>/lines}" groups="{' + widgetName + '>/groups}" id="graph_' + widgetName + '"><layoutData><m:FlexItemData minWidth="100%" maxWidth="100%"/></layoutData><layoutAlgorithm><layout:ForceDirectedLayout optimalDistanceConstant="0.26" maxIterations="{settings>/maxIterations}" maxTime="{settings>/maxTime}" initialTemperature="{settings>/initialTemperature}" coolDownStep="{settings>/coolDownStep}"></layout:ForceDirectedLayout></layoutAlgorithm><nodes><Node height="{settings>/height}" key="{' + widgetName +'>key}" title="{' + widgetName + '>title}" icon="{' + widgetName + '>icon}" group="{' + widgetName + '>group}" attributes="{' + widgetName + '>attributes}" shape="{' + widgetName + '>shape}" status="{' + widgetName + '>status}" x="{' + widgetName + '>x}" y="{' + widgetName + '>y}"><attributes><ElementAttribute label="{' + widgetName + '>label}" value="{' + widgetName + '>value}"/></attributes></Node></nodes><lines><Line from="{' + widgetName + '>from}" to="{' + widgetName + '>to}" status="{' + widgetName + '>status}"></Line></lines><groups><Group key="{' + widgetName + '>key}" title="{' + widgetName + '>title}"></Group></groups></Graph></m:items></m:FlexBox></l:fixContent></l:FixFlex></mvc:View></script>';

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
            ], function(Controller, JSONModel,) {
                "use strict";

                return Controller.extend("myView.Template", {

                    onInit: function () {
                        var this_ = this;

                        if (that._firstConnection === 0) {

                            that._firstConnection = 1;

                            var data = [
                                {
                                    "nodes": [
                                        {
                                            "key": 0,
                                            "title": "Iron Man",
                                            "group": 1,
                                            "status": "Error",
                                            "icon": "sap-icon://key-user-settings",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 2, 2008"
                                                },{
                                                    "label": "Director",
                                                    "value": "Jon Favreau"
                                                }
                                            ]
                                        },{
                                            "key": 1,
                                            "title": "Iron Man 2",
                                            "group": 1,
                                            "status": "Error",
                                            "icon": "sap-icon://key-user-settings",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 7, 2010"
                                                },{
                                                    "label": "Director",
                                                    "value": "Jon Favreau"
                                                }
                                            ]
                                        },{
                                            "key": 2,
                                            "title": "The Incredible Hulk",
                                            "group": 1,
                                            "icon": "sap-icon://theater",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "June 13, 2008"
                                                },{
                                                    "label": "Director",
                                                    "value": "Louis Leterrier"
                                                }
                                            ]
                                        },{
                                            "key": 3,
                                            "title": "Thor",
                                            "group": 1,
                                            "status": "Warning",
                                            "icon": "sap-icon://wrench",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 6, 2011"
                                                },{
                                                    "label": "Director",
                                                    "value": "Kenneth Branagh"
                                                }
                                            ]
                                        },{
                                            "key": 4,
                                            "title": "Captain America: The First Avenger",
                                            "group": 1,
                                            "status": "Success",
                                            "icon": "sap-icon://unfavorite",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "July 22, 2011"
                                                },{
                                                    "label": "Director",
                                                    "value": "Joe Johnston"
                                                }
                                            ]
                                        },{
                                            "key": 5,
                                            "title": "Marvel's The Avengers",
                                            "group": 1,
                                            "status": "Error",
                                            "icon": "sap-icon://text-color",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 4, 2012"
                                                },{
                                                    "label": "Director",
                                                    "value": "Joss Whedon"
                                                }
                                            ]
                                        },{
                                            "key": 6,
                                            "title": "Iron Man 3",
                                            "group": 2,
                                            "status": "Error",
                                            "icon": "sap-icon://key-user-settings",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 3, 2013"
                                                },{
                                                    "label": "Director",
                                                    "value": "Shane Black"
                                                }
                                            ]
                                        },{
                                            "key": 7,
                                            "title": "Thor: The Dark World",
                                            "group": 2,
                                            "status": "Warning",
                                            "icon": "sap-icon://wrench",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "November 8, 2013"
                                                },{
                                                    "label": "Director",
                                                    "value": "Alan Taylor"
                                                }
                                            ]
                                        },{
                                            "key": 8,
                                            "title": "Captain America: The Winter Soldier",
                                            "group": 2,
                                            "status": "Success",
                                            "icon": "sap-icon://unfavorite",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "April 4, 2014"
                                                },{
                                                    "label": "Director",
                                                    "value": "Anthony & Joe Russo"
                                                }
                                            ]
                                        },{
                                            "key": 9,
                                            "title": "Doctor Strange",
                                            "group": 3,
                                            "icon": "sap-icon://activate",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "November 4, 2016"
                                                },{
                                                    "label": "Director",
                                                    "value": "Scott Derrickson"
                                                }
                                            ]
                                        },{
                                            "key": 10,
                                            "title": "Avengers: Age of Ultron",
                                            "group": 2,
                                            "status": "Error",
                                            "icon": "sap-icon://text-color",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 1, 2015"
                                                },{
                                                    "label": "Director",
                                                    "value": "Joss Whedon"
                                                }
                                            ]
                                        },{
                                            "key": 11,
                                            "title": "Ant-Man and the Wasp",
                                            "group": 3,
                                            "icon": "sap-icon://chain-link",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "July 6, 2018"
                                                },{
                                                    "label": "Director",
                                                    "value": "Peyton Reed"
                                                }
                                            ]
                                        },{
                                            "key": 12,
                                            "title": "Thor: Ragnarok",
                                            "group": 3,
                                            "status": "Warning",
                                            "icon": "sap-icon://wrench",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "November 3, 2017"
                                                },{
                                                    "label": "Director",
                                                    "value": "Taika Waititi"
                                                }
                                            ]
                                        },{
                                            "key": 13,
                                            "title": "Ant-Man",
                                            "group": 2,
                                            "icon": "sap-icon://chain-link",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "July 17, 2015"
                                                },{
                                                    "label": "Director",
                                                    "value": "Peyton Reed"
                                                }
                                            ]
                                        },{
                                            "key": 14,
                                            "title": "Captain America: Civil War",
                                            "group": 3,
                                            "status": "Success",
                                            "icon": "sap-icon://unfavorite",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 6, 2016"
                                                },{
                                                    "label": "Director",
                                                    "value": "Anthony & Joe Russo"
                                                }
                                            ]
                                        },{
                                            "key": 15,
                                            "title": "Guardians of the Galaxy",
                                            "group": 2,
                                            "icon": "sap-icon://shield",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "August 1, 2014"
                                                },{
                                                    "label": "Director",
                                                    "value": "James Gunn"
                                                }
                                            ]
                                        },{
                                            "key": 16,
                                            "title": "Spider-Man: Homecoming",
                                            "group": 3,
                                            "icon": "sap-icon://tree",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "July 7, 2017"
                                                },{
                                                    "label": "Director",
                                                    "value": "Jon Watts"
                                                }
                                            ]
                                        },{
                                            "key": 17,
                                            "title": "Black Panther",
                                            "group": 3,
                                            "icon": "sap-icon://circle-task-2",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "February 16, 2018"
                                                },{
                                                    "label": "Director",
                                                    "value": "Ryan Coogler"
                                                }
                                            ]
                                        },{
                                            "key": 18,
                                            "title": "Guardians of the Galaxy Vol. 2",
                                            "icon": "sap-icon://shield",
                                            "group": 3,
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 5, 2017"
                                                },{
                                                    "label": "Director",
                                                    "value": "James Gunn"
                                                }
                                            ]
                                        },{
                                            "key": 19,
                                            "title": "'Avengers 4'",
                                            "group": 3,
                                            "status": "Error",
                                            "icon": "sap-icon://text-color",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "May 3, 2019"
                                                },{
                                                    "label": "Director",
                                                    "value": "Anthony & Joe Russo"
                                                }
                                            ]
                                        },{
                                            "key": 20,
                                            "title": "Avengers: Infinity War",
                                            "group": 3,
                                            "status": "Error",
                                            "icon": "sap-icon://text-color",
                                            "attributes": [
                                                {
                                                    "label": "Release date",
                                                    "value": "April 27, 2018"
                                                },{
                                                    "label": "Director",
                                                    "value": "Anthony & Joe Russo"
                                                }
                                            ]
                                        }
                                    ],
                                    "lines": [
                                        {"from": 0, "to": 1},
                                        {"from": 1, "to": 5},
                                        {"from": 2, "to": 5},
                                        {"from": 3, "to": 5},
                                        {"from": 4, "to": 5},
                                        {"from": 5, "to": 6},
                                        {"from": 5, "to": 7},
                                        {"from": 5, "to": 8},
                                        {"from": 6, "to": 10},
                                        {"from": 7, "to": 10},
                                        {"from": 8, "to": 10},
                                        {"from": 9, "to": 12},
                                        {"from": 10, "to": 12},
                                        {"from": 10, "to": 13},
                                        {"from": 13, "to": 11},
                                        {"from": 10, "to": 14},
                                        {"from": 13, "to": 14},
                                        {"from": 14, "to": 16},
                                        {"from": 14, "to": 17},
                                        {"from": 12, "to": 20},
                                        {"from": 16, "to": 20},
                                        {"from": 17, "to": 20},
                                        {"from": 15, "to": 18},
                                        {"from": 18, "to": 20},
                                        {"from": 5, "to": 19},
                                        {"from": 10, "to": 19},
                                        {"from": 20, "to": 19}
                                    ],
                                    "groups": [
                                        {"key": 1, "title": "Phase One"},
                                        {"key": 2, "title": "Phase Two"},
                                        {"key": 3, "title": "Phase Three"}
                                    ]
                                }
                            ];
                            
                            var oGraph;
                            if(that.data !== undefined){
                                var oModel = new JSONModel(that.data[0]);
                            } else{
                                var oModel = new JSONModel(data[0]);
                            }
                            
                            oModel.setSizeLimit(Number.MAX_SAFE_INTEGER);

                            this_.getView().setModel(oModel, that.widgetName);

                            this_.oModelSettings = new JSONModel({
                                maxIterations: 200,
                                maxTime: 500,
                                initialTemperature: 200,
                                coolDownStep: 1
                            });
                            this_.getView().setModel(this_.oModelSettings, "settings");

                            this_.oGraph = this_.byId("graph_" + widgetName);
                            this_.oGraph._fZoomLevel = 0.75;
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