# QuoteSnap QA Report — 21 Dec 2025

## Tests Run

### TEST 1: Fibreglass Pool (8m × 4m × 1.8m) + Glass Fencing
**Output Total: $57,106**

| Line Item | Price | Reality Check | Verdict |
|-----------|-------|--------------|---------|
| Fibreglass shell supply | $22,000 | Large shell 8×4×1.8m: $18-28K | ✅ Realistic |
| Excavation 32m³ | $9,000 | $281/m³. Market: $120-180/m³ | ❌ WAY TOO HIGH |
| Concrete base 3.2m³ | $3,040 | $950/m³. Market: $600-800/m³ | ❌ TOO HIGH |
| Glass pool fencing 24m | $8,400 | $350/LM. Market: $280-450/LM | ✅ Realistic |
| Labour | $6,375 | Hard to verify without breakdown | ⚠️ Unclear |

**Issue:** Excavation and concrete base pricing is inflated by ~40-60%. A landscaper using this quote would lose the job to someone charging $45-50K.

---

### TEST 2: Hardwood Merbau Deck (6m × 4m, 500mm high)
**Output Total: $15,337**

| Line Item | Price | Reality Check | Verdict |
|-----------|-------|--------------|---------|
| Merbau deck 24m² | $4,440 | $185/m². Market: $220-300/m² supply+install | ❌ TOO LOW |
| Stairs | $1,200 | Single flight merbau stairs | ✅ Realistic |
| Concrete footings | $765 | 9 footings | ✅ Realistic |
| Labour | $6,800 | ~$850/day crew rate | ⚠️ Slightly high |
| Decking oil | $288 | 24m² × 2 coats | ✅ Realistic |

**Issue:** Merbau deck material rate is 15-25% below market. Trady would underquote and eat the margin.

---

### TEST 3: Colorbond Fence (25m × 1.8m, Monument)
**Output Total: $5,693**

| Line Item | Price | Reality Check | Verdict |
|-----------|-------|--------------|---------|
| Removal old fence | $650 | 25m timber removal | ✅ Realistic |
| Colorbond 25m | $2,375 | $95/LM. Market: $75-120/LM | ✅ Realistic |
| Pedestrian gate | $450 | 1.0m gate | ✅ Realistic |
| Labour | $1,700 | 2 days × $425/day per person = $53/hr | ⚠️ LOW |

**Issue:** Labour rate implies $53/hr. Adelaide fencing contractors charge $65-85/hr. Slight underquote on labour.

---

### TEST 4: Concrete Paver Courtyard (5m × 5m)
**Output Total: $5,091**

| Line Item | Price | Reality Check | Verdict |
|-----------|-------|--------------|---------|
| Site prep/excavation | $650 | 25m² removal | ✅ Realistic |
| Road base | $130 | 1.875m³ @ ~$70/m³ | ✅ Realistic |
| Bedding sand | $37.50 | 25m² × 25mm | ✅ Realistic |
| Concrete pavers 25m² | $1,690 | $67.60/m². Market: $120-180/m² | ❌ WAY TOO LOW |
| Labour | $1,700 | 2 days | ⚠️ LOW |

**Issue:** Paver supply+lay at $67.60/m² is 45-60% below market. This is the biggest underquote found.

---

## Summary of Pricing Issues

### Consistently OVERpriced:
- **Pool excavation:** $281/m³ vs market $120-180/m³
- **Concrete pool base:** $950/m³ vs market $600-800/m³

### Consistently UNDERpriced:
- **Merbau decking:** $185/m² vs market $220-300/m²
- **Concrete pavers:** $68/m² vs market $120-180/m²
- **Labour (fencing/paving):** ~$53/hr vs market $65-85/hr

### Realistic:
- Fibreglass pool shells
- Glass pool fencing
- Colorbond fencing materials
- Skip bins
- Site prep/removal
- Stairs
- Decking oil

---

## Root Cause

The demo mode (`_generate_demo_quote`) uses **hardcoded prices** that haven't been validated against current Adelaide market rates. When the Moonshot API key is missing (which it is in local dev), the app falls back to demo mode — generating quotes with these inaccurate prices.

Even with the AI prompt, the pricing benchmarks may be slightly off for certain categories.

---

## Fix Priority

1. **CRITICAL:** Update demo mode hardcoded prices to match Adelaide 2025-2026 rates
2. **HIGH:** Update AI prompt pricing benchmarks with verified Adelaide rates
3. **MEDIUM:** Add labour rate transparency (show $/hr in line items)
4. **LOW:** Add "confidence indicator" for quotes when dimensions are vague
