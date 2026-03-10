sap.ui.define([
	"sap/ui/thirdparty/qunit-2",
	"dirk/gears/util/SettingsValidator"
], function (_, SettingsValidator) {
	"use strict";

	var QUnit = window.QUnit;
	if (!QUnit) {
		throw new Error("QUnit global is not available in SettingsValidator tests");
	}

	QUnit.module("SettingsValidator");

	function getValidDisplayData() {
		return {
			minCadence: 60,
			maxCadence: 120,
			minTeethCogs: 9,
			maxTeethCogs: 52,
			minTeethChainrings: 20,
			maxTeethChainrings: 64,
			maxNumberChainrings: 3,
			maxNumberCogs: 13
		};
	}

	QUnit.test("accepts valid settings", function (assert) {
		assert.strictEqual(SettingsValidator.isValidDisplayData(getValidDisplayData()), true);
	});

	QUnit.test("rejects when cadence bounds are invalid", function (assert) {
		var data = getValidDisplayData();
		data.minCadence = 140;
		assert.strictEqual(SettingsValidator.isValidDisplayData(data), false);
	});

	QUnit.test("rejects when sprocket count is out of range", function (assert) {
		var data = getValidDisplayData();
		data.maxNumberCogs = 21;
		assert.strictEqual(SettingsValidator.isValidDisplayData(data), false);
	});
});
