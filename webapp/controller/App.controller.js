sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	'sap/m/MessageStrip',
	'sap/ui/core/library',
	"sap/ui/model/json/JSONModel",
	"sap/base/util/UriParameters"
],	function (Controller, MessageToast, MessageStrip, coreLibrary, JSONModel, UriParameters) {
	"use strict";
	
	var oModel;
	var oSelectedGraphics;
	var oHistoryPushStateDebounceTimer;

	return Controller.extend("dirk.gears.controller.App", {
		onInit : function () {
				// get "gears" Model which is defined in manifest and wait until the model data is loaded
				var oGearsModel = this.getOwnerComponent().getModel("gears");
				oGearsModel.setSizeLimit(200);
				oGearsModel.attachRequestCompleted( function(evt) {
					this.onAllDataIsReady();
				}.bind(this));
    	},
      
		onDisplayHelp: function(oEvent){
	         var oView = this.getView();
	         var oDialog = oView.byId("helpDialog");
	         // create dialog lazily
	         if (!oDialog) {
	            // create dialog via fragment factory
	            oDialog = sap.ui.xmlfragment(oView.getId(), "dirk.gears.view.HelpDialog", this);
	            oView.addDependent(oDialog);
	         }
	
	         oDialog.open();
				
		},
		
		onCloseDisplayHelp : function () {
			this.getView().byId("helpDialog").close();
		},
		
		onSettingsDialog: function(oEvent){
	         var oView = this.getView();
	         var oDialog = oView.byId("settingsDialog");
	         // create dialog lazily
	         if (!oDialog) {
	            // create dialog via fragment factory
	            oDialog = sap.ui.xmlfragment(oView.getId(), "dirk.gears.view.SettingsDialog", this);
	            oView.addDependent(oDialog);
	         }
	
	         oDialog.open();
				
		},
		
		onCloseSettingsDialog : function () {
			if (oModel.oData.displayData.minCadence > 10 &&
				oModel.oData.displayData.maxCadence < 200 &&
				oModel.oData.displayData.maxCadence > oModel.oData.displayData.minCadence &&
				oModel.oData.displayData.minTeethCogs > 0 && 
				oModel.oData.displayData.maxTeethCogs > oModel.oData.displayData.minTeethCogs && 
				oModel.oData.displayData.maxTeethCogs < 100 &&
				oModel.oData.displayData.minTeethChainrings > 0 && 
				oModel.oData.displayData.maxTeethChainrings > oModel.oData.displayData.minTeethChainrings && 
				oModel.oData.displayData.maxTeethChainrings < 100 &&
				oModel.oData.displayData.maxNumberChainrings < 6 &&
				oModel.oData.displayData.maxNumberChainrings > 0 &&
				oModel.oData.displayData.maxNumberCogs < 21 &&
				oModel.oData.displayData.maxNumberCogs > 0){
					this.getView().byId("settingsDialog").close();
					this.getView().byId("selectCadence").setMin(Number(oModel.oData.displayData.minCadence));
					this.getView().byId("selectCadence").setMax(Number(oModel.oData.displayData.maxCadence));
					this.getView().byId("cogControls").setMinteeth(Number(oModel.oData.displayData.minTeethCogs));
					this.getView().byId("cogControls").setMaxteeth(Number(oModel.oData.displayData.maxTeethCogs));
					this.getView().byId("cogControls").setNsprockets(Number(oModel.oData.displayData.maxNumberCogs));
					this.getView().byId("chainringControls").setMinteeth(Number(oModel.oData.displayData.minTeethChainrings));
					this.getView().byId("chainringControls").setMaxteeth(Number(oModel.oData.displayData.maxTeethChainrings));
					this.getView().byId("chainringControls").setNsprockets(Number(oModel.oData.displayData.maxNumberChainrings));
				}
		},
		
		onCancelSettingsDialog : function () {
			this.getView().byId("settingsDialog").close();
		},

      // this function is called when the "gears" models has been loaded
    	onAllDataIsReady: function(){
        	//console.log("Gears Model loaded");
        	
	      	// get gearing data from URL parameters
			var oUriParameters = new UriParameters(window.location.href);
			var sGears 			= oUriParameters.get("GR");
			var sChainrings	 	= oUriParameters.get("KB");
			var sCogs 			= oUriParameters.get("RZ");
			var sCircumference 	= oUriParameters.get("UF");
			var sGears2 		= oUriParameters.get("GR2");
			var sChainrings2 	= oUriParameters.get("KB2");
			var sCogs2 			= oUriParameters.get("RZ2");
			var sCircumference2 = oUriParameters.get("UF2");
			var sCadence		= oUriParameters.get("TF");
			var sChainAngle 	= oUriParameters.get("SL");
			var sUnits			= oUriParameters.get("UN");
			var sDisplayValueId	= oUriParameters.get("DV");
	      	
    		this.getView().byId("selectCogSet").setCogs = function(aCogs, that) {
				var a = 1;
				var aCogSets = that.getView().getModel("gears").getProperty("/CogSets");
				that.getView().byId("selectCogSet").setSelectedKey(aCogSets[0].name);
				for (var i in aCogSets){
					if (JSON.stringify(aCogs.sort()) === JSON.stringify(aCogSets[i].set.sort())){
						that.getView().byId("selectCogSet").setSelectedKey(aCogSets[i].name);
						return;
					}
				}
    		};
    		
    		this.getView().byId("selectChainringSet").setChainrings = function(aChainrings, that) {
				var aChainringSets = that.getView().getModel("gears").getProperty("/ChainringSets");
				that.getView().byId("selectChainringSet").setSelectedKey(aChainringSets[0].name);
				for (var i in aChainringSets){
					if (JSON.stringify(aChainrings.sort()) === JSON.stringify(aChainringSets[i].set.sort())){
						that.getView().byId("selectChainringSet").setSelectedKey(aChainringSets[i].name);
					}
				}
    		};

        	// get Ratios of Hubs and tire names from Gears.json as choosen in URL
        	var aHubData = this.getView().getModel("gears").getProperty("/HubData");
        	this.getView().getModel("gears").getProperty("/HubData")[0].name = "XXX";
			for (var i in aHubData ){
		      	if (aHubData[i].id == sGears){
		      		var aRatios = aHubData[i].ratios;
		      		var sHubName = aHubData[i].name; 
					var minRatios = aHubData[i].minRatios;
		      	}
		      	if (aHubData[i].id == sGears2){
					var aRatios2 = aHubData[i].ratios;
		      		var sHubName2 = aHubData[i].name; 
					var minRatios2 = aHubData[i].minRatios;
				}
			}
			var aTireData = this.getView().getModel("gears").getProperty("/TireSizes");
			for ( i in aTireData ){
		      	if (aTireData[i].size.toString() == sCircumference){
		      		var sTireName = aTireData[i].inch + "/" + aTireData[i].ETRTO;
		      	}
		      	if (aTireData[i].size.toString() == sCircumference2){
					var sTireName2 = aTireData[i].inch + "/" + aTireData[i].ETRTO;
		      	}
			}
			
			// get Internationalization data
			var bi18n = this.getView().getModel("i18n").getResourceBundle();
			
			// set text of first selectable item in selectGears language dependent
			this.getView().byId("selectGears").getItemAt(0).setText(bi18n.getText("derailleurs"));

	         var oGearingData = {
	            gearData : {
	            	chainrings : (sChainrings !== null)? sChainrings.split(",").map(Number) : [22,36],
	            	cogs : (sCogs !== null)? sCogs.split(",").map(Number) : [11,13,15,17,19,21,24,28,32,36],
	            	hubId : (sGears !== null) ? sGears : "DERS",
	            	name : (sGears !== null) ? sHubName : "",
	            	minRatios : (sGears !== null)? minRatios : {default: 0.0},
	            	ratios: (sGears !== null) ? aRatios : [1.0],
	            	tireName: (sTireName)? sTireName : "27,5/2215",
	            	circumference : (sCircumference !== null)? Number(sCircumference) : 2215,
	            	cadence : (sCadence !== null)? Number(sCadence) : 90,
					gearFactor : 1.0
	            },
	            gearData2 : {
	            	chainrings : (sChainrings2 !== null)? sChainrings2.split(",").map(Number) : [30],
	            	cogs : (sCogs2 !== null)? sCogs2.split(",").map(Number) : [10,12,14,16,18,21,24,28,32,36,42],
	            	hubId : (sGears2 !== null) ? sGears2 : "DERS",
	            	name : (sGears2 !== null) ? sHubName2 : "",
	            	minRatios : (sGears2 !== null)? minRatios2 : {default: 0.0},
	            	ratios: (sGears2 !== null) ? aRatios2 : [1.0],
	            	tireName: (sTireName2)? sTireName2 : "27,5/2215",
	            	circumference : (sCircumference2 !== null)? Number(sCircumference2) : 2215,
	            	cadence : (sCadence !== null)? Number(sCadence) : 90,
					gearFactor : 1.0
	            },
	            displayData :{
	            	maxChainAngle : (sChainAngle !== null)? Number(sChainAngle) : 2.6,
	            	displayValueId : (sDisplayValueId !== null)? sDisplayValueId : "teeth",
	            	displayValues : [
	            		{id : "teeth", name : bi18n.getText("teeth")},
	            		{id : "cogs", name : bi18n.getText("cogs")},
	            		{id : "development", name : bi18n.getText("development")},
	            		{id : "gearInches", name : bi18n.getText("gearInches")},
	            		{id : "ratio", name : bi18n.getText("ratio")},
	            		{id : "speed", name : bi18n.getText("speed")}
	            	],
	            	unitsIndex : (sUnits == "MPH")? 1 : 0,	           //parseInt(sUnits) : 0,
					riderWeightGt100 : 0,
					totalWeightGt250 : 0,
	            	compare : (sGears2 !== null),
	            	maxCadence : 120,
	            	minCadence : 60,
	            	minTeethChainrings : 20,
	            	maxTeethChainrings : 64,
	            	minTeethCogs : 9,
	            	maxTeethCogs : 52,
	            	maxNumberChainrings : 3,
	            	maxNumberCogs : 13,
	            	origMinTeethChainrings : 20,
	            	origMaxTeethChainrings : 64,
					logScale : true
	            }
	         };
	         oModel = new JSONModel(oGearingData);
	         oModel.getURL = function(){
	         	var url = window.location.pathname  
	        	+ "?GR=" + oModel.oData.gearData.hubId
	        	+ "&KB=" + oModel.oData.gearData.chainrings 
	        	+ "&RZ=" + oModel.oData.gearData.cogs
	        	+ "&UF=" + oModel.oData.gearData.circumference
	        	+ "&TF=" + oModel.oData.gearData.cadence
	        	+ "&SL=" + oModel.oData.displayData.maxChainAngle
	        	+ "&UN=" + ((oModel.oData.displayData.unitsIndex == 1)? "MPH" : "KMH")
	        	+ "&DV=" + oModel.oData.displayData.displayValueId;
	        	if (oModel.oData.displayData.compare){
	        		url = url 
	        		+ "&GR2=" + oModel.oData.gearData2.hubId
	        		+ "&KB2=" + oModel.oData.gearData2.chainrings 
	        		+ "&RZ2=" + oModel.oData.gearData2.cogs
	        		+ "&UF2=" + oModel.oData.gearData2.circumference;
	        	}
	        	return url;
	         };

			 oModel.getMaxDev = function(){
				var dev1 = this.oData.gearData.chainrings.sort((a,b)=>a-b)[this.oData.gearData.chainrings.length-1]/this.oData.gearData.cogs.sort((a,b)=>a-b)[0] * oModel.oData.gearData.circumference;
				var dev2 = this.oData.gearData2.chainrings.sort((a,b)=>a-b)[this.oData.gearData2.chainrings.length-1]/this.oData.gearData2.cogs.sort((a,b)=>a-b)[0] * oModel.oData.gearData2.circumference;
				return (this.oData.displayData.compare)? Math.max(dev1, dev2) : dev1 ;
			}

			 oModel.getMinDev = function(){
				var dev1 = this.oData.gearData.chainrings.sort((a,b)=>a-b)[0]/this.oData.gearData.cogs.sort((a,b)=>a-b)[this.oData.gearData.cogs.length-1] * oModel.oData.gearData.circumference;
				var dev2 = this.oData.gearData2.chainrings.sort((a,b)=>a-b)[0]/this.oData.gearData2.cogs.sort((a,b)=>a-b)[this.oData.gearData2.cogs.length-1] * oModel.oData.gearData2.circumference;
				return (this.oData.displayData.compare)? Math.min(dev1, dev2) : dev1;
			 }

	         this.getView().setModel(oModel);
	         
	         // set binding context initially to first set of gears for whole page
	         this.context = oModel.createBindingContext("/gearData");
	         this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
		     this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData.circumference);
	         oSelectedGraphics = this.getView().byId("gearGraphics");
	         
			 this.getView().byId("selectChainringSet").setChainrings(oModel.oData.gearData.chainrings, this);
			 this.getView().byId("selectCogSet").setCogs(oModel.oData.gearData.cogs, this);
 
			 this.updateUrl();

			 // register custom controls for automatic repainting after resizing
	         var fRepaint = function(oEvent){
				var resizeTargetCtrl = oEvent.control;
				resizeTargetCtrl.repaint();
			 };
	         sap.ui.core.ResizeHandler.register( this.getView().byId("gearGraphics"), fRepaint );
			 sap.ui.core.ResizeHandler.register( this.getView().byId("gearGraphics2"), fRepaint );
	         sap.ui.core.ResizeHandler.register( this.getView().byId("chainringControls"), fRepaint );
	         sap.ui.core.ResizeHandler.register( this.getView().byId("cogControls"), fRepaint );

			 this.setControlsState(oModel.oData.gearData.hubId);

    	},
    	
		onGearSelected: function(oEvent) {
			//MessageToast.show("Gears selected");

			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).ratios = obj.ratios;
			oModel.getObject("", this.context).name = obj.name;
			oModel.getObject("", this.context).minRatios = obj.minRatios;
			oModel.getObject("", this.context).chainrings = obj.defCr;
			oModel.getObject("", this.context).cogs = obj.defCog;
			oModel.getObject("", this.context).avlCogs = obj.avlCogs;
			this.getView().byId("selectChainringSet").setChainrings( obj.defCr, this);
			this.getView().byId("selectCogSet").setCogs(obj.defCog, this);
	        this.updateUrl();
			this.setControlsState(obj.id);
		},

		setControlsState: function( hubType ){
			if (hubType=="RLSH") {
				this.getView().byId("chainringControls").setMinteeth(14);
				this.getView().byId("chainringControls").setMaxteeth(58);
			}else{
				this.getView().byId("chainringControls").setMinteeth(oModel.oData.displayData.origMinTeethChainrings);
				this.getView().byId("chainringControls").setMaxteeth(oModel.oData.displayData.origMaxTeethChainrings);
			}
			if (hubType=="RLSH") {
				this.getView().byId("vBSelectCogSet").setVisible(false);
				this.getView().byId("vBSelectChainringSet").setVisible(false);
				this.getView().byId("vBSelectBikeType").setVisible(true);
				this.getView().byId("vBSelectRiderWeight").setVisible(true);
			}else{
				this.getView().byId("vBSelectCogSet").setVisible(true);
				this.getView().byId("vBSelectChainringSet").setVisible(true);
				this.getView().byId("vBSelectBikeType").setVisible(false);
				this.getView().byId("vBSelectRiderWeight").setVisible(false);
			}
			if (hubType=="DERS") {
				this.getView().byId("selectChainringSet").setEnabled(true);
				this.getView().byId("selectCogSet").setEnabled(true);
				this.getView().byId("selectMaxChainAngle").setEnabled(true);
			} else {
				if (hubType=="CLAS"){
					this.getView().byId("selectCogSet").setEnabled(true);
				}else{
					this.getView().byId("selectCogSet").setEnabled(false);
				}
				this.getView().byId("selectChainringSet").setEnabled(false);
				this.getView().byId("selectMaxChainAngle").setEnabled(false);
			}

		},
		
		onTireSizeSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).circumference = obj.size;
			oModel.getObject("", this.context).tireName = obj.inch + "/" + obj.ETRTO + " " + obj.description;
	        this.updateUrl();
		},
		
		onChainringSetSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).chainrings = obj.set;
	        this.updateUrl();
		},
		
		onCogSetSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).cogs = obj.set;
	        this.updateUrl();
		},
		
		onCadenceSelected: function(oEvent) {
			oModel.getObject("", this.context).cadence = oEvent.getParameter("value");
	        this.updateUrl();
		},
		
		onChangeCircumference: function(oEvent) {
			var circumference = oEvent.getParameter("value");
			var cCode = circumference.charCodeAt( circumference.length-1 );
			if ( cCode > 57 || cCode < 48 ){
				circumference = circumference.slice(0,circumference.length-1);
				this.getView().byId("inpCircumference").setValue(circumference);
			}
			if (circumference.length === 4){
				oModel.getObject("", this.context).circumference = parseInt(circumference);
				oModel.getObject("", this.context).tireSize = parseInt(circumference);
				oModel.getObject("", this.context).tireName = circumference;
	        	this.updateUrl();
				oSelectedGraphics.setCircumference(circumference);
				this.getView().byId("selectTires").setSelectedKey(null);
			}
		},

		onCircumferenceChange: function(oEvent) {
			var circumference = oEvent.getParameter("value");
			oSelectedGraphics.setCircumference(circumference);
			oModel.getObject("", this.context).tireName = circumference;
			this.updateUrl();
		},

		onMaxChainAngleSelected: function(oEvent) {
			oModel.getObject("/displayData").maxChainAngle = oEvent.getParameter("value");
	        this.updateUrl();
		},
		
		onChainringChange: function(oEvent) {
			this.getView().byId("selectChainringSet").setChainrings( oEvent.getSource().getSprockets(), this);
	        this.updateUrl();
		},
		
		onCogChange: function(oEvent) {
			this.getView().byId("selectCogSet").setCogs(oEvent.getSource().getSprockets(), this);
	        this.updateUrl();
		},
		
		ondisplayValueSelected: function(oEvent) {
	        this.updateUrl();
		},

		onSelectUnits: function(oEvent) {
	        this.updateUrl();
		},
		
		onGraphicsSelected: function(oEvent) {
			if (oModel.oData.displayData.compare){

				// check which gearGraphics control has been clicked
				var sControlId = oEvent.getSource().getId();
				//oEvent.getSource().addStyleClass("selectedGraphics");
				if ( sControlId.search("gearGraphics2") > 0){
					oSelectedGraphics = this.getView().byId("gearGraphics2");
	        		this.context = this.getView().getModel().createBindingContext("/gearData2");
	        		this.getView().byId("gearGraphics").removeStyleClass("selectedGraphics");
	        		this.getView().byId("gearGraphics2").addStyleClass("selectedGraphics");
		        	this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
					this.getView().byId("selectChainringSet").setChainrings(oModel.oData.gearData2.chainrings, this);
					this.getView().byId("selectCogSet").setCogs(oModel.oData.gearData2.cogs, this);
					this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData2.circumference, this);
					this.setControlsState(oModel.oData.gearData2.hubId);

				}else{
					oSelectedGraphics = this.getView().byId("gearGraphics");
	        		this.context = this.getView().getModel().createBindingContext("/gearData");
	        		this.getView().byId("gearGraphics").addStyleClass("selectedGraphics");
	        		this.getView().byId("gearGraphics2").removeStyleClass("selectedGraphics");
		        	this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
					this.getView().byId("selectChainringSet").setChainrings(oModel.oData.gearData.chainrings, this);
					this.getView().byId("selectCogSet").setCogs(oModel.oData.gearData.cogs, this);
					this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData.circumference, this);
					this.setControlsState(oModel.oData.gearData.hubId);
				}
	    	    this.updateUrl();
			}
		},
		 

		// compare button is pressed.
		// Either second graphics appears gets focus and controls are set to second data set (gearData2)
		// or second graphics is switched off, first graphic gets focus and controls are set to first data set (gearData)
		onPress: function(oEvent) {
			if (oModel.oData.displayData.compare){
				oModel.oData.gearData2.hubId = oModel.oData.gearData.hubId;
				oModel.oData.gearData2.name = oModel.oData.gearData.name;
				oModel.oData.gearData2.ratios = oModel.oData.gearData.ratios;
				oModel.oData.gearData2.minRatios = oModel.oData.gearData.minRatios;
				oModel.oData.gearData2.chainrings = oModel.oData.gearData.chainrings;
				oModel.oData.gearData2.cogs = oModel.oData.gearData.cogs;
				oModel.oData.gearData2.circumference = oModel.oData.gearData.circumference;
				oModel.oData.gearData2.tireName = oModel.oData.gearData.tireName;
				this.getView().byId("gearGraphics2").addStyleClass("selectedGraphics");
				this.context = this.getView().getModel().createBindingContext("/gearData2");
		    	this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
				this.getView().byId("selectChainringSet").setChainrings(oModel.oData.gearData2.chainrings, this);
				this.getView().byId("selectCogSet").setCogs(oModel.oData.gearData2.cogs, this);
				this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData2.circumference, this);
			}
			else {
				this.getView().byId("gearGraphics").removeStyleClass("selectedGraphics");
				this.context = this.getView().getModel().createBindingContext("/gearData");
			    this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
			}
		    //this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
	    	this.updateUrl();
		},
		
		onCloseBanner: function(oEvent){
			this.getView().byId("banner").setVisible(false);
		},

		calcMinMaxValues: function(){

		},

		iniFrame: function() {
     
			if(window.self !== window.top) {
				return true;
			}
			else {
				return false;
			}
		},

		updateUrl: function() {
			let url = oModel.getURL();
			
			this.getView().byId("showURL").setHref();

			// Debounce the `history.replaceState` call to occur at most every 20ms.
			// This prevents `SecurityError`s emitted when this function is called too
			// frequently.
			if(oHistoryPushStateDebounceTimer != null) {
				clearTimeout(oHistoryPushStateDebounceTimer)
			}
			oHistoryPushStateDebounceTimer = setTimeout(() => {
				window.history.replaceState(null, null, url)
			}, 20);

		}
	});
});