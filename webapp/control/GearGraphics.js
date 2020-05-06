sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	return Control.extend("dirk.gears.control.GearGraphics", {
		metadata : {
			properties : {
				//testValue:   {type : "float", defaultValue : 0},
            	width : {type: "sap.ui.core.CSSSize", defaultValue: "1000px"},
            	height : {type: "sap.ui.core.CSSSize", defaultValue: "200px"},
				cadence: {type : "int", defaultValue : 0},
				circumference: {type : "int", defaultValue : 0},
				circumference2: {type : "int", defaultValue : 0},
				tireName: {type : "string", defaultValue : ""},
				chainrings: {type : "float[]", defaultValue : [] },
				cogs: {type : "float[]", defaultValue : [] },
				chainrings2: {type : "float[]", defaultValue : [] },
				cogs2: {type : "float[]", defaultValue : [] },
				hubType: {type: "string" , defaultValue : "DERS" },
				hubName: {type: "string" , defaultValue : "" },
				hubRatios: {type : "float[]", defaultValue : [1.0] },
				hubRatios2: {type : "float[]", defaultValue : [1.0] },
				dsplValues: {type : "string", defaultValue : "teeth"},
				minHubRatio: {type : "float" },
				maxChainAngle: {type : "float", defaultValue : 0},
				unitsIndex: {type : "int", defaultValue : 0},
				selected : {type : "boolean", group : "Data", defaultValue : false}
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

		//setTestValue: function (fValue) {
		//	this.setProperty("testValue", fValue, true);
		//	this.invalidate();	
		//},
		
		setCadence: function (fValue) {
			this.setProperty("cadence", fValue, true);
			this.invalidate();	
		},
		
		setCircumference: function (fValue) {
			this.setProperty("circumference", fValue, true);
			this.invalidate();
		},
		
		setMaxChainAngle: function (fValue) {
			this.setProperty("maxChainAngle", fValue, true);
			this.invalidate();	
		},
		
		setChainrings: function (fValue) {
			this.setProperty("chainrings", fValue, true);
			this.invalidate();	
		},

		setCogs: function (fValue) {
			this.setProperty("cogs", fValue, true);
			this.invalidate();	
		},
		
		setHubType: function (fValue) {
			this.setProperty("hubType", fValue, true);
			this.invalidate();	
		},
		
		setHubRatios: function (fValue) {
			this.setProperty("hubRatios", fValue, true);
			this.invalidate();	
		},
		
		setDsplValues: function (fValue) {
			this.setProperty("dsplValues", fValue, true);
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

		paintScales: function(ctx){
			// xLog - returns x position of value v between vMin and vMax
			// in logarithmic scale with width xSize
			function xLog(vMin, vMax, xSize, v) {
				if (v >= vMin && v <= vMax) {
					if (vMin > 0) {
						return Math.log(v / vMin) / Math.log(vMax / vMin) * xSize;
					} else {
						return Math.log(v) / Math.log(vMax) * xSize;
					}
				} else {
					return 0;
				}
			}
			
			function displayValues(ctx, dsplValue,iCog, ratio,circumference, cadence, unitFactor, x, y) {
		                            switch(dsplValue) {
		                                case "ratio":
							                ctx.fillText((ratio).toPrecision(3), x, y - 16);
		                                    break;
		                                case "development":
							                ctx.fillText((ratio*circumference/1000).toPrecision(3), x, y - 16);
		                                    break;
		                            	case "gearInches":
		    					        	ctx.fillText((ratio*circumference/25.4/3.1415927).toPrecision(3), x, y - 16);
							                //ctx.fillText(iCog, x, y - 16);
		                                	break;
		                                case "speed":
							                ctx.fillText((ratio*circumference/1000* cadence * unitFactor).toPrecision(3), x, y - 16);
		                                	break;
		                            	default:
		                            }
			}
			
			//distance/mm between sprockets 
			var distSprockets = [5.5, 5.5, 5.5, 5.5, 5.3, 5.0, 5.0, 4.8, 4.34, 3.95, 3.9, 3.5, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0]; 
			var distChainrings = 5.0;

			ctx.beginPath();
			var width = ctx.canvas.width;
			var height = ctx.canvas.height;
			// create array of chainrings and cogs in ascending order
			var aChainrings = this.getChainrings().sort( function(a,b){return a-b;});
			var aCogs = this.getCogs().sort(function(a,b){return a-b;});
			var hubRatios = this.getHubRatios();
			var aChainrings2 = this.getChainrings2().sort( function(a,b){return a-b;});
			var aCogs2 = this.getCogs2().sort(function(a,b){return a-b;});
			var hubRatios2 = this.getHubRatios2();
			// calculate the minimal and maximal ratio of the selected hub, chainring, cog selection
			var minRatio = aChainrings[0]/aCogs[aCogs.length-1]*hubRatios[0];
			var maxRatio = aChainrings[aChainrings.length-1]/aCogs[0]*hubRatios[hubRatios.length-1];
			var minRatio2 = aChainrings2[0]/aCogs2[aCogs2.length-1]*hubRatios2[0];
			var maxRatio2 = aChainrings2[aChainrings2.length-1]/aCogs2[0]*hubRatios2[hubRatios2.length-1];
			var circumference = this.getCircumference();
			var circumference2 = this.getCircumference2();
			var cadence = this.getCadence();
			var maxChainAngle = this.getMaxChainAngle();
			
			// bundle for translated texts
			var oResourceBundle = this.getModel("i18n").getResourceBundle();

			// fill canvas white
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0,  width, height);
			ctx.textAlign = "center";

			for ( var i = 0; i < aChainrings.length; i++) {
				//var y = Math.round(height / (aChainrings.length + 1) * (i + 1));
				var y = ((height - 20) / (aChainrings.length + 1) * (i + 1)) + 0.5;
				ctx.strokeStyle = "#e34c26";
				//ctx.strokeStyle = "#DD0000";
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.moveTo(0, y);
				ctx.lineTo(0 + width, y);
				ctx.stroke();
				ctx.closePath();
				//draw a red circle with number of chainring teeth
				ctx.beginPath();
				ctx.fillStyle = "#e34c26";
				ctx.arc(0 + width - 20 , y, 10, 0, Math.PI*2, true); 
				ctx.closePath();
				ctx.fill();
				ctx.fillStyle = "#FFFFFF";
				ctx.font = "bold 12px sans-serif";
				ctx.fillText(aChainrings[i].toString(), 0 + width -20, y + 4 );
			}
			

			// draw scale tick marks for development (logarithmic scales) for SI oe US units
			ctx.strokeStyle = "#000000";
			ctx.fillStyle = "#000000";
			ctx.lineWidth = 1;
			ctx.font = "12px sans-serif";
			ctx.textAlign = "center";

			// draw scale for Development/m or Gear Inches
			var gX = 0.5;
			var gY = 0.5;
			
			var minDev = Math.min( minRatio * this.getCircumference()/1000 *0.8, minRatio2 * this.getCircumference2()/1000 *0.8 ) ;
			var maxDev = Math.max( maxRatio * this.getCircumference()/1000 *1.15, maxRatio2 * this.getCircumference2()/1000 *1.15)  ;

			ctx.beginPath();

			if (this.getUnitsIndex() === 0){
				var iMinDev = Math.floor(minDev * 10);
				var iMaxDev = Math.floor(maxDev * 10 + 1);
				ctx.textAlign = "left";
				ctx.fillText( oResourceBundle.getText("development") +"/m", 10, 21);
				ctx.textAlign = "center";
				for (i = iMinDev; i <= iMaxDev; i++) {
					var x = gX + Math.round(xLog(minDev, maxDev, width, i / 10));
					if (x > gX) {
						ctx.moveTo(x, gY);
						//ctx.lineTo(x, gY+5);
						if (i % 10 === 0) {
							ctx.lineTo(x, gY + 10);
							if (x > 80) {
								ctx.fillText(i / 10, x, gY + 20);
							}
						} else if (i % 5 === 0) {
							ctx.lineTo(x, gY + 8);
						} else {
							ctx.lineTo(x, gY + 5);
						}
					}
				}
			} else {
				// draw scale for Gear Inches 
				var minGearInches = minDev * 100 / 2.54  / Math.PI;
				var maxGearInches = maxDev * 100 / 2.54  / Math.PI;
				var iMinGearInches = Math.floor(minGearInches);
				var iMaxGearInches = Math.floor(maxGearInches + 1);
				ctx.textAlign = "left";
				ctx.fillText("Gear Inches", 10, 21);
				ctx.textAlign = "center";
		
				for (i = iMinGearInches; i <= iMaxGearInches; i++) {
					x = gX + Math.round(xLog(minGearInches, maxGearInches, width, i));
					if (x > gX) {
						ctx.moveTo(x, gY);
						if (i % 10 === 0) {
							ctx.lineTo(x, gY + 10);
							if (x > 80) {
								ctx.fillText(i, x, gY + 20);
							}
						} else if (i % 5 === 0) {
							ctx.lineTo(x, gY + 8);
						} else {
							ctx.lineTo(x, gY + 5);
						}
					}
				}
			}
			ctx.stroke();
			ctx.closePath();


			// draw scale tick marks for speed (logarithmic scales)
			var unitFactor = (this.getUnitsIndex() === 0) ? 60 / 1000 : 60 / 1609.3;
			// km/h or mph
			var minSpeed = minDev * cadence * unitFactor;
			var maxSpeed = maxDev * cadence * unitFactor;
			var iMinSpeed = Math.round(minSpeed + 0.5);
			var iMaxSpeed = Math.round(maxSpeed - 0.5);
			ctx.textAlign = "left";
			//ctx.fillText((dsplOps.siUnits)? "km/h" : "mph", 10, gHeight - 30 + 20);
			ctx.fillText( (this.getUnitsIndex() === 0)? "km/h" : "mph", 10, height - 30 + 20);
			ctx.textAlign = "center";
			ctx.beginPath();
			ctx.moveTo(gX, gY + height - 30);
			ctx.lineTo(gX + width, gY + height - 30);
			for ( i = iMinSpeed; i <= iMaxSpeed; i++) {
				x = gX + Math.round(xLog(minSpeed, maxSpeed, width, i));
				if (x > gX) {
					ctx.moveTo(x, gY + height - 30);
					if (i % 5 === 0) {
						ctx.lineTo(x, gY + height - 30 + 10);
						if (x > 40) {
							ctx.fillText(i, x, gY + height - 30 + 20);
						}
					} else {
						ctx.lineTo(x, gY + height - 30 + 5);
					}
				}
			}
			ctx.stroke();
			ctx.closePath();
		
					
			// Draw triangles for each Chainring Sprocket combination
			var ratios = [];
			var chainAngleOk = [];
			ctx.fillStyle = "#000000";
			ctx.font = "bold 11px sans-serif";
			var tSize = 12;
			for ( i = 0; i < aChainrings.length; i++) {
				y = Math.round((height -20 ) / (aChainrings.length + 1) * (i + 1)) + gY -10.5;
				chainAngleOk[i] = new Array(aCogs.length);
				for ( var j = 0; j < aCogs.length; j++) {
					if (aChainrings[i] * aCogs[j] !== 0) {
						x = gX + Math.round(xLog(minDev, maxDev, width, aChainrings[i] / aCogs[j] * circumference / 1000));
						if (x > gX + 12) {
							ctx.beginPath();
							//draw triangle for gear
							ctx.moveTo(x - tSize, y - tSize);
							ctx.lineTo(x + tSize, y - tSize);
							ctx.lineTo(x, y + tSize);
							ctx.lineTo(x - tSize, y - tSize);
							// fill triangle either black or grey dep. of chain angle
							var dist = Math.abs((i - ( aChainrings.length - 1) / 2) * distChainrings - ((aCogs.length - 1) / 2 - j ) * distSprockets[aCogs.length - 1] );
							chainAngleOk[i][j] = ( Math.asin( dist / 430) / Math.PI * 180  ) < maxChainAngle;
							ctx.fillStyle = ( !chainAngleOk[i][j] || this.getHubType() !== "DERS")? "#E8E8E8" : "#000000" ;

							ctx.fill();
							ctx.closePath();

							// write # sprocket teeth onto triangle
							ctx.fillStyle = "rgb(200,200,200)";
							ctx.fillText(aCogs[j], x, y - 1);
							ctx.fillStyle = "rgb(00,00,00)";
							 if (this.getHubType() === "DERS"){
		                         switch(this.getDsplValues()) {
		                             case "ratio":
		    					        ctx.fillText((aChainrings[i]/aCogs[j]).toPrecision(3), x, y - 16);
		                                break;
		                             case "development":
		    				 	        ctx.fillText((aChainrings[i]/aCogs[j]*circumference/1000).toPrecision(3), x, y - 16);
		                                break;
		                             case "gearInches":
		    				 	        ctx.fillText((aChainrings[i]/aCogs[j]*circumference/25.4/3.1415927).toPrecision(3), x, y - 16);
		                                break;
		                             case "speed":
		    				 	    	ctx.fillText((aChainrings[i]/aCogs[j]*circumference/1000* cadence * unitFactor).toPrecision(3), x, y - 16);
		                                break;
		                             case "cogs":
		    				 	    	ctx.fillText(aCogs.length - j, x, y - 16);
		                                break;
		                             default:
		                         }
							}
		
							// draw additional triangles for gear hubs
							if (this.getHubType().slice(0,2) === "NU"){
									var xn1 = gX + Math.round(xLog(minDev, maxDev, width, aChainrings[i] / aCogs[j] 
									    * hubRatios[0]*circumference / 1000));
									var xn2 = gX + Math.round(xLog(minDev, maxDev, width, aChainrings[i] / aCogs[j] 
									    * hubRatios[1]*circumference / 1000));
									ctx.beginPath();
									//draw triangle for gear
									ctx.moveTo(xn1, y - tSize);
									ctx.lineTo(xn2, y - tSize);
									ctx.lineTo(xn2, y + tSize - 2);
									ctx.lineTo(xn1, y + tSize - 2);
									ctx.lineTo(xn1, y - tSize);
									ctx.fillStyle = "#000000";
									ctx.fill();
									ctx.closePath();
									displayValues(ctx, this.getDsplValues(), j, aChainrings[i]/aCogs[j]*hubRatios[0],circumference, cadence, unitFactor, xn1, y);
									displayValues(ctx, this.getDsplValues(), j, aChainrings[i]/aCogs[j]*hubRatios[1],circumference, cadence, unitFactor, xn2, y);
									ctx.fillStyle = "rgb(200,200,200)";
									ctx.fillText(aCogs[j], x, y - 1);
							} else if (this.getHubType() !== "DERS") {
								for ( var k = 0; k < hubRatios.length; k++) {
									var xgh = gX + Math.round(xLog(minDev, maxDev, width, aChainrings[i] / aCogs[j] 
									    * hubRatios[k]*circumference / 1000));
									ctx.beginPath();
									//draw triangle for gear
									ctx.moveTo(xgh - tSize, y - tSize);
									ctx.lineTo(xgh + tSize, y - tSize);
									ctx.lineTo(xgh, y + tSize);
									ctx.lineTo(xgh - tSize, y - tSize);
									ctx.fillStyle = "#000000";
									ctx.fill();
									ctx.closePath();
									displayValues(ctx, this.getDsplValues(), j, aChainrings[i]/aCogs[j]*hubRatios[k],circumference, cadence, unitFactor, xgh, y);
								}
								ctx.fillStyle = "rgb(200,200,200)";
								ctx.fillText(aCogs[j], x, y - 1);
							}
							
						}
						if (chainAngleOk[i][j]){
							if (this.getHubType() !== "DERS"){
								for ( k = 0; k < hubRatios.length; k++) {
									ratios.push(aChainrings[i]/aCogs[j]*hubRatios[k]);
								}
							} else {
								ratios.push(aChainrings[i]/aCogs[j]);
							}
						} 
					}
				}
			}

			// draw rectangle with ticks for each possible gear and display gear steps
			ctx.fillStyle = "rgb(150,150,150)";
			ctx.textAlign = "left";
			if (this.getHubType() !== "DERS"){
			    ctx.fillText( this.getHubName(), 10, 140);
			    if ( aChainrings[0]/aCogs[aCogs.length-1] < this.getMinHubRatio() ){
                    ctx.fillStyle = "#e34c26";
			        ctx.fillText(oResourceBundle.getText("highTorque"), 10, 80);
			        //ctx.textAlign = "center";
					ctx.fillStyle = "rgb(150,150,150)";
					ctx.textAlign = "left";
			    }
			} else {
			    ctx.fillText( oResourceBundle.getText("capacity") + ": " + (aChainrings[aChainrings.length-1] - aChainrings[0] + aCogs[aCogs.length-1] - aCogs[0]), 10, 140);
			}
			ratios.sort(function(a,b){return a-b;});
			ctx.beginPath();
			ctx.fillText( this.getTireName(), 10, 110);

			//ctx.fillText( "%wheel_size".toLocaleString() + " " + tireTypes.getNameByCircumference(gearSet.circumference), 10, 161);
			ctx.fillRect(gX, height -50, width, 16);
			ctx.fillStyle = "#FFFFFF";
			ctx.strokeStyle = "#FFFFFF";
			ctx.fillText( oResourceBundle.getText("gearStep"), 10, height - 38);
			ctx.fillText( Math.round(ratios[ratios.length -1 ]/ratios[0] * 100) +"%", gX + width - 50, height - 38);
			ctx.textAlign = "center";
			for ( i = 0; i < ratios.length; i++){
				x = gX + Math.round(xLog(minDev, maxDev, width, ratios[i] * circumference / 1000));
				ctx.moveTo(x, height - 50);
				ctx.lineTo(x, height - 35);
				if (i > 0){
					var gearStep = Math.round(ratios[i] / ratios[i - 1] * 100 - 100);
					if (gearStep > 1 ){
						var x0 = gX + Math.round(xLog(minDev, maxDev, width, ratios[i-1] * circumference / 1000));
				    	ctx.fillText(gearStep, (x + x0)/2, height - 38);
					}
				}
			}
			ctx.stroke();
			ctx.closePath();

		},
		
		//onclick: function(evt) {
    	//	alert("Control " + this.getId() + " was clicked.");
		//},

		onThemeChanged :  function() {
			this.invalidate();	
		},

		onAfterRendering : function () {  // add draggable sprockets here
			var nWidth = this.$().width();
			var nHeight = this.$().height();// - 20;
			//var canvas = document.getElementById("myCanvas");
			var canvas = document.getElementById(this.getId()).getElementsByClassName("gearCanvas")[0];
			canvas.width = nWidth;
			canvas.height = nHeight;
			var ctx = canvas.getContext("2d");
			this.paintScales(ctx);
		},
		
		renderer : function (oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
        	oRM.addStyle("width", oControl.getWidth());  // write the Control property size; the Control has validated it 
        	oRM.addStyle("height", oControl.getHeight());
        	oRM.writeStyles();
			oRM.addClass("gearGraphics");
			oRM.writeClasses();
			oRM.write(">");
			oRM.write("<div id=\"gearChart\" class=\"canvasArea\">");
			oRM.write("<canvas class=\"gearCanvas\" style=\"border:1px solid #000000;\"></canvas>");
			oRM.write("</div>");
			oRM.write("</div>");
		}
	});
});