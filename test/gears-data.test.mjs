import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const gearsPath = path.resolve(process.cwd(), "webapp/model/Gears.json");
const gearsData = JSON.parse(fs.readFileSync(gearsPath, "utf-8"));

test("HubData entries provide required properties", () => {
	assert.ok(Array.isArray(gearsData.HubData));
	assert.ok(gearsData.HubData.length > 0);

	for (const hub of gearsData.HubData) {
		assert.equal(typeof hub.id, "string");
		assert.ok(hub.id.length > 0);
		assert.ok(Array.isArray(hub.defCr));
		assert.ok(hub.defCr.length > 0);
		assert.ok(Array.isArray(hub.defCog));
		assert.ok(hub.defCog.length > 0);
		assert.ok(Array.isArray(hub.ratios));
		assert.ok(hub.ratios.length > 0);

		for (const ratio of hub.ratios) {
			assert.equal(typeof ratio, "number");
			assert.ok(Number.isFinite(ratio));
		}
	}
});

test("CogSets and ChainringSets are numeric", () => {
	assert.ok(Array.isArray(gearsData.CogSets));
	assert.ok(Array.isArray(gearsData.ChainringSets));

	for (const set of gearsData.CogSets) {
		assert.ok(Array.isArray(set.set));
		for (const tooth of set.set) {
			assert.equal(typeof tooth, "number");
			assert.ok(Number.isFinite(tooth));
		}
	}

	for (const set of gearsData.ChainringSets) {
		assert.ok(Array.isArray(set.set));
		for (const tooth of set.set) {
			assert.equal(typeof tooth, "number");
			assert.ok(Number.isFinite(tooth));
		}
	}
});
