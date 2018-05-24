sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
],	function (Controller, MessageToast, JSONModel) {
	"use strict";
	
	var oModel;
	var oSelectedGraphics;

	return Controller.extend("dirk.gears.controller.App", {
		onInit : function () {
      		// get "gears" Model which is defined in manifest and wait until the model data is loaded
			var oGearsModel = this.getOwnerComponent().getModel("gears");
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
		
      // this function is called when the "gears" models has been loaded
    	onAllDataIsReady: function(){
        	//console.log("Gears Model loaded");
        	
	      	// get gearing data from URL parameters
	      	var sGears 			= jQuery.sap.getUriParameters().get("GR");
	      	var sChainrings	 	= jQuery.sap.getUriParameters().get("KB");
	      	var sCogs 			= jQuery.sap.getUriParameters().get("RZ");
	      	var sCircumference 	= jQuery.sap.getUriParameters().get("UF");
	      	var sGears2 		= jQuery.sap.getUriParameters().get("GR2");
	      	var sChainrings2 	= jQuery.sap.getUriParameters().get("KB2");
	      	var sCogs2 			= jQuery.sap.getUriParameters().get("RZ2");
	      	var sCircumference2 = jQuery.sap.getUriParameters().get("UF2");
	      	var sCadence		= jQuery.sap.getUriParameters().get("TF");
	      	var sChainAngle 	= jQuery.sap.getUriParameters().get("SL");
	      	var sUnits			= jQuery.sap.getUriParameters().get("UN");
	      	var sDisplayValueId	= jQuery.sap.getUriParameters().get("DV");
	      	
    		this.getView().byId("selectCogSet").setCogs = function(aCogs, that) {
    			var a = 1;
				var aCogSets = that.getView().getModel("gears").getProperty("/CogSets");
				that.getView().byId("selectCogSet").setSelectedKey(aCogSets[0].name);
				for (var i in aCogSets){
					if (JSON.stringify(aCogs.sort()) === JSON.stringify(aCogSets[i].set.sort())){
						that.getView().byId("selectCogSet").setSelectedKey(aCogSets[i].name);
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



        	// get Ratios of Hubs and tire names from Gears.jason as choosen in URL
        	var aHubData = this.getView().getModel("gears").getProperty("/HubData");
        	this.getView().getModel("gears").getProperty("/HubData")[0].name = "XXX";
			for (var i in aHubData ){
		      	if (aHubData[i].id == sGears){
		      		var aRatios = aHubData[i].ratios;
		      		var sHubName = aHubData[i].name; 
		      	}
		      	if (aHubData[i].id == sGears2){
					var aRatios2 = aHubData[i].ratios;
		      		var sHubName2 = aHubData[i].name; 
		      	}
			}
			var aTireData = this.getView().getModel("gears").getProperty("/TireSizes");
			for ( i in aTireData ){
		      	if (aTireData[i].size.toString() == sCircumference){
		      		var sTireName = aTireData[i].inch +"/" + aTireData[i].ETRTO;
		      	}
		      	if (aTireData[i].size.toString() == sCircumference2){
					var sTireName2 = aTireData[i].inch +"/" + aTireData[i].ETRTO;
		      	}
			}
			
			// get Internationalization data
			var bi18n = this.getView().getModel("i18n").getResourceBundle();
			
			// set text of first selectable item in selectGears language dependent
			this.getView().byId("selectGears").getItemAt(0).setText(bi18n.getText("derailleurs"));

	         var oGearingData = {
	            gearData : {
	            	chainrings : (sChainrings !== null)? sChainrings.split(",").map(Number) : [22,36],
	            	cogs : (sCogs !== null)? sCogs.split(",").map(Number) : [11,12,14,16,18,21,24,28,32,36],
	            	hubId : (sGears !== null) ? sGears : "DERS",
	            	name : (sGears !== null) ? sHubName : "",
	            	minRatio : 0.0,
	            	ratios: (sGears !== null) ? aRatios : [1.0],
	            	tireName: (sTireName)? sTireName : "27,5/2215",
	            	circumference : (sCircumference !== null)? Number(sCircumference) : 2215,
	            	cadence : (sCadence !== null)? Number(sCadence) : 90
	            },
	            gearData2 : {
	            	chainrings : (sChainrings2 !== null)? sChainrings2.split(",").map(Number) : [30],
	            	cogs : (sCogs2 !== null)? sCogs2.split(",").map(Number) : [10,12,14,16,18,21,24,28,32,36,42],
	            	hubId : (sGears2 !== null) ? sGears2 : "DERS",
	            	name : (sGears2 !== null) ? sHubName2 : "",
	            	minRatio : 0.0,
	            	ratios: (sGears2 !== null) ? aRatios2 : [1.0],
	            	tireName: (sTireName2)? sTireName2 : "27,5/2215",
	            	circumference : (sCircumference2 !== null)? Number(sCircumference2) : 2215,
	            	cadence : (sCadence !== null)? Number(sCadence) : 90
	            },
	            displayData :{
	            	maxChainAngle : 2.6,
	            	displayValueId : (sDisplayValueId !== null)? sDisplayValueId : "teeth",
	            	displayValues : [
	            		{id : "teeth", name : bi18n.getText("teeth")},
	            		{id : "development", name : bi18n.getText("development")},
	            		{id : "gearInches", name : bi18n.getText("gearInches")},
	            		{id : "ratio", name : bi18n.getText("ratio")},
	            		{id : "speed", name : bi18n.getText("speed")}
	            	],
	            	unitsIndex : (sUnits == "MPH")? 1 : 0,	           //parseInt(sUnits) : 0,
	            	compare : (sGears2 !== null)
	            }
	         };
	         oModel = new JSONModel(oGearingData);
	         oModel.getURL = function(){
	         	var url = "http://www.ritzelrechner.de/"
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

	         this.getView().setModel(oModel);
	         
	         // set binding context initially to first set of gears for whole page
	         this.context = oModel.createBindingContext("/gearData");
	         this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
		     this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData.circumference);
	         oSelectedGraphics = this.getView().byId("gearGraphics");
	         
	         // register custom controls for automatic repainting after resizing
	         var fRepaint = function(oEvent){
				var resizeTargetCtrl = oEvent.control;
				resizeTargetCtrl.repaint();
				};
	         sap.ui.core.ResizeHandler.register( this.getView().byId("gearGraphics"), fRepaint );
			 sap.ui.core.ResizeHandler.register( this.getView().byId("gearGraphics2"), fRepaint );
	         sap.ui.core.ResizeHandler.register( this.getView().byId("chainringControls"), fRepaint );
	         sap.ui.core.ResizeHandler.register( this.getView().byId("cogControls"), fRepaint );
             
			this.getView().byId("selectChainringSet").setChainrings(oModel.oData.gearData.chainrings, this);
			this.getView().byId("selectCogSet").setCogs(oModel.oData.gearData.cogs, this);

    	    this.getView().byId("showURL").setHref(oModel.getURL());

    	},
    	
		onGearSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).ratios = obj.ratios;
			oModel.getObject("", this.context).name = obj.name;
			oModel.getObject("", this.context).minRatio = obj.minRatio;
			oModel.getObject("", this.context).chainrings = [obj.defCr];
			oModel.getObject("", this.context).cogs = [obj.defCog];
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onTireSizeSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).circumference = obj.size;
			oModel.getObject("", this.context).tireName = obj.inch + "/" + obj.ETRTO + " " + obj.description;
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onChainringSetSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).chainrings = obj.set;
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onCogSetSelected: function(oEvent) {
			var obj = oEvent.getParameter("selectedItem").getBindingContext("gears").getObject();
			oModel.getObject("", this.context).cogs = obj.set;
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onCadenceSelected: function(oEvent) {
			oModel.getObject("", this.context).cadence = oEvent.getParameter("value");
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onChangeCircumference: function(oEvent) {
			var circumference = oEvent.getParameter("value");
			var cCode = circumference.charCodeAt( circumference.length-1 );
			if (cCode > 57 || cCode < 48){
				circumference = circumference.slice(0,circumference.length-1);
				this.getView().byId("inpCircumference").setValue(circumference);
			}
			if (circumference.length === 4){
				oModel.getObject("", this.context).circumference = parseInt(circumference);
				oModel.getObject("", this.context).tireSize = parseInt(circumference);
				oModel.getObject("", this.context).tireName = circumference;
	        	this.getView().byId("showURL").setHref(oModel.getURL());
				oSelectedGraphics.setCircumference(parseInt(circumference));
				this.getView().byId("selectTires").setSelectedKey(null);
			}
		},
		
		onMaxChainAngleSelected: function(oEvent) {
			oModel.getObject("/displayData").maxChainAngle = oEvent.getParameter("value");
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onChainringChange: function(oEvent) {
			this.getView().byId("selectChainringSet").setChainrings( oEvent.getSource().getSprockets(), this);
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onCogChange: function(oEvent) {
			this.getView().byId("selectCogSet").setCogs(oEvent.getSource().getSprockets(), this);
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		ondisplayValueSelected: function(oEvent) {
	        this.getView().byId("showURL").setHref(oModel.getURL());
		},

		onSelectUnits: function(oEvent) {
	        this.getView().byId("showURL").setHref(oModel.getURL());
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
				}else{
					oSelectedGraphics = this.getView().byId("gearGraphics");
	        		this.context = this.getView().getModel().createBindingContext("/gearData");
	        		this.getView().byId("gearGraphics").addStyleClass("selectedGraphics");
	        		this.getView().byId("gearGraphics2").removeStyleClass("selectedGraphics");
		        	this.getView().byId("gearCalculatorPage").setBindingContext(this.context);
					this.getView().byId("selectChainringSet").setChainrings(oModel.oData.gearData.chainrings, this);
					this.getView().byId("selectCogSet").setCogs(oModel.oData.gearData.cogs, this);
					this.getView().byId("selectTires").setSelectedKey(oModel.oData.gearData.circumference, this);
				}
	    	    this.getView().byId("showURL").setHref(oModel.getURL());
			}
		},
		 

		// compare button is pressed.
		// Either second graphics appears gets focus and controls are set to second data set (gearData2)
		// or second graphics is switched off, first graphic gets focus and controls are set to first data set (gearData)
		onPress: function(oEvent) {
			if (oModel.oData.displayData.compare){
				oModel.oData.gearData2.hubId = oModel.oData.gearData.hubId;
				oModel.oData.gearData2.ratios = oModel.oData.gearData.ratios;
				oModel.oData.gearData2.minRatio = oModel.oData.gearData.minRatio;
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
	    	this.getView().byId("showURL").setHref(oModel.getURL());
		},
		
		onCloseBanner: function(oEvent){
			this.getView().byId("banner").setVisible(false);
		}
		
	});
});