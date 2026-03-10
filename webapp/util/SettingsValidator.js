sap.ui.define([], function () {
	"use strict";

	function isFiniteNumber(value) {
		return typeof value === "number" && Number.isFinite(value);
	}

	function isValidDisplayData(displayData) {
		if (!displayData || typeof displayData !== "object") {
			return false;
		}

		return isFiniteNumber(displayData.minCadence) &&
			isFiniteNumber(displayData.maxCadence) &&
			displayData.minCadence > 10 &&
			displayData.maxCadence < 200 &&
			displayData.maxCadence > displayData.minCadence &&
			isFiniteNumber(displayData.minTeethCogs) &&
			isFiniteNumber(displayData.maxTeethCogs) &&
			displayData.minTeethCogs > 0 &&
			displayData.maxTeethCogs > displayData.minTeethCogs &&
			displayData.maxTeethCogs < 100 &&
			isFiniteNumber(displayData.minTeethChainrings) &&
			isFiniteNumber(displayData.maxTeethChainrings) &&
			displayData.minTeethChainrings > 0 &&
			displayData.maxTeethChainrings > displayData.minTeethChainrings &&
			displayData.maxTeethChainrings < 100 &&
			isFiniteNumber(displayData.maxNumberChainrings) &&
			isFiniteNumber(displayData.maxNumberCogs) &&
			displayData.maxNumberChainrings > 0 &&
			displayData.maxNumberChainrings < 6 &&
			displayData.maxNumberCogs > 0 &&
			displayData.maxNumberCogs < 21;
	}

	return {
		isValidDisplayData: isValidDisplayData
	};
});
