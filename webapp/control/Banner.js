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
			this.fireSelect();
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
						oRM.openStart("br");
						oRM.openEnd(); 
						//oRM.close("br");
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
					oRM.close("div");


					/*oRM.write("<div");
					oRM.writeControlData(oControl);
					oRM.addStyle("width", oControl.getWidth());  // write the Control property size; the Control has validated it 
					oRM.addStyle("height", oControl.getHeight());
					oRM.addStyle("top", oControl.getTop());  
					oRM.addStyle("left", oControl.getLeft());
					oRM.writeStyles();
					oRM.addClass("ribbon-banner");
					oRM.writeClasses();
					oRM.write(">");
					oRM.write("<span id=\"ribbon1\" class=\"ribbon1\">");
					oRM.write("<a id=\"ribbon-link\" class=\"ribbon-link\" href=\"" + oControl.getLink() + "\" target=\"_blank\">" + oControl.getText() + "</a>");
					oRM.write("</span><br>");
					oRM.write("<span id=\"ribbon2\" class=\"ribbon2\">" + oControl.getSubText() + "</span>");
					oRM.write("<div id=\"close_ribbon\" class=\"close_ribbon\">&#10006</div>");
					oRM.write("</div>");*/
				}
			}
		}
	});
});