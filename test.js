const assert = require("node:assert");
const { compute } = require("./index.js");

// Parity checks cross-referenced against the Python implementation
// (kleogeos/usdt-rub-cli, usdt_rub.py) run side by side.

function test_basic_amounts() {
  const r = compute(100, 95, "p2p", 0.5);
  assert.strictEqual(r.gross_rub, 9500.0);
  assert.strictEqual(r.results_rub.p2p, 9438.25);
  assert.strictEqual(r.results_rub.exchanger, 9310.0);
}

function test_zero_amount() {
  const r = compute(0, 95, "p2p", 0.5);
  assert.strictEqual(r.gross_rub, 0.0);
  assert.strictEqual(r.results_rub.p2p, 0.0);
}

function test_best_and_worst_differ_correctly() {
  const r = compute(1000, 93.5, "p2p", 0.5);
  // p2p spread (0.65%) is smaller than exchanger spread (2%), so p2p must win
  assert.strictEqual(r.best_method, "p2p");
  assert.ok(r.difference_vs_worst_rub > 0);
}

function test_custom_method_adds_custom_result() {
  const r = compute(100, 95, "custom", 0.1);
  assert.ok("custom" in r.results_rub);
  assert.strictEqual(r.results_rub.custom, Math.round(9500 * (1 - 0.1 / 100) * 100) / 100);
  // non-custom methods never add the "custom" key
  const r2 = compute(100, 95, "p2p", 0.1);
  assert.ok(!("custom" in r2.results_rub));
}

const { execFileSync } = require("node:child_process");
const path = require("node:path");
const SCRIPT = path.join(__dirname, "index.js");

function test_cli_output_matches_readme_example() {
  const out = execFileSync("node", [SCRIPT, "--amount", "100", "--rate", "95", "--method", "custom", "--custom-fee", "0.5", "--json"], { encoding: "utf8" });
  const data = JSON.parse(out);
  assert.strictEqual(data.results_rub.p2p, 9438.25);
  assert.strictEqual(data.results_rub.exchanger, 9310.0);
}

const tests = { test_basic_amounts, test_zero_amount, test_best_and_worst_differ_correctly, test_custom_method_adds_custom_result, test_cli_output_matches_readme_example };

let failed = 0;
for (const [name, fn] of Object.entries(tests)) {
  try {
    fn();
    console.log(`PASS: ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL: ${name}: ${e.message}`);
  }
}
console.log(`\n${Object.keys(tests).length - failed}/${Object.keys(tests).length} passed`);
process.exit(failed ? 1 : 0);
