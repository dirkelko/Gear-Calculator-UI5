sap.ui.define([
	"sap/ui/thirdparty/qunit-2",
	"sap/ui/model/json/JSONModel"
], function (_, JSONModel) {
	"use strict";

	var QUnit = window.QUnit;
	if (!QUnit) {
		throw new Error("QUnit global is not available in GearsData tests");
	}

	QUnit.module("Gears.json integrity");

	function isNumberArray(values) {
		return Array.isArray(values) && values.length > 0 && values.every(function (value) {
			return typeof value === "number" && Number.isFinite(value);
		});
	}

	function loadGearsData() {
		var path = sap.ui.require.toUrl("dirk/gears/model/Gears.json");
		return new Promise(function (resolve, reject) {
			var model = new JSONModel();
			model.attachRequestCompleted(function () {
				resolve(model.getData());
			});
			model.attachRequestFailed(function () {
				reject(new Error("Failed to load Gears.json from " + path));
			});
			model.loadData(path);
		});
	}

	QUnit.test("hub data has required fields and valid numeric arrays", function (assert) {
		var done = assert.async();

		loadGearsData()
			.then(function (gearsData) {
				assert.ok(Array.isArray(gearsData.HubData), "HubData exists");
				assert.ok(gearsData.HubData.length > 0, "HubData is not empty");

				gearsData.HubData.forEach(function (hub) {
					assert.ok(typeof hub.id === "string" && hub.id.length > 0, "hub has id");
					assert.ok(Array.isArray(hub.defCr) && hub.defCr.length > 0, "hub has default chainrings");
					assert.ok(Array.isArray(hub.defCog) && hub.defCog.length > 0, "hub has default cogs");
					assert.ok(isNumberArray(hub.ratios), "hub has numeric ratios");
				});
			})
			.catch(function (error) {
				assert.ok(false, error.message);
			})
			.then(done);
	});

	QUnit.test("cog and chainring sets contain numeric teeth counts", function (assert) {
		var done = assert.async();

		loadGearsData()
			.then(function (gearsData) {
				gearsData.CogSets.forEach(function (set) {
					assert.ok(Array.isArray(set.set), "Cog set has array");
					assert.ok(set.set.every(function (value) {
						return typeof value === "number" && Number.isFinite(value);
					}), "Cog set values are numeric");
				});

				gearsData.ChainringSets.forEach(function (set) {
					assert.ok(Array.isArray(set.set), "Chainring set has array");
					assert.ok(set.set.every(function (value) {
						return typeof value === "number" && Number.isFinite(value);
					}), "Chainring set values are numeric");
				});
			})
			.catch(function (error) {
				assert.ok(false, error.message);
			})
			.then(done);
	});
});
