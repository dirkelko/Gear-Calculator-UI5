sap.ui.define([
	"sap/ui/qunit/qunit-css",
	"sap/ui/thirdparty/qunit-2",
	"sap/ui/qunit/qunit-junit"
], function () {
	"use strict";

	var QUnit = window.QUnit;
	if (!QUnit) {
		throw new Error("QUnit global is not available in AllTests loader");
	}

	QUnit.config.autostart = false;

	sap.ui.require([
		"dirk/gears/test/unit/util/SettingsValidator.qunit",
		"dirk/gears/test/unit/util/GearMath.qunit",
		"dirk/gears/test/unit/model/GearsData.qunit"
	], function () {
		QUnit.start();
	});
});
