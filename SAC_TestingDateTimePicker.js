(function(){

    let template = document.createElement("template");
    template.innerHTML = `<style></style>`;
                        
    class TestingDateTimePicker extends HTMLElement{
        constructor(){
            super();

            this.shadowRoot = this.attachShadow({mode: "open"});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
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

    function loadDateTimePicker(oEvent){
        let sWidgetName = "",
            div         = document.createElement('div');

        div.innerHTML = '<?xml version="1.0"?><script type="sapui5/xmlview"><mvc:View controllerName="myView.Template" xmlns:mvc="sap.ui.core.mvc" xmlns:l="sap.ui.layout xmlns="sap.m"><DateTimePicker id="DTP1" placeholder="Enter Date"/></mvc:View></script>';
    }

})();