sap.ui.define([
	"sap/ui/thirdparty/qunit-2",
	"dirk/gears/util/GearMath"
], function (_, GearMath) {
	"use strict";

	var QUnit = window.QUnit;
	if (!QUnit) {
		throw new Error("QUnit global is not available in GearMath tests");
	}

	QUnit.module("GearMath");

	QUnit.test("calculates min and max development for one setup", function (assert) {
		var gearData = {
			chainrings: [36, 22],
			cogs: [36, 11],
			circumference: 2200
		};

		assert.strictEqual(GearMath.getMinDevelopment(gearData), (22 / 36) * 2200);
		assert.strictEqual(GearMath.getMaxDevelopment(gearData), (36 / 11) * 2200);
	});

	QUnit.test("combined min and max respect compare mode", function (assert) {
		var modelData = {
			gearData: {
				chainrings: [40],
				cogs: [20],
				circumference: 2100
			},
			gearData2: {
				chainrings: [50],
				cogs: [25],
				circumference: 2300
			},
			displayData: {
				compare: true
			}
		};

		assert.strictEqual(GearMath.getMinDevelopmentForModel(modelData), 4200);
		assert.strictEqual(GearMath.getMaxDevelopmentForModel(modelData), 4600);
	});

	QUnit.test("returns 0 for incomplete data", function (assert) {
		assert.strictEqual(GearMath.getMaxDevelopment({ chainrings: [], cogs: [11], circumference: 2200 }), 0);
		assert.strictEqual(GearMath.getMinDevelopment({ chainrings: [34], cogs: [], circumference: 2200 }), 0);
	});
});
