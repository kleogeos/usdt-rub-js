#!/usr/bin/env node
"use strict";

const SPREADS = [
  ["p2p", 0.65],
  ["exchanger", 2.0],
];

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// mirrors Python's repr() of a float: integers keep a trailing ".0",
// everything else prints as the shortest round-trip decimal.
function asFloat(n) {
  return Number.isInteger(n) ? n.toFixed(1) : String(n);
}

function compute(amount, rate, method, customFee) {
  const gross = amount * rate;
  const results = {};
  for (const [name, spread] of SPREADS) {
    results[name] = round2(gross * (1 - spread / 100));
  }
  if (method === "custom") {
    results.custom = round2(gross * (1 - customFee / 100));
  }
  const names = Object.keys(results);
  let best = names[0];
  let worst = names[0];
  for (const name of names) {
    if (results[name] > results[best]) best = name;
    if (results[name] < results[worst]) worst = name;
  }
  return {
    gross_rub: round2(gross),
    results_rub: results,
    best_method: best,
    difference_vs_worst_rub: round2(results[best] - results[worst]),
  };
}

function toJson(r) {
  const resultLines = Object.entries(r.results_rub)
    .map(([k, v]) => `    "${k}": ${asFloat(v)}`)
    .join(",\n");
  return [
    "{",
    `  "gross_rub": ${asFloat(r.gross_rub)},`,
    `  "results_rub": {`,
    resultLines,
    `  },`,
    `  "best_method": "${r.best_method}",`,
    `  "difference_vs_worst_rub": ${asFloat(r.difference_vs_worst_rub)}`,
    "}",
  ].join("\n");
}

function fmt2(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseArgs(argv) {
  const out = { amount: null, rate: null, method: "p2p", customFee: 0.5, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--amount") out.amount = Number(argv[++i]);
    else if (a === "--rate") out.rate = Number(argv[++i]);
    else if (a === "--method") out.method = argv[++i];
    else if (a === "--custom-fee") out.customFee = Number(argv[++i]);
    else if (a === "--json") out.json = true;
  }
  return out;
}

function printHelp() {
  console.log(`usdt-rub-js - estimate RUB received for USDT via P2P, exchanger, or a custom spread

Usage:
  usdt-rub --amount N --rate N [--method p2p|exchanger|custom] [--custom-fee N] [--json]

Run without installing:
  npx github:kleogeos/usdt-rub-js --amount 100 --rate 95
`);
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h") || argv.length === 0) {
    printHelp();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const args = parseArgs(argv);
  if (args.amount === null || args.rate === null) {
    printHelp();
    process.exit(1);
  }
  if (!["p2p", "exchanger", "custom"].includes(args.method)) {
    console.error(`error: --method must be one of p2p, exchanger, custom`);
    process.exit(1);
  }

  const r = compute(args.amount, args.rate, args.method, args.customFee);

  if (args.json) {
    console.log(toJson(r));
    return;
  }

  console.log(`Gross value: ${fmt2(r.gross_rub)} RUB`);
  for (const [name, value] of Object.entries(r.results_rub)) {
    const marker = name === r.best_method ? " <-- best" : "";
    console.log(`  ${name.padEnd(10)} ${fmt2(value).padStart(14)} RUB${marker}`);
  }
  console.log(`Difference between best and worst: ${fmt2(r.difference_vs_worst_rub)} RUB`);
}

if (require.main === module) {
  main();
}

module.exports = { compute };
