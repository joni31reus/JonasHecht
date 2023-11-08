(function(){

    let _shadowRoot,
        _id,
        template = document.createElement("template");

    template.innerHTML = `
        <style></style>
    `;
                        
    class TestingVizFrameLineChart extends HTMLElement{
        constructor(){
            super();

            _shadowRoot = this.attachShadow({mode: "open"});
            _shadowRoot.appendChild(template.content.cloneNode(true));

            _id = createGuid();

            _shadowRoot.querySelector("#oView").id = _id + "_oView";
        }

        connectedCallback() {
            try {
                if (window.commonApp) {
                    let outlineContainer = commonApp.getShell().findElements(true, ele => ele.hasStyleClass && ele.hasStyleClass("sapAppBuildingOutline"))[0];

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
            if (this._subscription) { 
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
            loadVizFrameLineChart(this);
        }

        _firePropertiesChanged() {
        }

        async setDataSource(source){
            let that = this;
        }
    }
    customElements.define("krones-sac-testing-sapui5-vizframe-line", TestingVizFrameLineChart);

    function loadVizFrameLineChart(that){
        var that_ = that;

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