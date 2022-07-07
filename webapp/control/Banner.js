sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	return Control.extend("dirk.gears.control.Banner", {
		metadata : {
			properties : {
				text: {type : "string", defaultValue : ""},
				subText: {type : "string", defaultValue : ""},
				link: {type : "string", defaultValue : ""},
            	width : {type: "sap.ui.core.CSSSize", defaultValue: "400px"},
            	height : {type: "sap.ui.core.CSSSize", defaultValue: "50px"},
            	top : {type: "sap.ui.core.CSSSize", defaultValue: "50px"},
            	left : {type: "sap.ui.core.CSSSize", defaultValue: "-120px"}
			},
			aggregations : {
			},
			events : {
				select : {
					parameters : {
	
						/**
						 * Checks whether the CheckBox is marked or not .
						 */
						selected : {type : "boolean"}
					}
				}
			}
		},
		
		init : function () {
		},
		
		onclick: function(oEvent){
			if (oEvent.target.className=="close_ribbon"){
				this.fireSelect();
			}
		}, 

		setText: function (fValue) {
			this.setProperty("text", fValue, true);
		},
		
		setSubText: function (fValue) {
			this.setProperty("subText", fValue, true);
			this.invalidate();	
		},

		setLink: function (fValue) {
			this.setProperty("link", fValue, true);
			this.invalidate();	
		},
		
		setSelected: function (fValue){
			fValue = !!fValue;
			this.setProperty("selected", fValue, true);
			return this;
		},

		repaint: function () {
			this.invalidate();	
		},
		
		reset: function () {
		},

		onThemeChanged :  function() {
			this.invalidate();	
		},

		onAfterRendering : function () {  
		},
		
		renderer : {
			apiVersion : 2,
			render : function (oRM, oControl) {
				if (oControl.getText()){
					oRM.openStart("div", oControl);
					oRM.class("ribbon-banner");
					oRM.style("width",oControl.getWidth());
					oRM.style("height", oControl.getHeight());
					oRM.style("top", oControl.getTop());
					oRM.style("left", oControl.getLeft());
					oRM.openEnd();
						oRM.openStart("div");
						oRM.class("ribbon1");
						oRM.style("height", oControl.getHeight()/2);
						oRM.attr("id", "ribbon1");
						oRM.openEnd();
							oRM.openStart("a");
							oRM.class("ribbon-link");
							oRM.attr("id", "ribbon-link");
							oRM.attr("href", oControl.getLink());
							oRM.attr("target", "_blank");
							oRM.openEnd();
								oRM.text(oControl.getText());
							oRM.close("a");
						oRM.close("div");
						oRM.openStart("div");
						oRM.attr("id", "ribbon-link");
						oRM.class("ribbon2");
						oRM.style("height", oControl.getHeight()/2);
						oRM.openEnd();
							oRM.text(oControl.getSubText());
						oRM.close("div");
						oRM.openStart("div");
						oRM.attr("id", "close_ribbon");
						oRM.class("close_ribbon");
						oRM.openEnd();
							oRM.text("X");
						oRM.close("div");
					oRM.close("div");
					
					/*oRM.openStart("div", oControl);
					oRM.class("ribbon-banner");
					oRM.style("width",oControl.getWidth());
					oRM.style("height", oControl.getHeight());
					oRM.style("top", oControl.getTop());
					oRM.style("left", oControl.getLeft());
					oRM.openEnd();
						oRM.openStart("span");
						oRM.class("ribbon1");
						oRM.attr("id", "ribbon1");
						oRM.openEnd();
							oRM.openStart("a");
							oRM.class("ribbon-link");
							oRM.attr("id", "ribbon-link");
							oRM.attr("href", oControl.getLink());
							oRM.attr("target", "_blank");
							oRM.openEnd();
								oRM.text(oControl.getText());
							oRM.close("a");
						oRM.close("span");
						oRM.voidStart("br");
						oRM.voidEnd(); 
						oRM.openStart("span");
						oRM.attr("id", "ribbon-link");
						oRM.class("ribbon2");
						oRM.openEnd();
							oRM.text(oControl.getSubText());
						oRM.close("span");
						oRM.openStart("div");
						oRM.attr("id", "close_ribbon");
						oRM.class("close_ribbon");
						oRM.openEnd();
							oRM.text("X");
						oRM.close("div");
					oRM.close("div");*/
				}
			}
		}
	});
});