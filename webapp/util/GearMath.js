sap.ui.define([], function () {
	"use strict";

	function sortAscending(values) {
		return (Array.isArray(values) ? values : []).slice().sort(function (a, b) {
			return a - b;
		});
	}

	function getMaxDevelopment(gearData) {
		var chainrings = sortAscending(gearData && gearData.chainrings);
		var cogs = sortAscending(gearData && gearData.cogs);
		var circumference = Number(gearData && gearData.circumference);

		if (!chainrings.length || !cogs.length || !Number.isFinite(circumference) || circumference <= 0) {
			return 0;
		}

		return chainrings[chainrings.length - 1] / cogs[0] * circumference;
	}

	function getMinDevelopment(gearData) {
		var chainrings = sortAscending(gearData && gearData.chainrings);
		var cogs = sortAscending(gearData && gearData.cogs);
		var circumference = Number(gearData && gearData.circumference);

		if (!chainrings.length || !cogs.length || !Number.isFinite(circumference) || circumference <= 0) {
			return 0;
		}

		return chainrings[0] / cogs[cogs.length - 1] * circumference;
	}

	function getMaxDevelopmentForModel(modelData) {
		var dev1 = getMaxDevelopment(modelData && modelData.gearData);
		var dev2 = getMaxDevelopment(modelData && modelData.gearData2);
		var compare = !!(modelData && modelData.displayData && modelData.displayData.compare);
		return compare ? Math.max(dev1, dev2) : dev1;
	}

	function getMinDevelopmentForModel(modelData) {
		var dev1 = getMinDevelopment(modelData && modelData.gearData);
		var dev2 = getMinDevelopment(modelData && modelData.gearData2);
		var compare = !!(modelData && modelData.displayData && modelData.displayData.compare);
		return compare ? Math.min(dev1, dev2) : dev1;
	}

	return {
		getMaxDevelopment: getMaxDevelopment,
		getMinDevelopment: getMinDevelopment,
		getMaxDevelopmentForModel: getMaxDevelopmentForModel,
		getMinDevelopmentForModel: getMinDevelopmentForModel
	};
});
