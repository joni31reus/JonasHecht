(function(){

    let shadowRoot,
        template = document.createElement("template");
    template.innerHTML = `<style></style>`;
                        
    class TestingDateTimePicker extends HTMLElement{
        constructor(){
            super();

            shadowRoot = this.attachShadow({mode: "open"});
            shadowRoot.appendChild(template.content.cloneNode(true));

            loadDateTimePicker();
        }

        onCustomWidgetBeforeUpdate(oChangedProperties){
            console.log("onCustomWidgetBeforeUpdate");
            console.log(oChangedProperties);
        }

        onCustomWidgetAfterUpdate(oChangedProperties){
            console.log("onCustomWidgetAfterUpdate");
            console.log(oChangedProperties);
        }
    }
    customElements.define("krones-sac-testing-sapui5-datatimepicker", TestingDateTimePicker);

    function loadDateTimePicker(){
        let sWidgetName = "TestingCW",
            div         = document.createElement('div');

        div.innerHTML = '<?xml version="1.0"?><script id="oView" type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns:mvc="sap.ui.core.mvc" xmlns:l="sap.ui.layout xmlns="sap.m"><DateTimePicker id="DTP1" placeholder="Enter Date"/></mvc:View></script>';
        shadowRoot.appendChild(div);

        let mapcanvas_divstr = shadowRoot.getElementbyId('oView' + sWidgetName),
            aArray = [];
            aArray.push({
                'id': sWidgetName,
                'div': mapcanvas_divstr
            });

        sap.ui.getCore().attachInit(function(){
            "use strict";

            sap.ui.define([
                "sap/ui/core/mvc/Controller"
            ], function(Controller){
                "use strict";

                return Controller.extend("myView.Template", {
                    onInit: function(){

                    }
                });
            });
            var foundIndex = aArray.findIndex(x => x.id == sWidgetName);
            var divfinal = aArray[foundIndex].div;

            var oView = sap.ui.xmlview({
                viewContent: jQuery(divfinal).html(),
            });

            oView.placeAt(div);
        });
    }

})();