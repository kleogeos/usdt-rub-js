# usdt-rub-js

[![test](https://github.com/kleogeos/usdt-rub-js/actions/workflows/test.yml/badge.svg)](https://github.com/kleogeos/usdt-rub-js/actions/workflows/test.yml)

Estimate how many rubles you actually get for USDT via P2P, an exchanger,
or your own spread — before you pick a method. Zero dependencies — a
direct Node.js port of
[usdt-rub-cli](https://github.com/kleogeos/usdt-rub-cli) (Python), for
people who reach for `npx` instead of `pip`.

Output is cross-checked byte-for-byte against the Python version (same
input → identical text and JSON) — see `test.js`.

## Run without installing

```bash
npx github:kleogeos/usdt-rub-js --amount 100 --rate 95 --method custom --custom-fee 0.5
```

No npm account, no registry publish, no global install — `npx` clones the
repo and runs it directly.

```
Gross value: 9,500.00 RUB
  p2p              9,438.25 RUB
  exchanger        9,310.00 RUB
  custom           9,452.50 RUB <-- best
Difference between best and worst: 142.50 RUB
```

## Install locally (optional)

```bash
git clone https://github.com/kleogeos/usdt-rub-js.git
cd usdt-rub-js
npm link   # makes `usdt-rub` available globally
```

### Flags

| Flag | Default | Meaning |
|---|---|---|
| `--amount` | required | Amount of USDT to convert |
| `--rate` | required | Current USDT/RUB rate you see on an aggregator |
| `--method` | `p2p` | Which method to highlight (`p2p`, `exchanger`, `custom`) — all are always shown |
| `--custom-fee` | `0.5` | Spread/fee percent to use for `--method custom` |
| `--json` | off | Output as JSON |

P2P and exchanger spreads are typical-case midpoints (0.3–1% and 1–3%), not
live rates — see the [write-up](https://kleogeos.github.io/freelancer-tools/kak-vyvesti-usdt-v-rubli.html?src=cli-usdtrub-js)
on where those ranges come from and the bigger risk (card freezes from
frequent P2P transfers, not the spread itself).

## Tests

```bash
npm test
```

## Where this fits

Prefer Python, or need it as a library import? [usdt-rub-cli](https://github.com/kleogeos/usdt-rub-cli) has the same math. Same math, browser version, no install: [USDT→RUB calculator](https://kleogeos.github.io/freelancer-tools/usdt-v-rubli-kalkulyator.html?src=cli-usdtrub-js). Other `npx`-runnable ports: [freelance-rate-js](https://github.com/kleogeos/freelance-rate-js) · [freelance-invoice-js](https://github.com/kleogeos/freelance-invoice-js) · [contract-checklist-js](https://github.com/kleogeos/contract-checklist-js) · [freelance-late-fee-js](https://github.com/kleogeos/freelance-late-fee-js) · [freelance-currency-js](https://github.com/kleogeos/freelance-currency-js).

Free and will stay free. If it saved you time: [tip with crypto](https://kleogeos.github.io/freelancer-tools/donate.html?src=cli-usdtrub-js).

## License

MIT — do whatever you want with it.
