sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(UIComponent, JSONModel, Device){
	"use strict";
	
	return UIComponent.extend("dirk.gears.Component", {
		
		metadata : {
			manifest: "json"
		},
		
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
			//additional initialization can be done here
			// set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");
		}
	});
});