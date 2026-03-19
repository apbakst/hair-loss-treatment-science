# Hair Loss Treatment Science -- Interactive Landing Page Design Specification

**URL:** `anagen.xyz/hair-loss-treatment-science`
**Last updated:** 2026-03-18
**Status:** Design spec for coding agent implementation

---

## Table of Contents

1. [Page Architecture](#1-page-architecture)
2. [Component Hierarchy](#2-component-hierarchy)
3. [Data Schema](#3-data-schema)
4. [Interaction Design](#4-interaction-design)
5. [Visual Design](#5-visual-design)
6. [SEO Structure](#6-seo-structure)
7. [Comparison Table Design](#7-comparison-table-design)
8. [Responsive Behavior](#8-responsive-behavior)

---

## 1. Page Architecture

The page is a single, long-form interactive landing page composed of the following major sections in vertical order:

```
+============================================================+
|  GLOBAL NAV (anagen.xyz site navigation)                   |
+============================================================+
|  HERO / PAGE HEADER                                        |
|    - Title, subtitle, trust signals, last-updated date     |
+------------------------------------------------------------+
|  EVIDENCE HIERARCHY EXPLAINER (collapsible)                |
|    - Interactive 6-tier evidence ladder diagram             |
+------------------------------------------------------------+
|  COMPARISON MATRIX                                         |
|    - All 15 treatments in a filterable/sortable table      |
|    - Category filter pills at top                          |
|    - Rows: treatments. Cols: evidence levels, status, etc. |
+------------------------------------------------------------+
|  TREATMENT DEEP-DIVE SECTION                               |
|    - Horizontal tab bar (scrollable on mobile)             |
|    - Grouped into 4 category headings                      |
|    - Active tab loads treatment detail panel below          |
|      |                                                     |
|      |  TREATMENT DETAIL PANEL                             |
|      |    - Summary card (name, category, mechanism, etc.) |
|      |    - Evidence heatmap bar                           |
|      |    - Claims list (numbered, expandable)             |
|      |    - "Evidence That's Missing" section              |
|      |    - "The Bottom Line" section                      |
|      |    - "Explore More" CTA (link to full article)      |
|      |                                                     |
+------------------------------------------------------------+
|  METHODOLOGY NOTE                                          |
|    - How claims are evaluated, editorial independence       |
+------------------------------------------------------------+
|  FOOTER                                                    |
|    - Disclaimers, site links, anagen.xyz branding          |
+============================================================+
```

### 1.1 Global Navigation

Standard anagen.xyz site nav. Sticky on scroll. Contains logo (left), nav links (center/right), and optionally a search icon. Not designed here -- uses existing site nav.

### 1.2 Hero / Page Header

**Purpose:** Establish credibility and context immediately. Communicate what this page is and why it is trustworthy.

**Contents:**
- **H1 headline:** "Hair Loss Treatments: What the Science Actually Shows"
- **Subtitle (p.lead):** "A claim-by-claim evidence breakdown of 15 hair loss treatments -- from FDA-approved drugs to investigational peptides -- ranked by the strength of the research behind them."
- **Trust signals row** (horizontal, small text with icons):
  - "15 treatments analyzed"
  - "100+ studies reviewed"
  - "Updated March 2026"
  - "No affiliate links"
- **Author/editorial byline:** "By the Anagen Research Team"
- **Last-updated timestamp** (important for SEO freshness signals)

### 1.3 Evidence Hierarchy Explainer

**Purpose:** Teach the reader how to interpret evidence levels before they see any treatment data. This is the "how to read this page" primer.

**Layout:** A vertical stepped diagram (mobile) or horizontal pipeline (desktop) showing the 6 tiers:

```
In silico --> In vitro --> In vivo animal --> Ex vivo --> Human open-label --> Human RCT
Very Low      Low          Moderate          Mod-High    High                 Highest
```

Each tier is a clickable/tappable card that expands to show:
- Full name and common name
- One-sentence description
- Why it matters / why it is limited
- A visual weight indicator (1-6 dots, or a filled bar segment)

**Behavior:** Collapsed by default on return visits (remember via localStorage). Open by default on first visit. Toggle with "How we evaluate evidence" button.

### 1.4 Comparison Matrix

**Purpose:** High-level side-by-side comparison of all 15 treatments. This is the "central linking" element Zach described.

See [Section 7](#7-comparison-table-design) for full design.

### 1.5 Treatment Deep-Dive Section

**Purpose:** The core interactive content area. Each treatment has its own structured detail panel accessed via tabs.

**Tab system:**
- Tabs are organized under 4 category subheadings:
  1. FDA-Approved (2 tabs)
  2. Off-Label (5 tabs)
  3. Investigational (3 tabs)
  4. Peptides / Cosmeceuticals (5 tabs)
- Category labels are non-interactive headings above the tab groups
- Tabs display the treatment's short name (e.g., "Finasteride", "GHK-Cu")
- Active tab is visually distinct (filled background, underline, or both)
- Clicking a tab smoothly transitions the content panel below

**Treatment Detail Panel** (loaded per tab):
See [Section 2](#2-component-hierarchy) for component breakdown.

### 1.6 Methodology Note

**Purpose:** Editorial transparency. Builds trust with sophisticated readers and provides E-E-A-T signals for Google.

**Contents:**
- How claims are selected (every major claim made in marketing or published literature)
- How evidence is weighted (the 6-tier hierarchy)
- Conflict of interest disclosure
- How often the page is updated
- Contact for corrections/submissions

### 1.7 Footer

Standard anagen.xyz footer with:
- Medical disclaimer (prominent)
- Copyright
- Links to privacy policy, terms, contact
- Social links

---

## 2. Component Hierarchy

### 2.1 Top-Level Page Components

```
<Page>
  <GlobalNav />
  <Hero />
  <EvidenceHierarchy />
  <ComparisonMatrix />
  <TreatmentExplorer>
    <CategoryTabGroup category="fda-approved">
      <TreatmentTab treatment="finasteride" />
      <TreatmentTab treatment="minoxidil" />
    </CategoryTabGroup>
    <CategoryTabGroup category="off-label">
      <TreatmentTab treatment="dutasteride" />
      <TreatmentTab treatment="liothyronine" />
      <TreatmentTab treatment="levocetirizine" />
      <TreatmentTab treatment="latanoprost" />
      <TreatmentTab treatment="ketoconazole" />
    </CategoryTabGroup>
    <CategoryTabGroup category="investigational">
      <TreatmentTab treatment="pp405" />
      <TreatmentTab treatment="tdm105" />
      <TreatmentTab treatment="veradermics" />
    </CategoryTabGroup>
    <CategoryTabGroup category="peptides-cosmeceuticals">
      <TreatmentTab treatment="ghk-cu" />
      <TreatmentTab treatment="bpc-157" />
      <TreatmentTab treatment="tb-500" />
      <TreatmentTab treatment="acetyl-tetrapeptide-3" />
      <TreatmentTab treatment="biotinoyl-tripeptide-1" />
    </CategoryTabGroup>
    <TreatmentDetailPanel />
  </TreatmentExplorer>
  <MethodologyNote />
  <Footer />
</Page>
```

### 2.2 EvidenceHierarchy Component

```
<EvidenceHierarchy>
  <ToggleButton label="How we evaluate evidence" />
  <CollapsibleContent>
    <EvidenceTierCard level="in-silico" weight="Very Low" rank={1} />
    <EvidenceTierCard level="in-vitro" weight="Low" rank={2} />
    <EvidenceTierCard level="in-vivo-animal" weight="Moderate" rank={3} />
    <EvidenceTierCard level="ex-vivo" weight="Moderate-High" rank={4} />
    <EvidenceTierCard level="human-open-label" weight="High" rank={5} />
    <EvidenceTierCard level="human-rct" weight="Highest" rank={6} />
  </CollapsibleContent>
</EvidenceHierarchy>
```

### 2.3 ComparisonMatrix Component

```
<ComparisonMatrix>
  <CategoryFilterBar>
    <FilterPill label="All" active />
    <FilterPill label="FDA-Approved" />
    <FilterPill label="Off-Label" />
    <FilterPill label="Investigational" />
    <FilterPill label="Peptides" />
  </CategoryFilterBar>
  <SortControls />
  <MatrixTable>
    <MatrixHeader />
    <MatrixRow treatment={treatmentData} />  <!-- one per treatment -->
  </MatrixTable>
</ComparisonMatrix>
```

### 2.4 TreatmentDetailPanel Component

```
<TreatmentDetailPanel treatment={activeTreatment}>
  <TreatmentHeader>
    <TreatmentName />
    <TreatmentCategory badge />
    <MechanismOfAction />
    <ApprovalStatus />
  </TreatmentHeader>
  <EvidenceHeatmapBar>
    <!-- Visual bar showing which evidence levels exist for this treatment -->
    <HeatmapSegment level="in-silico" present={bool} claimCount={n} />
    <HeatmapSegment level="in-vitro" present={bool} claimCount={n} />
    <HeatmapSegment level="in-vivo-animal" present={bool} claimCount={n} />
    <HeatmapSegment level="ex-vivo" present={bool} claimCount={n} />
    <HeatmapSegment level="human-open-label" present={bool} claimCount={n} />
    <HeatmapSegment level="human-rct" present={bool} claimCount={n} />
  </EvidenceHeatmapBar>
  <QuickStats>
    <!-- 3-4 key numbers in a horizontal stat row -->
    <StatCard label="Total claims evaluated" value={n} />
    <StatCard label="Highest evidence level" value={string} />
    <StatCard label="Human trials" value={n} />
    <StatCard label="Overall evidence grade" value={letter} />
  </QuickStats>
  <ClaimsList>
    <ClaimCard number={1}>
      <ClaimTitle />
      <EvidenceBadge level="in-vitro" weight="Low" />
      <ClaimModel />          <!-- expandable -->
      <ClaimFinding />        <!-- expandable -->
      <ClaimAssessment />     <!-- expandable -->
      <ClaimCitations />
    </ClaimCard>
    <!-- repeat for each claim -->
  </ClaimsList>
  <MissingEvidence>
    <h3>The Evidence That's Missing</h3>
    <BulletList items={missingEvidence} />
  </MissingEvidence>
  <BottomLine>
    <h3>The Bottom Line</h3>
    <SummaryText />
    <KeyTakeaway highlighted />
  </BottomLine>
  <ExploreMoreCTA>
    <Button href={articleUrl} label="Read the full evidence breakdown" />
    <Button href={pubmedSearchUrl} label="View studies on PubMed" secondary />
  </ExploreMoreCTA>
</TreatmentDetailPanel>
```

### 2.5 ClaimCard Component (detailed)

Each claim is rendered as an expandable card. Default state shows:
- Claim number and title
- Evidence level badge (colored pill)
- One-line summary of the finding

Expanded state reveals:
- **The model:** Full description of the experimental model
- **The finding:** What was observed
- **How much weight to give it:** Full assessment paragraph
- **Citations:** Formatted citation list

The expansion is animated (max-height transition or similar). Multiple claims can be expanded simultaneously.

### 2.6 EvidenceBadge Component

A small colored pill/tag that appears next to every claim and in the comparison table.

| Level | Label | Background Color | Text Color |
|-------|-------|-----------------|------------|
| In silico | `IN SILICO` | `#F3E8FF` (light purple) | `#6B21A8` (dark purple) |
| In vitro | `IN VITRO` | `#DBEAFE` (light blue) | `#1E40AF` (dark blue) |
| In vivo animal | `IN VIVO` | `#D1FAE5` (light green) | `#065F46` (dark green) |
| Ex vivo | `EX VIVO` | `#FEF3C7` (light amber) | `#92400E` (dark amber) |
| Human open-label | `OPEN-LABEL` | `#FFEDD5` (light orange) | `#9A3412` (dark orange) |
| Human RCT | `RCT` | `#FCE7F3` (light rose) | `#9D174D` (dark rose) |

**Weight sub-badge** (optional, smaller): "Very Low", "Low", "Moderate", "Moderate-High", "High", "Highest"

### 2.7 EvidenceHeatmapBar Component

A horizontal bar divided into 6 segments (one per evidence level), displayed at the top of each treatment detail panel. Segments are filled/colored if the treatment has at least one claim at that evidence level, and greyed out if not. The fill intensity or a number overlay indicates how many claims exist at that level.

```
| In silico | In vitro | In vivo | Ex vivo | Open-label | RCT |
|  ████ 2   |  ████ 3  |  ░░░ 0 |  ████ 1 |   ░░░ 0    | ████ 1 |
```

This gives an instant visual fingerprint of where the treatment's evidence sits.

---

## 3. Data Schema

Each treatment's data is stored as a single JSON file at:
```
/content/{treatment-slug}/data.json
```

The full JSON Schema is defined in `/content/schema.json` (see that file for the canonical machine-readable definition). Below is the human-readable description of every field.

### 3.1 Treatment Data File Structure

```jsonc
{
  // === IDENTIFICATION ===
  "id": "ghk-cu",                          // URL-safe slug, lowercase, hyphens
  "name": "GHK-Cu",                        // Display name
  "fullName": "Copper Peptide GHK-Cu (Glycyl-L-Histidyl-L-Lysine Copper Complex)",
  "aliases": ["Copper peptide", "GHK copper"],  // Alternative names for search

  // === CLASSIFICATION ===
  "category": "peptides-cosmeceuticals",   // One of: "fda-approved", "off-label", "investigational", "peptides-cosmeceuticals"
  "categoryLabel": "Peptides / Cosmeceuticals",
  "approvalStatus": "none",               // One of: "fda-approved", "off-label", "investigational", "none"
  "approvalNote": "Not FDA-approved for any indication. Sold as a cosmeceutical ingredient.",

  // === OVERVIEW ===
  "mechanismOfAction": "Endogenous tripeptide that modulates ECM remodeling, stimulates VEGF and bFGF, and has broad gene expression effects. Declines ~60% from age 20 to 60.",
  "primaryTargets": ["ECM remodeling", "VEGF/angiogenesis", "TGF-beta modulation", "Wnt signaling (unconfirmed in hair)"],
  "routeOfAdministration": ["topical", "mesotherapy injection"],
  "typicalDose": "Topical: 0.01-1% in serums. Injection: varies (often part of multi-ingredient cocktails).",

  // === EVIDENCE SUMMARY ===
  "evidenceGrade": "C",                   // A (strong human RCT evidence) through F (no meaningful evidence)
  "evidenceGradeRationale": "Interesting mechanistic data and one flawed RCT. No rigorous human trial of topical GHK-Cu alone for hair loss.",
  "highestEvidenceLevel": "human-rct",     // Highest tier with at least one claim
  "totalClaimsEvaluated": 8,
  "humanTrialCount": 1,
  "evidenceLevelCounts": {
    "in-silico": 2,
    "in-vitro": 2,
    "in-vivo-animal": 0,
    "ex-vivo": 0,
    "human-open-label": 0,
    "human-rct": 1
  },

  // === COMPARISON TABLE FIELDS ===
  "oneLinerSummary": "Strong mechanistic rationale but no rigorous human evidence for topical hair regrowth",
  "strengthOfEvidenceForHair": 2,          // 1-5 integer scale for sorting (1=weakest, 5=strongest)
  "keyLimitation": "No placebo-controlled trial of topical GHK-Cu alone for hair loss",
  "bestFor": "Adjunct to proven treatments; wound healing and skin repair",

  // === CLAIMS ===
  "claims": [
    {
      "number": 1,
      "title": "GHK-Cu is a naturally occurring tripeptide that declines with age",
      "evidenceLevel": "in-vivo-animal",   // Most representative level of the underlying evidence
      "evidenceLevelLabel": "In vivo (human plasma measurements)",
      "evidenceWeight": "High",            // One of: "Very Low", "Low", "Low to Moderate", "Moderate", "Moderate-High", "High", "Highest"
      "weightRationale": "High for establishing biological relevance, but it doesn't prove topical supplementation works.",
      "model": "In vivo human plasma measurements. Researchers measured GHK concentrations in the blood of healthy human donors across different age groups.",
      "finding": "GHK levels average ~200 ng/mL at age 20 and drop to ~80 ng/mL by age 60 -- a roughly 60% decline.",
      "assessment": "The fact that GHK-Cu is endogenous (your body makes it) and declines with age is a legitimate scientific rationale for supplementation. It's a much stronger starting point than a completely synthetic compound with no natural role. But 'levels decline with age' is also true of hundreds of molecules -- testosterone, collagen, NAD+, melatonin -- and declining levels don't automatically mean that putting more on your scalp fixes hair loss. This is a necessary but not sufficient piece of evidence.",
      "assessmentSummary": "Establishes biological rationale but does not prove topical supplementation works.",
      "citations": [
        {
          "authors": "Pickart L",
          "year": 1973,
          "title": "Original isolation of GHK",
          "journal": "",
          "pmid": "",
          "doi": "",
          "url": ""
        },
        {
          "authors": "Pickart L, Thaler MM",
          "year": 1973,
          "title": "",
          "journal": "",
          "pmid": "",
          "doi": "",
          "url": ""
        },
        {
          "authors": "Pickart L",
          "year": 2008,
          "title": "Review",
          "journal": "",
          "pmid": "",
          "doi": "",
          "url": ""
        }
      ],
      "hairSpecific": true                 // Is this claim specifically about hair, or general biology?
    }
    // ... additional claims follow the same structure
  ],

  // === MISSING EVIDENCE ===
  "missingEvidence": [
    "A placebo-controlled human trial of topical GHK-Cu alone for hair loss. The Lee 2016 study used a GHK + 5-ALA combination. No published RCT isolates topical GHK-Cu as a standalone hair treatment.",
    "Direct evidence of Wnt/beta-catenin activation in hair follicle cells. The Wnt claim is extrapolated from cMap analysis of cancer cell lines.",
    "Proof that topically applied GHK-Cu reaches the follicle in meaningful concentrations. Skin penetration studies show only ~2% of applied GHK-Cu crosses the stratum corneum in 48 hours."
  ],

  // === BOTTOM LINE ===
  "bottomLine": {
    "summary": "GHK-Cu is the most scientifically interesting peptide being sold for hair loss. The biological rationale is stronger than any competing peptide (it touches ECM remodeling, VEGF, TGF-beta, and genomic pathways that matter for hair). The evidence base is real -- these aren't fabricated claims, and the researchers behind this work are legitimate scientists publishing in peer-reviewed journals. But 'most interesting' and 'proven' are different things.",
    "keyTakeaway": "It has the right mechanistic profile and early clinical signals to suggest it helps, but it hasn't been definitively proven in the way minoxidil and finasteride have. Use it as a complement, not a substitute.",
    "verdict": "Promising adjunct, not a standalone treatment"
  },

  // === LINKS ===
  "articleUrl": "/evidence/ghk-cu",        // Link to the full standalone article
  "pubmedSearchUrl": "https://pubmed.ncbi.nlm.nih.gov/?term=GHK-Cu+hair",

  // === METADATA ===
  "lastUpdated": "2026-03-18",
  "version": "1.0",
  "author": "Anagen Research Team",
  "reviewedBy": ""
}
```

### 3.2 Field Requirements for Content Agents

**Required fields (the build will fail without these):**
- `id`, `name`, `fullName`
- `category`, `categoryLabel`, `approvalStatus`
- `mechanismOfAction`, `primaryTargets`
- `evidenceGrade`, `evidenceGradeRationale`, `highestEvidenceLevel`
- `totalClaimsEvaluated`, `humanTrialCount`, `evidenceLevelCounts`
- `oneLinerSummary`, `strengthOfEvidenceForHair`, `keyLimitation`
- `claims` (at least 1)
- `missingEvidence` (at least 1 item)
- `bottomLine` (all 3 sub-fields)
- `lastUpdated`

**Each claim requires:**
- `number`, `title`, `evidenceLevel`, `evidenceWeight`
- `model`, `finding`, `assessment`, `assessmentSummary`
- `citations` (at least 1)
- `hairSpecific`

**Optional fields:**
- `aliases`, `approvalNote`, `routeOfAdministration`, `typicalDose`
- `bestFor`, `articleUrl`, `pubmedSearchUrl`
- `weightRationale`, `evidenceLevelLabel` on claims
- Full citation details (authors, title, journal, pmid, doi, url) -- at minimum provide `authors` and `year`

### 3.3 Evidence Grade Scale

Used in `evidenceGrade`. This is an overall letter grade for the treatment's hair loss evidence:

| Grade | Meaning | Criteria |
|-------|---------|----------|
| **A** | Strong evidence | Multiple well-designed RCTs with consistent positive results (e.g., finasteride, minoxidil) |
| **B** | Good evidence | At least one RCT or multiple strong open-label trials with meaningful effect sizes |
| **C** | Mixed/early evidence | Some human data but flawed, or strong preclinical data without adequate human confirmation |
| **D** | Weak evidence | Preclinical data only; no human hair-specific trials |
| **F** | No meaningful evidence | Claims are entirely theoretical, extrapolated, or based on unrelated models |

### 3.4 Enumerated Values Reference

**`category`** (exactly one of):
- `"fda-approved"`
- `"off-label"`
- `"investigational"`
- `"peptides-cosmeceuticals"`

**`approvalStatus`** (exactly one of):
- `"fda-approved"` -- FDA-approved specifically for hair loss / androgenetic alopecia
- `"off-label"` -- FDA-approved for another indication, used off-label for hair
- `"investigational"` -- In clinical development, not yet approved for any indication
- `"none"` -- Not a regulated drug; cosmeceutical, supplement, or peptide

**`evidenceLevel`** on claims (exactly one of):
- `"in-silico"`
- `"in-vitro"`
- `"in-vivo-animal"`
- `"ex-vivo"`
- `"human-open-label"`
- `"human-rct"`

**`evidenceWeight`** on claims (exactly one of):
- `"Very Low"`
- `"Low"`
- `"Low to Moderate"`
- `"Moderate"`
- `"Moderate-High"`
- `"High"`
- `"Highest"`

**`strengthOfEvidenceForHair`** (integer 1-5):
- `1` = No meaningful evidence for hair
- `2` = Interesting preclinical rationale but minimal/no human evidence
- `3` = Some human evidence, but limited or flawed
- `4` = Good human evidence from open-label or small RCTs
- `5` = Strong RCT evidence (multiple large trials)

---

## 4. Interaction Design

### 4.1 Tab System Behavior

**Activation:**
- Clicking a treatment tab loads its content into the TreatmentDetailPanel
- The URL hash updates to `#treatment={slug}` (e.g., `#treatment=ghk-cu`) for deep linking and shareability
- On page load, if a hash is present, auto-scroll to the Treatment Deep-Dive section and activate the correct tab
- Default active tab on first load (no hash): Finasteride (the most-searched treatment)

**Transitions:**
- Content panel fades out (150ms), swaps content, fades in (150ms)
- No full page reload; content is either pre-loaded or fetched via dynamic import
- The tab bar itself does not move during transitions (it stays pinned at the top of the Treatment Explorer section)

**Tab bar scrolling:**
- Desktop: all tabs visible, wrapped across lines if needed, grouped under category headings
- Tablet: tabs scroll horizontally within each category group
- Mobile: single horizontal scroll track with category labels as inline dividers

**Keyboard navigation:**
- Arrow keys move between tabs
- Enter/Space activates a tab
- Tab key moves focus from the tab bar to the content panel

### 4.2 Comparison Matrix Interactions

**Category filter pills:**
- "All" is active by default, showing all 15 treatments
- Clicking a category pill filters the table to show only that category
- Only one filter active at a time
- Transition: filtered-out rows animate out (height collapse, 200ms); remaining rows shift up

**Sorting:**
- Default sort: by `strengthOfEvidenceForHair` descending (strongest evidence first)
- Clickable column headers for: Treatment Name (alpha), Evidence Grade (A-F), Strength Score (1-5), Category
- Sort direction toggles on repeated click (asc/desc)
- Active sort column has a subtle arrow indicator

**Row click:**
- Clicking any row in the comparison matrix scrolls the page down to the Treatment Deep-Dive section and activates that treatment's tab
- The row has a hover state (subtle background highlight) and a cursor pointer
- On mobile: tap the row to navigate

### 4.3 Claim Card Interactions

**Expand/collapse:**
- Claims show a summary view by default: number, title, evidence badge, one-line assessment summary
- Click/tap anywhere on the card header to expand
- Expanded view reveals: full model description, full finding, full assessment, citations
- Smooth max-height animation (300ms ease)
- An "Expand all" / "Collapse all" toggle above the claims list

**Evidence badge interaction:**
- Hovering over an evidence badge shows a tooltip with the full description of that evidence level
- This reinforces the evidence hierarchy without requiring the reader to scroll back up

### 4.4 Evidence Hierarchy Explainer Interactions

**Collapse/expand:**
- First visit: expanded by default
- Subsequent visits (localStorage flag): collapsed by default
- Toggle button always visible: "How we evaluate evidence [chevron]"
- Smooth height animation (400ms)

**Tier cards:**
- On desktop, the 6 tiers are laid out as a horizontal pipeline/flow
- Clicking a tier card highlights it and shows its detail text
- On mobile, the tiers stack vertically as an accordion

### 4.5 "Explore More" CTA

Each treatment's detail panel ends with:
1. **Primary CTA:** "Read the full evidence breakdown" -- links to the standalone article page (e.g., `/evidence/ghk-cu`)
2. **Secondary CTA:** "View studies on PubMed" -- opens external PubMed search in new tab
3. If the standalone article does not yet exist, the primary CTA is replaced with "Full article coming soon" (disabled state, greyed out)

### 4.6 Scroll Behavior

- The Treatment Explorer tab bar becomes sticky when the user scrolls past it (sticky top, below the global nav)
- Sticky behavior uses `position: sticky` with appropriate `top` offset accounting for the global nav height
- When the user scrolls past the entire Treatment Explorer section, the sticky tab bar releases

### 4.7 Deep Linking

URL structure supports direct linking to:
- The page itself: `/hair-loss-treatment-science`
- A specific treatment: `/hair-loss-treatment-science#treatment=ghk-cu`
- A specific claim: `/hair-loss-treatment-science#treatment=ghk-cu&claim=3`

On load, the page parses the hash, scrolls to the correct section, activates the correct tab, and expands the correct claim if specified.

### 4.8 Data Loading Strategy

**Option A (recommended for initial launch -- 15 treatments is manageable):**
All treatment JSON files are bundled at build time into a single data payload. No runtime fetching. The page is fully static/SSG.

**Option B (if data grows significantly):**
Treatment summary data (for comparison matrix) is inlined. Full claim data is lazy-loaded per treatment on tab activation.

---

## 5. Visual Design

### 5.1 Design Philosophy

- **Scientific, not clinical.** Think Examine.com or Our World in Data -- authoritative, clean, data-dense but readable. Not a hospital website.
- **Trust through restraint.** No stock photos of hair, no before/after images, no "Buy Now" buttons. The design earns credibility by being understated.
- **Information-dense but scannable.** Heavy use of progressive disclosure (collapsed sections, expandable cards) so the page never feels overwhelming.
- **Accessible.** WCAG AA compliant. All color-coded elements have non-color-dependent alternatives (icons, labels, patterns).

### 5.2 Color Palette

**Primary palette:**

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#1A3C5E` | Primary text color for headings, nav, key UI elements. Deep navy. |
| `--color-primary-light` | `#2D5F8A` | Hover states, active borders |
| `--color-primary-lighter` | `#E8EEF4` | Light backgrounds for cards, table alternating rows |
| `--color-text` | `#1F2937` | Body text (gray-800) |
| `--color-text-secondary` | `#6B7280` | Secondary text, captions (gray-500) |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-bg-alt` | `#F9FAFB` | Alternating section backgrounds (gray-50) |
| `--color-border` | `#E5E7EB` | Borders, dividers (gray-200) |
| `--color-border-emphasis` | `#D1D5DB` | Stronger borders (gray-300) |

**Evidence level colors** (used in badges, heatmap bar, chart elements):

| Level | Fill | Text | Token |
|-------|------|------|-------|
| In silico | `#F3E8FF` | `#6B21A8` | `--color-evidence-silico` |
| In vitro | `#DBEAFE` | `#1E40AF` | `--color-evidence-vitro` |
| In vivo animal | `#D1FAE5` | `#065F46` | `--color-evidence-vivo` |
| Ex vivo | `#FEF3C7` | `#92400E` | `--color-evidence-exvivo` |
| Human open-label | `#FFEDD5` | `#9A3412` | `--color-evidence-openlabel` |
| Human RCT | `#FCE7F3` | `#9D174D` | `--color-evidence-rct` |

**Evidence grade colors** (letter grade badge):

| Grade | Background | Text |
|-------|-----------|------|
| A | `#D1FAE5` | `#065F46` |
| B | `#DBEAFE` | `#1E40AF` |
| C | `#FEF3C7` | `#92400E` |
| D | `#FFEDD5` | `#9A3412` |
| F | `#FEE2E2` | `#991B1B` |

### 5.3 Typography

| Element | Font | Size (desktop) | Size (mobile) | Weight | Line Height |
|---------|------|----------------|---------------|--------|-------------|
| H1 (page title) | Inter | 40px / 2.5rem | 28px / 1.75rem | 700 | 1.2 |
| H2 (section heads) | Inter | 30px / 1.875rem | 22px / 1.375rem | 700 | 1.3 |
| H3 (subsections) | Inter | 22px / 1.375rem | 18px / 1.125rem | 600 | 1.4 |
| H4 (claim titles) | Inter | 18px / 1.125rem | 16px / 1rem | 600 | 1.4 |
| Body | Inter | 16px / 1rem | 16px / 1rem | 400 | 1.7 |
| Body small | Inter | 14px / 0.875rem | 14px / 0.875rem | 400 | 1.6 |
| Caption/label | Inter | 12px / 0.75rem | 12px / 0.75rem | 500 | 1.5 |
| Badge text | Inter | 11px / 0.6875rem | 11px / 0.6875rem | 600 | 1 |
| Table cell | Inter | 14px / 0.875rem | 13px / 0.8125rem | 400 | 1.5 |
| Monospace (citations) | JetBrains Mono or system mono | 13px | 12px | 400 | 1.5 |

**Font loading:** Use `font-display: swap`. Load Inter from Google Fonts or self-host.

### 5.4 Spacing System

Use a 4px base unit:

| Token | Value | Common Usage |
|-------|-------|-------------|
| `--space-1` | 4px | Tight gaps within elements |
| `--space-2` | 8px | Between badge and text, between icon and label |
| `--space-3` | 12px | Card internal padding (small) |
| `--space-4` | 16px | Standard card padding, gap between list items |
| `--space-5` | 20px | Between related sections |
| `--space-6` | 24px | Card padding (large), between components |
| `--space-8` | 32px | Between major sections |
| `--space-10` | 40px | Section padding top/bottom |
| `--space-12` | 48px | Hero padding, major section breaks |
| `--space-16` | 64px | Between major page sections |

**Max content width:** `1200px` centered with auto margins.
**Content padding (horizontal):** `24px` on mobile, `32px` on tablet, `0` on desktop (content sits within the max-width container).

### 5.5 Borders and Shadows

- **Cards:** `border: 1px solid var(--color-border); border-radius: 8px;`
- **Elevated cards (claim cards on hover):** `box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);`
- **Active tab:** `border-bottom: 2px solid var(--color-primary);`
- **Table rows:** Bottom border only: `border-bottom: 1px solid var(--color-border);`
- **Evidence heatmap segments:** `border-radius: 4px;` with `2px` gap between segments

### 5.6 Iconography

Use a minimal icon set. Prefer Lucide Icons (open source, consistent with scientific aesthetic):

- Chevron down/up: expand/collapse indicators
- External link: for PubMed/external links
- Filter: for category filter bar
- Sort ascending/descending: for table sort
- Info circle: for tooltips on evidence badges
- Check circle: for "included" in comparison matrix
- Minus circle: for "not present" in comparison matrix
- Flask: for evidence level "in vitro"
- Monitor: for "in silico"
- Mouse: for "in vivo animal" (or a DNA helix)
- Microscope: for "ex vivo"
- User: for "human open-label"
- Shield check: for "human RCT"

### 5.7 Motion and Animation

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Tab content fade | 150ms | ease-in-out | Tab switch |
| Card expand/collapse | 300ms | ease | Click |
| Evidence hierarchy expand | 400ms | ease | Toggle click |
| Table row filter out | 200ms | ease | Filter pill click |
| Hover elevation (cards) | 150ms | ease | Mouse enter |
| Badge tooltip | 100ms delay, 150ms fade | ease | Mouse enter |

---

## 6. SEO Structure

### 6.1 URL Strategy

**Main page:** `https://anagen.xyz/hair-loss-treatment-science`

**Individual article pages** (linked from "Explore More"):
```
https://anagen.xyz/evidence/finasteride
https://anagen.xyz/evidence/minoxidil
https://anagen.xyz/evidence/dutasteride
https://anagen.xyz/evidence/ghk-cu
https://anagen.xyz/evidence/bpc-157
... etc.
```

This creates a hub-and-spoke SEO structure where the landing page is the hub linking to detailed spoke pages.

### 6.2 Meta Tags

```html
<title>Hair Loss Treatments: Evidence-Based Science Review | Anagen</title>
<meta name="description" content="Comprehensive evidence breakdown of 15 hair loss treatments. Claim-by-claim analysis of finasteride, minoxidil, dutasteride, GHK-Cu, BPC-157, and more. Every claim matched to its experimental model and evidence level.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://anagen.xyz/hair-loss-treatment-science">

<!-- Open Graph -->
<meta property="og:title" content="Hair Loss Treatments: What the Science Actually Shows">
<meta property="og:description" content="15 treatments. 100+ claims. Every one matched to its evidence level. The most comprehensive evidence-based guide to hair loss science.">
<meta property="og:type" content="article">
<meta property="og:url" content="https://anagen.xyz/hair-loss-treatment-science">
<meta property="og:image" content="https://anagen.xyz/images/hair-loss-science-og.png">
<meta property="og:site_name" content="Anagen">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Hair Loss Treatments: What the Science Actually Shows">
<meta name="twitter:description" content="15 treatments. 100+ claims. Every one matched to its evidence level.">
<meta name="twitter:image" content="https://anagen.xyz/images/hair-loss-science-og.png">
```

### 6.3 Heading Hierarchy

Proper heading hierarchy is critical for both Google and LLM indexing. The page MUST follow this structure:

```
<h1> Hair Loss Treatments: What the Science Actually Shows
  <h2> How We Evaluate Evidence: The Evidence Hierarchy
    <h3> In Silico (Computational)
    <h3> In Vitro (Cell Culture)
    <h3> In Vivo (Animal Studies)
    <h3> Ex Vivo (Human Tissue)
    <h3> Human Open-Label Trials
    <h3> Human Randomized Controlled Trials
  <h2> Treatment Comparison
  <h2> Treatment Evidence Breakdowns
    <h3> FDA-Approved Treatments
      <h4> Finasteride
      <h4> Minoxidil
    <h3> Off-Label Treatments
      <h4> Dutasteride
      <h4> Liothyronine / T3
      <h4> Levocetirizine
      <h4> Latanoprost
      <h4> Ketoconazole
    <h3> Investigational Treatments
      <h4> PP405
      <h4> TDM105
      <h4> Veradermics
    <h3> Peptides & Cosmeceuticals
      <h4> GHK-Cu (Copper Peptide)
      <h4> BPC-157
      <h4> TB-500 / Thymosin Beta-4
      <h4> Acetyl Tetrapeptide-3 (Capixyl)
      <h4> Biotinoyl Tripeptide-1 (Procapil)
  <h2> Our Methodology
```

**Critical:** Even though the page uses tabs and only one treatment is visually displayed at a time, ALL treatment content MUST be present in the DOM (hidden with CSS, not removed from the DOM) so that search engines and LLMs can index every treatment. Use `display: none` or `hidden` attribute with `aria-hidden="true"` for inactive tabs, NOT conditional rendering that removes content from the DOM.

Alternatively, use server-side rendering (SSR/SSG) so that the full HTML is present in the initial page source regardless of JavaScript execution.

### 6.4 Schema.org Structured Data

Add the following JSON-LD blocks to the page `<head>`:

**1. WebPage schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Hair Loss Treatments: What the Science Actually Shows",
  "description": "Comprehensive evidence breakdown of 15 hair loss treatments with claim-by-claim analysis.",
  "url": "https://anagen.xyz/hair-loss-treatment-science",
  "datePublished": "2026-03-18",
  "dateModified": "2026-03-18",
  "publisher": {
    "@type": "Organization",
    "name": "Anagen",
    "url": "https://anagen.xyz"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "Hair Loss Treatments",
    "numberOfItems": 15,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Drug",
          "name": "Finasteride",
          "description": "FDA-approved oral 5-alpha-reductase inhibitor for androgenetic alopecia",
          "url": "https://anagen.xyz/evidence/finasteride"
        }
      }
      // ... repeat for each treatment
    ]
  }
}
```

**2. FAQPage schema** (generated from claims -- each treatment's bottom line can be framed as a Q&A):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does GHK-Cu (copper peptide) work for hair loss?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GHK-Cu has the right mechanistic profile and early clinical signals to suggest it helps, but it hasn't been definitively proven in the way minoxidil and finasteride have. The clinical evidence remains thin: one RCT with a combination formula, one pilot injection study with a multi-ingredient cocktail, and mostly preclinical data. Use it as a complement to proven treatments, not a substitute. Evidence grade: C."
      }
    }
    // ... one Q&A per treatment
  ]
}
```

**3. MedicalWebPage type** (for YMYL signal):
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "about": {
    "@type": "MedicalCondition",
    "name": "Androgenetic Alopecia",
    "alternateName": ["Male Pattern Baldness", "Female Pattern Hair Loss", "Hair Loss"]
  },
  "lastReviewed": "2026-03-18",
  "reviewedBy": {
    "@type": "Organization",
    "name": "Anagen Research Team"
  }
}
```

### 6.5 Semantic HTML Requirements

- Use `<article>` for each treatment detail panel
- Use `<section>` with `aria-labelledby` for major page sections
- Use `<table>` with `<caption>`, `<thead>`, `<tbody>` for the comparison matrix (not div-based grid)
- Use `<details>`/`<summary>` as the base for expandable claim cards (progressive enhancement)
- Use `role="tablist"`, `role="tab"`, `role="tabpanel"` for the treatment tabs
- All images (if any) have descriptive `alt` text
- All interactive elements are keyboard-focusable
- Use `<cite>` for citation references
- Use `<abbr>` for abbreviations on first use (e.g., `<abbr title="Randomized Controlled Trial">RCT</abbr>`)

### 6.6 Content Indexing Optimization

For LLM indexing specifically:
- Each treatment section begins with a machine-parseable summary block (the QuickStats component)
- The comparison matrix uses real `<table>` markup so LLMs can parse rows/columns
- Claims use a consistent, predictable structure (numbered, with labeled sub-sections) so LLMs can extract individual claims
- The evidence hierarchy is presented as a `<table>` in addition to the visual diagram
- Each treatment panel includes its `name`, `category`, `evidenceGrade`, and `bottomLine.keyTakeaway` in plain text within the first 200 characters of the panel (front-loaded for snippet extraction)

---

## 7. Comparison Table Design

### 7.1 Overview

The comparison matrix is the "hero table" of the page -- the element that makes this a true central resource. It shows all 15 treatments in a scannable, sortable format.

### 7.2 Columns

| Column | Width | Content | Sortable? |
|--------|-------|---------|-----------|
| **Treatment** | 180px (fixed) | Name + category badge | Yes (alpha) |
| **Category** | hidden on mobile; 140px desktop | Category label | Yes |
| **Grade** | 60px | Letter grade (A-F) in colored badge | Yes |
| **Strength** | 80px | 1-5 bar/dot visualization | Yes (default sort, desc) |
| **In silico** | 50px | Checkmark or count if present, dash if not | No |
| **In vitro** | 50px | Same | No |
| **In vivo** | 50px | Same | No |
| **Ex vivo** | 50px | Same | No |
| **Open-label** | 60px | Same | No |
| **RCT** | 50px | Same | No |
| **Key limitation** | 220px (desktop only) | One-line text | No |

### 7.3 Row Design

Each row represents one treatment:

```
+-------------+----------+-------+--------+----+----+----+----+----+-----+-------------------+
| Finasteride | FDA-App. |   A   | █████  | -- |  3 |  2 |  1 |  4 |  8  | ...               |
| [FDA badge] |          | [grn] | 5/5    |    |    |    |    |    |     |                   |
+-------------+----------+-------+--------+----+----+----+----+----+-----+-------------------+
| GHK-Cu      | Peptide  |   C   | ██░░░  |  2 |  2 | -- | -- | -- |  1  | No RCT of topical |
| [Pep badge] |          | [amb] | 2/5    |    |    |    |    |    |     | GHK-Cu alone...   |
+-------------+----------+-------+--------+----+----+----+----+----+-----+-------------------+
```

**Treatment name cell:**
- Treatment name in semibold
- Small category badge below the name
- Entire row is clickable (navigates to that treatment's tab)

**Evidence level cells (In silico through RCT):**
- If the treatment has 0 claims at that level: em dash `--` in `--color-text-secondary`
- If the treatment has 1+ claims at that level: the count number in a small filled circle, colored with that level's evidence color
- On hover, a tooltip shows: "{N} claims at {level} evidence"

**Strength visualization:**
- 5 small horizontal bars or dots
- Filled bars use `--color-primary`, unfilled use `--color-border`
- Number overlay: "3/5"

**Grade cell:**
- Letter in a colored circle/badge using the evidence grade colors from Section 5.2

### 7.4 Category Filter Pills

Displayed above the table as a horizontal row of pill buttons:

```
[All (15)] [FDA-Approved (2)] [Off-Label (5)] [Investigational (3)] [Peptides (5)]
```

- Each pill shows the count of treatments in that category
- Active pill has filled background (`--color-primary`, white text)
- Inactive pills have outline style (`border: 1px solid --color-border`, `--color-text` text)
- On click, the table animates to show only treatments in that category

### 7.5 Mobile Table Behavior

On mobile (< 768px), the full table is not practical. Instead, render a **card list view**:

```
+------------------------------------------+
| Finasteride                     Grade: A |
| FDA-Approved                    ★★★★★    |
| Oral 5α-reductase inhibitor              |
|                                          |
| Evidence: [IN VITRO] [IN VIVO] [RCT]    |
| "Gold standard treatment with..."        |
|                               [View →]   |
+------------------------------------------+
```

Each card shows:
- Treatment name and grade badge
- Category badge
- Strength dots
- Evidence level badges (only levels with claims)
- One-liner summary (truncated to 2 lines)
- "View" link that navigates to the treatment tab

Cards are filterable using the same category pills (which become a horizontal scroll on mobile).

---

## 8. Responsive Behavior

### 8.1 Breakpoints

| Name | Min-width | Typical devices |
|------|-----------|-----------------|
| `mobile` | 0px | Phones (portrait) |
| `tablet` | 768px | Tablets, phones (landscape) |
| `desktop` | 1024px | Laptops, desktops |
| `wide` | 1280px | Large monitors |

### 8.2 Layout Changes by Breakpoint

#### Hero Section
- **Desktop/wide:** Title, subtitle, trust signals in a single centered column. Title is 40px.
- **Tablet:** Same layout, title drops to 32px.
- **Mobile:** Title drops to 28px. Trust signals wrap to 2 rows (2x2 grid instead of 1x4).

#### Evidence Hierarchy
- **Desktop/wide:** Horizontal pipeline layout. All 6 tier cards side by side with connecting arrows.
- **Tablet:** 3x2 grid of tier cards.
- **Mobile:** Vertical stack. Each tier is a collapsible accordion item.

#### Comparison Matrix
- **Desktop/wide:** Full table with all columns visible.
- **Tablet:** Table with "Key limitation" column hidden. Horizontal scroll enabled.
- **Mobile:** Switches to card list view (see Section 7.5). Table is not rendered.

#### Treatment Tab Bar
- **Desktop/wide:** All tabs visible, arranged in rows by category. Category headings are inline labels.
- **Tablet:** Horizontal scroll within each category group. Category headings are still visible.
- **Mobile:** Single horizontal scroll track. Category labels are small, inline dividers. Active tab is centered in the viewport on activation.

#### Treatment Detail Panel
- **Desktop/wide:** Full-width within the content container (1200px max). QuickStats is a 4-column grid. Claims list is single column with generous padding.
- **Tablet:** QuickStats becomes a 2-column grid. Otherwise same.
- **Mobile:** QuickStats becomes single column (stacked). Evidence heatmap bar scrolls horizontally if needed. Claim cards take full width. Citation text is wrapped and smaller (12px).

#### Claim Cards
- **Desktop:** Claim number, title, and evidence badge on the same line. Assessment summary on the next line.
- **Mobile:** Claim number on its own line. Title wraps freely. Evidence badge on a new line below the title.

### 8.3 Touch Targets

All interactive elements (tabs, filter pills, claim card headers, expand/collapse toggles) have a minimum touch target of **44x44px** on mobile, per WCAG guidelines.

### 8.4 Performance Considerations

- **Images:** None required for core content. The OG image is the only image asset.
- **Fonts:** Load only Inter (400, 500, 600, 700 weights). Use system font stack as fallback.
- **JavaScript:** Minimal. Tab switching, filter/sort, expand/collapse. No heavy frameworks required -- can be built with vanilla JS or a lightweight framework (Astro, Next.js SSG, or similar).
- **Data payload:** All 15 treatment JSON files combined should be under 500KB. Inline into the page at build time.
- **Target:** Lighthouse Performance score >= 90, LCP < 2.5s, CLS < 0.1.

### 8.5 Print Styles

Add `@media print` styles:
- Remove sticky elements, tab bar, filter pills
- Show ALL treatment content (not just the active tab)
- Remove interactive controls (expand/collapse -- show everything expanded)
- Use black text on white background
- Include URLs for external links in parentheses
- Add page breaks before each treatment section

---

## Appendix A: Complete Treatment List with Slugs

| # | Treatment | Slug | Category | Data file path |
|---|-----------|------|----------|----------------|
| 1 | Finasteride | `finasteride` | fda-approved | `/content/finasteride/data.json` |
| 2 | Minoxidil | `minoxidil` | fda-approved | `/content/minoxidil/data.json` |
| 3 | Dutasteride | `dutasteride` | off-label | `/content/dutasteride/data.json` |
| 4 | Liothyronine / T3 | `liothyronine` | off-label | `/content/liothyronine/data.json` |
| 5 | Levocetirizine | `levocetirizine` | off-label | `/content/levocetirizine/data.json` |
| 6 | Latanoprost | `latanoprost` | off-label | `/content/latanoprost/data.json` |
| 7 | Ketoconazole | `ketoconazole` | off-label | `/content/ketoconazole/data.json` |
| 8 | PP405 | `pp405` | investigational | `/content/pp405/data.json` |
| 9 | TDM105 | `tdm105` | investigational | `/content/tdm105/data.json` |
| 10 | Veradermics | `veradermics` | investigational | `/content/veradermics/data.json` |
| 11 | GHK-Cu | `ghk-cu` | peptides-cosmeceuticals | `/content/ghk-cu/data.json` |
| 12 | BPC-157 | `bpc-157` | peptides-cosmeceuticals | `/content/bpc-157/data.json` |
| 13 | TB-500 / Thymosin Beta-4 | `tb-500` | peptides-cosmeceuticals | `/content/tb-500/data.json` |
| 14 | Acetyl Tetrapeptide-3 (Capixyl) | `acetyl-tetrapeptide-3` | peptides-cosmeceuticals | `/content/acetyl-tetrapeptide-3/data.json` |
| 15 | Biotinoyl Tripeptide-1 (Procapil) | `biotinoyl-tripeptide-1` | peptides-cosmeceuticals | `/content/biotinoyl-tripeptide-1/data.json` |

## Appendix B: Evidence Grade Assignments (Expected)

These are approximate expected grades based on existing literature. Content agents should verify and may adjust with justification.

| Treatment | Expected Grade | Rationale |
|-----------|---------------|-----------|
| Finasteride | A | Multiple large RCTs, FDA-approved |
| Minoxidil | A | Multiple large RCTs, FDA-approved |
| Dutasteride | B | RCT data exists, off-label but strong |
| Ketoconazole | B-C | Some RCT evidence for 2% shampoo |
| Latanoprost | C | Small RCT for eyelash, limited scalp data |
| Liothyronine / T3 | C-D | Mechanistic rationale, very limited human hair data |
| Levocetirizine | D | Emerging case reports, no RCT for hair |
| PP405 | C | Phase 2 trial data may exist |
| TDM105 | C-D | Early clinical data |
| Veradermics | C-D | Early clinical data |
| GHK-Cu | C | One flawed RCT, strong preclinical |
| BPC-157 | D | No hair-specific human data |
| TB-500 | D | No hair-specific human data |
| Acetyl Tetrapeptide-3 | C-D | Some open-label human data (Capixyl studies) |
| Biotinoyl Tripeptide-1 | C-D | Some open-label human data (Procapil studies) |

## Appendix C: Implementation Notes for the Coding Agent

1. **Framework recommendation:** Astro or Next.js (SSG mode). Both produce static HTML with optional client-side interactivity -- ideal for SEO. Astro is lighter if there are no other React components on the site.

2. **Build process:** At build time, read all `/content/{slug}/data.json` files, validate against `/content/schema.json`, and generate the page. A missing or invalid data file should produce a build warning (not a build failure) -- render that treatment's tab with a "Content coming soon" placeholder.

3. **CSS approach:** Use CSS custom properties (variables) for the design tokens. Tailwind CSS is acceptable if the team uses it, but ensure the custom color palette is configured. If not using Tailwind, a lightweight approach with CSS modules or scoped styles is preferred.

4. **Testing:** Each treatment tab should be testable in isolation. The comparison matrix should be testable with mock data.

5. **Content agent workflow:** Each of the 10 content agents writes their treatment's `data.json` file. A CI check validates the JSON against `schema.json`. Once valid, the build auto-deploys.

6. **Accessibility audit:** Run axe-core or Lighthouse accessibility audit. Target score >= 95.

7. **Analytics events to track:**
   - Tab switches (which treatments get the most clicks)
   - Claim expansions (which claims get read)
   - Filter usage (which categories are most explored)
   - "Explore More" clicks (conversion to full articles)
   - Scroll depth (how far down the page users get)
   - Time on page / section

---

*End of design specification.*
