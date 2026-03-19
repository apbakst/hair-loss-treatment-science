# Treatment Detail View -- Design Specification

**URL pattern:** `anagen.xyz/hair-loss-treatment-science#treatment={slug}` (inline) or future dedicated route
**Last updated:** 2026-03-19
**Status:** Design spec for coding agent implementation
**Depends on:** `DESIGN_SPEC.md`, `/content/schema.json` (extended with `efficacy` and `sideEffects` fields)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Entry Points and Navigation](#2-entry-points-and-navigation)
3. [Component Hierarchy](#3-component-hierarchy)
4. [Section-by-Section Design](#4-section-by-section-design)
5. [Visual Design](#5-visual-design)
6. [Responsive Behavior](#6-responsive-behavior)
7. [Interaction Design](#7-interaction-design)
8. [Data Requirements](#8-data-requirements)
9. [Accessibility](#9-accessibility)

---

## 1. Overview

The Treatment Detail View is the focused, single-treatment presentation that appears when a user clicks on a treatment from the comparison table or tab bar. It replaces the current `TreatmentDetailPanel` (described in DESIGN_SPEC.md Section 2.4) with a richer layout that includes structured efficacy data (key trial results, timelines), side effect profiles (common/serious AEs, contraindications, drug interactions, special populations), and improved navigation.

### 1.1 Design Goals

- **Clinical depth without clinical coldness.** Present trial data, side effect rates, and contraindications in a way that is precise but approachable. Think UpToDate-meets-Examine.com.
- **Progressive disclosure.** The view loads with a scannable summary layer (header, quick stats, efficacy summary, side effect highlights). Detailed trial tables, full AE lists, and expanded claims are one click deeper.
- **Seamless integration.** The detail view uses the same CSS custom properties, typography scale, color palette, and component patterns defined in DESIGN_SPEC.md. A reader scrolling from the comparison table into the detail view should feel no visual discontinuity.
- **Graceful degradation.** The `efficacy` and `sideEffects` fields are optional in `schema.json`. If a treatment does not yet have these fields populated, the detail view must render cleanly without those sections, falling back to the existing claims-based layout.

### 1.2 Scope

This spec covers the content and layout of the detail view panel only. It does NOT cover:
- Changes to the comparison table or tab bar (those remain as specified in DESIGN_SPEC.md)
- The standalone article pages at `/evidence/{slug}` (separate spec)
- Data entry guidelines for content agents (separate document, though data field requirements are noted here)

---

## 2. Entry Points and Navigation

### 2.1 How Users Reach the Detail View

1. **Comparison table row click.** Clicking a row in the comparison matrix scrolls down to the Treatment Explorer section and activates that treatment's tab. The detail view panel renders below.
2. **Tab bar click.** Clicking a treatment tab in the tab bar swaps the detail view content.
3. **Direct URL.** Loading the page with `#treatment={slug}` auto-scrolls to the Treatment Explorer and activates the correct tab.
4. **Prev/Next arrows.** Navigation arrows within the detail view itself (see Section H below) allow stepping through treatments sequentially.

### 2.2 URL and History

- Activating a treatment updates the URL hash to `#treatment={slug}`.
- The browser's back/forward buttons navigate between previously viewed treatments.
- Deep-linking to a specific section within the detail view is supported via `#treatment={slug}&section={section-id}` (e.g., `&section=efficacy`, `&section=side-effects`, `&section=claims`).

### 2.3 Navigation Elements

**Back to comparison table button:**
- Positioned at the very top of the detail view, left-aligned.
- Text: "Back to comparison table" with a left-arrow icon.
- Scrolls the viewport back to the comparison matrix section.
- Style: text-link style (no border/background), `--color-primary-light`, with hover underline.

**Prev/Next treatment arrows:**
- Positioned at the bottom of the detail view (Section H).
- Also available as a compact pair at the top-right of the detail view (next to the back button).
- Treatment order follows the canonical list order from DESIGN_SPEC.md Appendix A (Finasteride through Biotinoyl Tripeptide-1).
- Wraps around: "Next" on the last treatment goes to Finasteride; "Prev" on Finasteride goes to Biotinoyl Tripeptide-1.

---

## 3. Component Hierarchy

```
<TreatmentDetailView treatment={activeTreatment}>
  <DetailNav>
    <BackToTableLink />
    <PrevNextCompact />
  </DetailNav>

  <!-- Section A: Header -->
  <DetailHeader>
    <TreatmentName />
    <CategoryBadge />
    <EvidenceGradeBadge />
    <OneLinerSummary />
    <MechanismOfAction />
    <ApprovalStatusNote />
  </DetailHeader>

  <!-- Section B: Quick Stats Bar -->
  <QuickStatsBar>
    <StatChip label="Evidence Grade" value={grade} visual="letter-badge" />
    <StatChip label="Claims Evaluated" value={totalClaimsEvaluated} />
    <StatChip label="Human Trials" value={humanTrialCount} />
    <StatChip label="Strength" value={strengthOfEvidenceForHair} visual="dots" />
  </QuickStatsBar>

  <!-- Section C: Efficacy (conditional -- only if efficacy data exists) -->
  <EfficacySection>
    <TrialResultsTable trials={efficacy.keyTrials} />
    <EfficacyTimeline
      timeToEffect={efficacy.timeToEffect}
      peakEffect={efficacy.peakEffect}
      maintenanceRequired={efficacy.maintenanceRequired}
      discontinuationEffect={efficacy.discontinuationEffect}
    />
    <EfficacySummaryVisual />
  </EfficacySection>

  <!-- Section D: Side Effects (conditional -- only if sideEffects data exists) -->
  <SideEffectsSection>
    <CommonAEsList items={sideEffects.commonAEs} />
    <SeriousAEsCallout items={sideEffects.seriousAEs} />
    <DiscontinuationRate value={sideEffects.discontinuationRate} />
    <ContraindicationsList items={sideEffects.contraindications} />
    <DrugInteractionsList items={sideEffects.drugInteractions} />
    <SpecialPopulationsCallout data={sideEffects.specialPopulations} />
    <BlackBoxWarning text={sideEffects.blackBoxWarning} />
  </SideEffectsSection>

  <!-- Section E: Evidence Claims (existing, enhanced) -->
  <EvidenceClaimsSection>
    <EvidenceHeatmapBar levels={evidenceLevelCounts} />
    <ClaimsControls>
      <ExpandAllToggle />
      <FilterByLevel />
    </ClaimsControls>
    <ClaimCardList claims={claims} />
  </EvidenceClaimsSection>

  <!-- Section F: Missing Evidence -->
  <MissingEvidenceSection items={missingEvidence} />

  <!-- Section G: Bottom Line -->
  <BottomLineSection>
    <VerdictBadge text={bottomLine.verdict} />
    <SummaryText text={bottomLine.summary} />
    <KeyTakeaway text={bottomLine.keyTakeaway} />
    <ExploreMoreCTA articleUrl={articleUrl} pubmedUrl={pubmedSearchUrl} />
  </BottomLineSection>

  <!-- Section H: Navigation Footer -->
  <DetailNavFooter>
    <PrevTreatmentCard />
    <BackToTableButton />
    <NextTreatmentCard />
  </DetailNavFooter>
</TreatmentDetailView>
```

---

## 4. Section-by-Section Design

### Section A: Header

**Purpose:** Immediately orient the reader. Who is this treatment, what category is it, how strong is the evidence, and what is the one-sentence story.

**Layout:**

```
+------------------------------------------------------------------+
| < Back to comparison table                    [< Prev] [Next >]  |
+------------------------------------------------------------------+
|                                                                    |
|  [FDA-Approved]  [Grade: A]                                       |
|                                                                    |
|  Finasteride                                                       |
|  Oral 5-alpha-reductase inhibitor that reduces scalp DHT by ~70%  |
|                                                                    |
|  One-liner summary text here in secondary color                    |
|                                                                    |
|  Approval: FDA-approved for male androgenetic alopecia (1997)      |
|  Route: Oral | Typical dose: 1mg daily                            |
|                                                                    |
+------------------------------------------------------------------+
```

**Elements:**

1. **Treatment name** -- `h4` (within the panel, since `h3` is used for the category group heading above). Uses `font-size: 1.375rem`, `font-weight: 700`, `color: --color-primary`. This is the visual centerpiece.

2. **Category badge** -- Reuses the existing `.cat-badge` component. Positioned above the treatment name, left-aligned.

3. **Evidence grade badge** -- The circular letter-grade badge (`.grade-badge`). Positioned inline with the category badge, to its right. Uses the grade color mapping from DESIGN_SPEC.md Section 5.2.

4. **One-liner summary** -- The `oneLinerSummary` field. Displayed below the treatment name in `--color-text-secondary`, `font-size: 0.9375rem`.

5. **Mechanism of action** -- The `mechanismOfAction` field. Displayed below the one-liner in standard body text.

6. **Approval status note** -- If `approvalNote` exists, display it in a small muted line. Format: "Approval: {approvalNote}".

7. **Route and dose** -- If `routeOfAdministration` and/or `typicalDose` exist, display on the same line as approval note. Format: "Route: Oral, Topical | Typical dose: 1mg daily".

**Conditional rendering:**
- `approvalNote`, `routeOfAdministration`, `typicalDose` are optional. If absent, those lines simply do not render.

---

### Section B: Quick Stats Bar

**Purpose:** Give four key numbers at a glance in a single horizontal row. This is the "dashboard strip" that lets a reader immediately assess the treatment without reading further.

**Layout:**

```
+---------------+-------------------+----------------+----------------+
|  Evidence     |  Claims           |  Human         |  Strength      |
|  Grade        |  Evaluated        |  Trials        |                |
|               |                   |                |                |
|     A         |       12          |       8        |  * * * * *     |
|               |                   |                |    5 / 5       |
+---------------+-------------------+----------------+----------------+
```

**Elements:**

Each stat is rendered as a `.stat-card` (reusing the existing component from DESIGN_SPEC.md):

1. **Evidence Grade** -- The letter grade displayed large (1.5rem, bold, colored with grade colors). Label: "Evidence Grade".
2. **Claims Evaluated** -- Integer `totalClaimsEvaluated`. Label: "Claims Evaluated".
3. **Human Trials** -- Integer `humanTrialCount`. Label: "Human Trials".
4. **Strength** -- The `strengthOfEvidenceForHair` score (1-5). Displayed as a row of 5 dots/circles where filled dots = score. Below the dots, show "{n} / 5". Label: "Strength of Evidence".

**Strength dots visual:**
- 5 circles, each 10px diameter.
- Filled: `--color-primary` background.
- Unfilled: `--color-border` background.
- Arranged horizontally with 4px gaps.
- The numeric label "3/5" appears below in `--color-text-secondary`, `font-size: 0.75rem`.

**Responsive behavior:**
- Desktop: 4 columns in a single row (existing `.quick-stats` grid).
- Tablet: 2x2 grid.
- Mobile: Single column stack.

---

### Section C: Efficacy Section

**Purpose:** Present clinical trial results in a structured, scannable format. This is the section that answers "Does it work? How well? How fast?"

**Conditional rendering:** This entire section renders only if the `efficacy` object exists on the treatment data. If `efficacy` is absent, skip directly to Section D (or Section E if D is also absent).

**Layout:**

```
+------------------------------------------------------------------+
|  Efficacy                                                         |
|  -------                                                          |
|                                                                    |
|  KEY CLINICAL TRIALS                                              |
|  +------+--------+-----+--------+---------------------+--------+ |
|  | Trial| Design | N   | Dur.   | Primary Endpoint    | Result | |
|  +------+--------+-----+--------+---------------------+--------+ |
|  | Kauf | RCT    | 1553| 24 mo  | Hair count change   | +11%   | |
|  | man  |        |     |        |                     | p<0.001| |
|  +------+--------+-----+--------+---------------------+--------+ |
|  | Whit | RCT    | 1215| 12 mo  | Hair count (2.5cm)  | +16.7  | |
|  | ing  |        |     |        |                     | p<0.001| |
|  +------+--------+-----+--------+---------------------+--------+ |
|                                                                    |
|  TIMELINE                                                         |
|  +--[3 months]-------[12 months]--------[24 months]----------->  |
|  |  Initial effect    Peak effect        Ongoing maintenance     |
|  |                                                                |
|  Maintenance required: Yes                                        |
|  If stopped: Hair loss resumes within 6-12 months                |
|                                                                    |
+------------------------------------------------------------------+
```

#### C.1 Section Header

- `h3`: "Efficacy"
- Subtle subheading or no subheading. Keep it clean.

#### C.2 Key Clinical Trials Table

**Data source:** `efficacy.keyTrials` array.

**Table columns:**

| Column | Data field | Width hint | Notes |
|--------|-----------|------------|-------|
| Study | `name` | 150px | Bold. If long, allow wrapping. |
| Design | `design` | 90px | Rendered as a badge: `RCT`, `Open-label`, `Retrospective`, `Case series`, `Meta-analysis`, `Preclinical`. Use evidence-level-style colored pills. |
| N | `n` | 60px | Right-aligned integer. |
| Duration | `duration` | 90px | As provided (e.g., "24 months"). |
| Population | `population` | 160px | If present. On mobile, hidden or collapsed into an expand row. |
| Primary Endpoint | `primaryEndpoint` | 180px | What was measured. |
| Result | `result` | 180px | Bold. This is the key number. |
| p-value | `pValue` | 70px | If present. Displayed in monospace, muted color. |

**Design badge mapping for the `design` field:**

| Design value | Badge label | Background | Text |
|-------------|------------|-----------|------|
| `rct` | RCT | `--ev-rct-bg` | `--ev-rct-text` |
| `open-label` | OPEN-LABEL | `--ev-openlabel-bg` | `--ev-openlabel-text` |
| `retrospective` | RETRO | `#F3F4F6` | `#4B5563` |
| `case-series` | CASE SERIES | `#F3F4F6` | `#4B5563` |
| `meta-analysis` | META | `#EDE9FE` | `#5B21B6` |
| `preclinical` | PRECLINICAL | `--ev-vivo-bg` | `--ev-vivo-text` |

**Table styling:**
- Reuses the existing `.matrix-table` base styles (DESIGN_SPEC.md Section 7) with the same border, border-radius, alternating row background, and typography.
- Table header row: uppercase labels in `--color-text-secondary`, `font-size: 0.75rem`.
- Table cells: `font-size: 0.875rem`.
- The `result` column uses `font-weight: 600` and `color: --color-primary` to visually highlight the key finding.
- If `pValue` is present, display it below the result in the same cell, in `font-size: 0.75rem`, `color: --color-text-secondary`, monospace.
- If `responderRate` is present, display below `pValue` as "Responders: {rate}" with optional tooltip for `responderDefinition`.

**Empty state:** If `efficacy.keyTrials` is an empty array or absent, show: "No structured trial data available yet. See individual claims below for study-level evidence." in muted text.

#### C.3 Efficacy Timeline

**Data source:** `efficacy.timeToEffect`, `efficacy.peakEffect`, `efficacy.maintenanceRequired`, `efficacy.discontinuationEffect`.

**Layout:** A horizontal timeline bar with labeled milestones, followed by text details.

```
TIMELINE
[--------|--- Initial effect ---|--- Peak effect ---|---> Ongoing]
          ~3 months              ~12 months

Maintenance required: Yes
If stopped: Hair loss resumes within 6-12 months; returns to baseline in 12-24 months.
```

**Timeline bar visual:**
- A single horizontal bar, height 6px, with `--color-primary-lighter` background.
- Two marker dots on the bar at proportional positions (not to literal scale -- just first-third and two-thirds as visual anchors).
- First marker: labeled with `timeToEffect` (e.g., "~3 months -- initial effect").
- Second marker: labeled with `peakEffect` (e.g., "~12 months -- peak effect").
- Bar ends with an arrowhead if `maintenanceRequired` is true (indicating ongoing use).

**Text details below the bar:**
- "Maintenance required: Yes/No" -- If yes, use `font-weight: 600`, `color: --color-primary`. If no, use standard weight.
- "If stopped: {discontinuationEffect}" -- In standard body text.

**Conditional rendering:** If all four timeline fields are absent, this subsection does not render. If only some fields are present, render what is available.

#### C.4 Efficacy Summary Visual (Optional Enhancement)

If `efficacy.keyTrials` contains trials with `responderRate` data, render a simple horizontal bar chart showing responder rates across trials.

```
Responder Rates
Kaufman 1998    [████████████████████████████████████████████] 83%
Whiting 2003    [██████████████████████████████████████████████] 86%
```

**Bar styling:**
- Bar background: `--color-border` (light gray).
- Bar fill: `--color-primary`.
- Bar height: 20px, border-radius: 4px.
- Rate label at the right end of the filled portion.
- Study name label to the left.

**Conditional rendering:** Only render if at least one trial has a `responderRate`. Otherwise, omit entirely.

---

### Section D: Side Effects Section

**Purpose:** Present the safety profile in a structured, scannable format. This answers "What are the risks? Who should not take this?"

**Conditional rendering:** This entire section renders only if the `sideEffects` object exists on the treatment data. If absent, skip to Section E.

**Layout:**

```
+------------------------------------------------------------------+
|  Side Effects & Safety                                            |
|  ---------------------                                            |
|                                                                    |
|  [!] BLACK BOX WARNING (if applicable)                            |
|  FDA black box warning text here in a red-bordered callout.       |
|                                                                    |
|  COMMON SIDE EFFECTS                                              |
|  +---------------------+---------+-----------------------------+  |
|  | Side Effect         | Rate    | Notes                       |  |
|  +---------------------+---------+-----------------------------+  |
|  | Sexual dysfunction  | 1.8%    | Reversible on discontin...  |  |
|  | Decreased libido    | 1.3%    | vs 0.4% placebo             |  |
|  | Breast tenderness   | 0.4%    | Rare                        |  |
|  +---------------------+---------+-----------------------------+  |
|  Discontinuation rate due to AEs: 1.2%                            |
|                                                                    |
|  SERIOUS ADVERSE EVENTS                                           |
|  - Post-finasteride syndrome (debated, no established rate)       |
|  - Depression (signal in some studies, not confirmed causal)      |
|                                                                    |
|  CONTRAINDICATIONS                                                |
|  - Pregnancy / women who may become pregnant                      |
|  - Liver disease (metabolized hepatically)                        |
|                                                                    |
|  DRUG INTERACTIONS                                                |
|  - No significant known drug interactions                         |
|                                                                    |
|  SPECIAL POPULATIONS                                              |
|  +--[Pregnancy]--+--[Women]--+--[Children]--+                    |
|  | Category X.   | Off-label | Not studied  |                    |
|  | Contraindic.  | data for  | in children  |                    |
|  |               | female AGA| <18          |                    |
|  +---------------+-----------+--------------+                    |
|                                                                    |
+------------------------------------------------------------------+
```

#### D.1 Section Header

- `h3`: "Side Effects & Safety"

#### D.2 Black Box Warning (Conditional)

**Data source:** `sideEffects.blackBoxWarning`

**Render condition:** Only if `blackBoxWarning` is a non-empty string.

**Design:**
- A prominent callout box at the top of the section.
- Background: `#FEE2E2` (red-50).
- Border: `2px solid #EF4444` (red-500).
- Border-radius: `var(--radius)`.
- Icon: A warning triangle (Lucide `alert-triangle`) in `#DC2626` (red-600), left of the text.
- Header: "FDA BLACK BOX WARNING" in `font-size: 0.75rem`, `font-weight: 700`, `letter-spacing: 0.05em`, `color: #991B1B`.
- Body text: The warning text in `font-size: 0.875rem`, `color: #991B1B`, `line-height: 1.6`.
- Padding: `var(--space-4) var(--space-5)`.

#### D.3 Common Adverse Events

**Data source:** `sideEffects.commonAEs` array.

**Render condition:** Only if `commonAEs` exists and has at least one item.

**Layout:** A clean table with three columns.

| Column | Data field | Notes |
|--------|-----------|-------|
| Side Effect | `name` | `font-weight: 500` |
| Rate | `rate` | `font-weight: 600`, `color: --color-text`. If the rate string contains a `%` value above 10%, use `color: #9A3412` (amber) for visual emphasis. |
| Notes | `notes` | `font-size: 0.8125rem`, `color: --color-text-secondary`. Optional -- column hidden if no items have notes. |

**Table styling:** Same base styles as the trials table. Compact: `padding: var(--space-2) var(--space-3)`.

**Discontinuation rate:** Below the table, as a standalone line:
- "Discontinuation rate due to side effects: {discontinuationRate}"
- `font-size: 0.875rem`, `color: --color-text-secondary`.
- Only render if `discontinuationRate` is present.

#### D.4 Serious Adverse Events

**Data source:** `sideEffects.seriousAEs` array.

**Render condition:** Only if `seriousAEs` exists and has at least one item.

**Design:**
- Subheading: "Serious Adverse Events" in `font-size: 0.875rem`, `font-weight: 600`, `text-transform: uppercase`, `color: #9A3412`.
- Rendered as a bulleted list.
- Each item is a string displayed in `font-size: 0.875rem`.
- The entire block has a left border: `3px solid #F59E0B` (amber-500) with `padding-left: var(--space-4)` as a visual caution signal.

#### D.5 Contraindications

**Data source:** `sideEffects.contraindications` array.

**Render condition:** Only if `contraindications` exists and has at least one item.

**Design:**
- Subheading: "Contraindications" in the standard subsection style (`font-size: 0.875rem`, `font-weight: 600`, uppercase, `color: --color-primary`).
- Rendered as a bulleted list.
- Each item uses a red-tinted bullet (or a Lucide `x-circle` icon in `#DC2626` before each item).

#### D.6 Drug Interactions

**Data source:** `sideEffects.drugInteractions` array.

**Render condition:** Only if `drugInteractions` exists and has at least one item.

**Design:**
- Subheading: "Drug Interactions"
- Rendered as a bulleted list, same styling as contraindications but with standard (non-red) bullets.

#### D.7 Special Populations Callout

**Data source:** `sideEffects.specialPopulations` object.

**Render condition:** Only if `specialPopulations` exists and at least one of its sub-fields (`pregnancy`, `women`, `children`) is present.

**Design:** A horizontal row of 2-3 cards (depending on which sub-fields exist).

Each card:
- Background: `var(--color-bg-alt)`.
- Border: `1px solid var(--color-border)`.
- Border-radius: `var(--radius)`.
- Padding: `var(--space-3) var(--space-4)`.
- Header: The population label ("Pregnancy", "Women", "Children") in `font-size: 0.75rem`, `font-weight: 600`, uppercase, `color: --color-primary`.
- Body: The description text in `font-size: 0.8125rem`, `color: --color-text`.

**Layout:**
- Desktop: Horizontal row, equal-width cards with `gap: var(--space-3)`.
- Mobile: Vertical stack.

---

### Section E: Evidence Claims

**Purpose:** Present the existing claim-by-claim evidence breakdown. This section already exists in the current implementation; this spec describes enhancements.

**Data source:** `claims` array (required), `evidenceLevelCounts` (required).

**Layout:**

```
+------------------------------------------------------------------+
|  Evidence Claims (12 claims evaluated)                            |
|  ----------------------------------                               |
|                                                                    |
|  [Evidence Heatmap Bar -- existing component]                     |
|                                                                    |
|  [Expand All]  [Filter: All | In vitro | In vivo | RCT | ...]   |
|                                                                    |
|  [Claim Card 1 -- existing component]                             |
|  [Claim Card 2 -- existing component]                             |
|  ...                                                              |
+------------------------------------------------------------------+
```

#### E.1 Section Header

- `h3`: "Evidence Claims"
- Inline count: "({totalClaimsEvaluated} claims evaluated)" in `--color-text-secondary`.

#### E.2 Evidence Heatmap Bar

Reuses the existing `EvidenceHeatmapBar` component exactly as specified in DESIGN_SPEC.md Section 2.7. No changes.

#### E.3 Claims Controls (Enhanced)

In addition to the existing "Expand All / Collapse All" toggle, add an evidence-level filter:

**Filter pills:** A row of small pills that filter claims by evidence level.

```
[All] [In silico (2)] [In vitro (3)] [In vivo (0)] [Ex vivo (1)] [Open-label (2)] [RCT (4)]
```

- Each pill shows the count from `evidenceLevelCounts`.
- Levels with 0 claims are displayed as disabled/greyed pills.
- Clicking a pill filters the claims list to show only claims at that evidence level.
- "All" shows all claims (active by default).
- Uses the same `.filter-pill` component as the comparison table category filter.
- The pill background color matches the evidence level color when active (e.g., active "RCT" pill uses `--ev-rct-bg` background, `--ev-rct-text` color).

#### E.4 Claim Cards

Reuses the existing `ClaimCard` component exactly as specified in DESIGN_SPEC.md Section 2.5. No changes to the card structure.

**Enhancement:** When a claim-level filter is active, claims that do not match are hidden with `display: none` and a smooth height collapse animation (matching the comparison table row filter from DESIGN_SPEC.md Section 4.2).

---

### Section F: Missing Evidence

**Purpose:** Highlight gaps in the evidence base. Helps establish editorial credibility and sets realistic expectations.

**Data source:** `missingEvidence` array (required).

**Layout:** Reuses the existing `.missing-evidence` component exactly. No changes.

```
+------------------------------------------------------------------+
|  [light background card]                                          |
|                                                                    |
|  The Evidence That's Missing                                      |
|                                                                    |
|  - A placebo-controlled human trial of topical GHK-Cu alone...   |
|  - Direct evidence of Wnt/beta-catenin activation in hair...     |
|  - Proof that topically applied GHK-Cu reaches the follicle...   |
|                                                                    |
+------------------------------------------------------------------+
```

---

### Section G: Bottom Line

**Purpose:** The editorial verdict. The single most important section for a reader who scrolls to the end.

**Data source:** `bottomLine` object (required: `summary`, `keyTakeaway`, `verdict`).

**Layout:**

```
+==================================================================+
||                                                                  ||
||  The Bottom Line                                                 ||
||                                                                  ||
||  Verdict: "Gold standard treatment" [badge]                      ||
||                                                                  ||
||  [Summary paragraphs]                                            ||
||                                                                  ||
||  +------------------------------------------------------------+ ||
||  | KEY TAKEAWAY                                                | ||
||  | It has the right mechanistic profile and early clinical     | ||
||  | signals to suggest it helps, but it hasn't been             | ||
||  | definitively proven in the way minoxidil and finasteride... | ||
||  +------------------------------------------------------------+ ||
||                                                                  ||
||  [Read full evidence breakdown]  [View studies on PubMed ->]    ||
||                                                                  ||
+==================================================================+
```

**Elements:**

1. **Verdict badge** -- The `bottomLine.verdict` text displayed prominently at the top of the section.
   - Rendered as an inline badge: `font-size: 0.875rem`, `font-weight: 600`, `padding: var(--space-2) var(--space-4)`, `border-radius: 100px`.
   - Background color derived from the evidence grade: uses the grade color mapping (A = green tones, C = amber tones, F = red tones).
   - Positioned below the "The Bottom Line" heading.

2. **Summary text** -- `bottomLine.summary` rendered as body paragraphs. Uses `white-space: pre-line` to preserve paragraph breaks in the JSON string.

3. **Key takeaway** -- Reuses the existing `.bl-takeaway` component (left-bordered highlight box). No changes.

4. **Explore More CTA** -- Reuses the existing `.explore-more` component with primary and secondary buttons. If `articleUrl` is empty or absent, the primary button shows "Full article coming soon" in a disabled state.

**Section styling:** Reuses the existing `.bottom-line` component (2px primary-colored border, `var(--radius)` border-radius, generous padding).

---

### Section H: Navigation Footer

**Purpose:** Let readers easily move to the next/previous treatment or return to the comparison table without scrolling back up.

**Layout:**

```
+------------------------------------------------------------------+
|                                                                    |
|  +---------------------------+  +------+  +----------------------------+
|  | < Previous                |  | Back |  |                   Next > |
|  | Minoxidil                 |  |  to  |  | Dutasteride              |
|  | FDA-Approved  Grade: A    |  | table|  | Off-Label   Grade: B     |
|  +---------------------------+  +------+  +----------------------------+
|                                                                    |
+------------------------------------------------------------------+
```

**Elements:**

1. **Previous treatment card** -- Left side. Shows:
   - "Previous" label in `font-size: 0.75rem`, uppercase, `--color-text-secondary`.
   - Treatment name in `font-weight: 600`, `font-size: 1rem`.
   - Category badge and grade badge inline, small.
   - Left-arrow icon.
   - Entire card is clickable; navigates to that treatment's detail view.

2. **Back to table button** -- Center. A compact button: "Back to comparison table" with an up-arrow icon. Scrolls to the comparison matrix.

3. **Next treatment card** -- Right side. Same structure as the previous card, but with "Next" label and right-arrow icon.

**Styling:**
- Each nav card: `border: 1px solid var(--color-border)`, `border-radius: var(--radius)`, `padding: var(--space-3) var(--space-4)`, `cursor: pointer`.
- Hover: subtle shadow lift (same as claim cards).
- Desktop: three-column layout with the center button narrower.
- Mobile: The center button moves above the prev/next cards. Prev and next stack vertically (full width each).

---

## 5. Visual Design

### 5.1 New CSS Classes

The detail view introduces these new CSS classes (all other styles reuse existing classes from DESIGN_SPEC.md):

```css
/* Detail view navigation */
.detail-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.detail-nav-back {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary-light);
  background: none;
  border: none;
  cursor: pointer;
}
.detail-nav-back:hover { text-decoration: underline; }
.detail-nav-back svg { width: 16px; height: 16px; }
.detail-nav-arrows {
  display: flex;
  gap: var(--space-2);
}
.detail-nav-arrow {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: none;
  cursor: pointer;
  transition: all 0.15s;
}
.detail-nav-arrow:hover {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
  background: var(--color-bg-alt);
}
.detail-nav-arrow svg { width: 14px; height: 14px; }

/* Header enhancements */
.detail-header-badges {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.detail-header-meta {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-top: var(--space-2);
}

/* Efficacy section */
.efficacy-section { margin-bottom: var(--space-8); }
.efficacy-section h3 { margin-bottom: var(--space-5); }

.trials-table {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-bg);
  margin-bottom: var(--space-6);
}
.trials-table thead { background: var(--color-bg-alt); }
.trials-table th {
  padding: var(--space-2) var(--space-3);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  text-align: left;
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}
.trials-table td {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}
.trials-table .trial-name { font-weight: 600; }
.trials-table .trial-result { font-weight: 600; color: var(--color-primary); }
.trials-table .trial-pvalue {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
.trials-table .trial-responder {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
.trial-empty {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-style: italic;
}

/* Efficacy timeline */
.efficacy-timeline { margin-bottom: var(--space-6); }
.timeline-bar-container { position: relative; margin: var(--space-4) 0 var(--space-6); }
.timeline-bar {
  height: 6px;
  background: var(--color-primary-lighter);
  border-radius: 3px;
  position: relative;
}
.timeline-marker {
  position: absolute;
  top: -5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 2px var(--color-primary);
}
.timeline-marker-label {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  text-align: center;
}
.timeline-marker-label strong {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-text);
  font-weight: 600;
}
.timeline-arrow {
  position: absolute;
  right: -8px;
  top: -3px;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid var(--color-primary-lighter);
}
.timeline-details {
  font-size: 0.875rem;
  line-height: 1.7;
  margin-top: var(--space-8);
}
.timeline-details dt {
  font-weight: 600;
  color: var(--color-primary);
  display: inline;
}
.timeline-details dd {
  display: inline;
  margin-left: var(--space-1);
  margin-bottom: var(--space-2);
}

/* Responder rate bars */
.responder-chart { margin-top: var(--space-4); }
.responder-chart h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.responder-bar-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}
.responder-bar-label {
  flex-shrink: 0;
  width: 140px;
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  text-align: right;
}
.responder-bar-track {
  flex: 1;
  height: 20px;
  background: var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}
.responder-bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  transition: width 0.5s ease;
}
.responder-bar-value {
  flex-shrink: 0;
  width: 40px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text);
}

/* Side effects section */
.side-effects-section { margin-bottom: var(--space-8); }
.side-effects-section h3 { margin-bottom: var(--space-5); }

.black-box-warning {
  background: #FEE2E2;
  border: 2px solid #EF4444;
  border-radius: var(--radius);
  padding: var(--space-4) var(--space-5);
  margin-bottom: var(--space-6);
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
}
.black-box-warning svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #DC2626;
  margin-top: 2px;
}
.black-box-warning-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #991B1B;
  text-transform: uppercase;
  margin-bottom: var(--space-1);
}
.black-box-warning-text {
  font-size: 0.875rem;
  color: #991B1B;
  line-height: 1.6;
}

.ae-table {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-bg);
  margin-bottom: var(--space-3);
}
.ae-table thead { background: var(--color-bg-alt); }
.ae-table th {
  padding: var(--space-2) var(--space-3);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  text-align: left;
  border-bottom: 2px solid var(--color-border);
}
.ae-table td {
  padding: var(--space-2) var(--space-3);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}
.ae-name { font-weight: 500; }
.ae-rate { font-weight: 600; }
.ae-rate-high { color: #9A3412; }
.ae-notes {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}
.discontinuation-note {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-5);
}

.serious-aes {
  border-left: 3px solid #F59E0B;
  padding-left: var(--space-4);
  margin-bottom: var(--space-5);
}
.serious-aes-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #9A3412;
  margin-bottom: var(--space-2);
}
.serious-aes ul { padding-left: var(--space-5); }
.serious-aes li {
  font-size: 0.875rem;
  line-height: 1.7;
  margin-bottom: var(--space-1);
}

.contraindications, .drug-interactions {
  margin-bottom: var(--space-5);
}
.subsection-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}
.contraindications ul, .drug-interactions ul {
  padding-left: var(--space-5);
}
.contraindications li, .drug-interactions li {
  font-size: 0.875rem;
  line-height: 1.7;
  margin-bottom: var(--space-1);
}

.special-populations {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.special-pop-card {
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
}
.special-pop-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}
.special-pop-card-text {
  font-size: 0.8125rem;
  color: var(--color-text);
  line-height: 1.5;
}

@media (max-width: 767px) {
  .special-populations { grid-template-columns: 1fr; }
}

/* Claims filter pills */
.claims-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.claims-filter .filter-pill {
  font-size: 0.75rem;
  padding: var(--space-1) var(--space-3);
  min-height: 28px;
}
.claims-filter .filter-pill.disabled {
  opacity: 0.4;
  cursor: default;
  pointer-events: none;
}

/* Navigation footer */
.detail-nav-footer {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-4);
  align-items: stretch;
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-8);
}
.nav-footer-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.nav-footer-card:hover {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  border-color: var(--color-primary-light);
}
.nav-footer-card-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}
.nav-footer-card-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}
.nav-footer-card-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.nav-footer-card.next { text-align: right; }
.nav-footer-card.next .nav-footer-card-meta { justify-content: flex-end; }
.nav-footer-center {
  display: flex;
  align-items: center;
}
.nav-footer-center button {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary-light);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-footer-center button:hover {
  background: var(--color-bg-alt);
  border-color: var(--color-primary-light);
}

@media (max-width: 767px) {
  .detail-nav-footer {
    grid-template-columns: 1fr;
  }
  .detail-nav-footer .nav-footer-center { order: -1; justify-content: center; }
  .nav-footer-card.next { text-align: left; }
  .nav-footer-card.next .nav-footer-card-meta { justify-content: flex-start; }
}
```

### 5.2 Color Additions

No new color tokens are introduced. All colors come from the existing palette in DESIGN_SPEC.md Section 5.2, plus the following standard Tailwind-ish values already used for warnings:

| Usage | Hex | Context |
|-------|-----|---------|
| `#FEE2E2` | Red-50 | Black box warning background |
| `#EF4444` | Red-500 | Black box warning border |
| `#DC2626` | Red-600 | Black box warning icon |
| `#991B1B` | Red-900 | Black box warning text |
| `#F59E0B` | Amber-500 | Serious AE left border |
| `#EDE9FE` | Violet-50 | Meta-analysis badge background |
| `#5B21B6` | Violet-800 | Meta-analysis badge text |
| `#F3F4F6` | Gray-100 | Retrospective/case-series badge background |
| `#4B5563` | Gray-600 | Retrospective/case-series badge text |

### 5.3 Typography

All typography follows the existing scale from DESIGN_SPEC.md Section 5.3. No new font sizes or weights are introduced.

### 5.4 Section Dividers

Each major section (A through H) is visually separated by `margin-bottom: var(--space-8)` on the preceding section. No explicit horizontal rules between sections -- whitespace provides the separation.

Exception: The navigation footer (Section H) has a `border-top: 1px solid var(--color-border)` and `padding-top: var(--space-8)` to create a clear visual boundary at the bottom of the content.

---

## 6. Responsive Behavior

### 6.1 Breakpoints

Uses the same breakpoints from DESIGN_SPEC.md Section 8.1:

| Name | Min-width |
|------|-----------|
| mobile | 0px |
| tablet | 768px |
| desktop | 1024px |
| wide | 1280px |

### 6.2 Section-Specific Responsive Rules

#### Header (Section A)
- Desktop: Treatment name at 1.375rem. Badges and meta info on separate lines.
- Mobile: Treatment name at 1.125rem. All other elements stack vertically.

#### Quick Stats Bar (Section B)
- Desktop: 4-column grid.
- Tablet: 2x2 grid.
- Mobile: Single column stack.
(Reuses existing `.quick-stats` responsive rules.)

#### Efficacy Trials Table (Section C)
- Desktop: Full table with all columns.
- Tablet: Population column hidden. Horizontal scroll enabled.
- Mobile: Table transforms into a card-per-trial layout:

```
+------------------------------------------+
| Kaufman 1998              [RCT]          |
| N: 1,553 | Duration: 24 months           |
| Population: Men with AGA Norwood III-V   |
|                                          |
| Endpoint: Hair count change              |
| Result: +11% vs placebo                  |
| p < 0.001 | Responders: 83%              |
+------------------------------------------+
```

Each trial card has the same border, border-radius, and padding as the existing mobile comparison cards.

#### Efficacy Timeline (Section C)
- Desktop: Horizontal bar with inline labels.
- Mobile: The timeline bar remains horizontal but labels stack below each marker vertically instead of side-by-side. The text details below the bar render as a simple list.

#### Side Effects Table (Section D)
- Desktop/Tablet: Full table.
- Mobile: Each AE becomes a simple row: "Name -- Rate" with notes on the next line.

#### Special Populations Cards (Section D)
- Desktop: 3-column grid (or 2-column if only 2 populations present).
- Mobile: Single column stack.

#### Navigation Footer (Section H)
- Desktop: 3-column grid (prev | back | next).
- Mobile: Single column. "Back to table" button on top, then prev card, then next card.

---

## 7. Interaction Design

### 7.1 Section Anchoring

Each section within the detail view has an `id` attribute for deep linking:

| Section | `id` |
|---------|------|
| Header | `{slug}-header` |
| Quick Stats | `{slug}-stats` |
| Efficacy | `{slug}-efficacy` |
| Side Effects | `{slug}-side-effects` |
| Claims | `{slug}-claims` |
| Missing Evidence | `{slug}-missing` |
| Bottom Line | `{slug}-bottom-line` |

These IDs support the `&section=` deep link parameter.

### 7.2 Claims Filtering

When a user clicks an evidence-level filter pill in Section E:

1. All claim cards that do not match the selected level get `display: none` applied.
2. The transition uses the same 200ms height collapse animation as the comparison table row filter.
3. The count next to the section header updates to show the filtered count: "Evidence Claims (4 of 12 shown)".
4. Clicking "All" restores all claims.
5. The selected filter state does NOT persist in the URL hash (it is session-only).

### 7.3 Prev/Next Navigation

When a user clicks a prev/next arrow:

1. The detail view panel fades out (150ms).
2. The tab bar updates to reflect the new active treatment.
3. The URL hash updates.
4. The new treatment's detail view fades in (150ms).
5. The viewport scroll position is adjusted to the top of the detail panel (not the top of the page).

### 7.4 Tooltip on Responder Rate

If a trial in the key trials table has a `responderDefinition`, hovering over the responder rate value shows a tooltip with the definition text. Uses a simple title attribute or a lightweight CSS tooltip (same pattern as evidence badge tooltips from DESIGN_SPEC.md Section 4.3).

### 7.5 Print Behavior

In `@media print`:
- All sections render regardless of whether `efficacy`/`sideEffects` data exists (empty sections simply do not appear because they are conditionally rendered, not hidden).
- The navigation elements (Section H, back button, prev/next arrows) are hidden.
- The efficacy trials table prints in full.
- The responder bar chart prints as text-only (study name + percentage) since colored bars may not print well.
- The black box warning prints with a visible border (black, 2px) and bold text.

---

## 8. Data Requirements

### 8.1 Schema Fields Used

The detail view reads from these `schema.json` fields:

**Required fields (always present, detail view depends on them):**
- `id`, `name`, `fullName`
- `category`, `categoryLabel`
- `evidenceGrade`, `evidenceGradeRationale`
- `highestEvidenceLevel`
- `totalClaimsEvaluated`, `humanTrialCount`
- `evidenceLevelCounts`
- `oneLinerSummary`
- `strengthOfEvidenceForHair`
- `mechanismOfAction`
- `claims` (array)
- `missingEvidence` (array)
- `bottomLine` (object)

**Optional fields (used if present, gracefully omitted if absent):**
- `approvalStatus`, `approvalNote`
- `routeOfAdministration`, `typicalDose`
- `aliases`, `bestFor`
- `articleUrl`, `pubmedSearchUrl`
- `efficacy` (object -- new, controls Section C visibility)
- `sideEffects` (object -- new, controls Section D visibility)

### 8.2 Graceful Degradation

The detail view MUST render correctly in all of these data scenarios:

1. **Full data** -- All fields including `efficacy` and `sideEffects` are populated. All sections render.
2. **No efficacy data** -- `efficacy` field is absent. Sections A, B, D, E, F, G, H render. Section C is skipped entirely (no heading, no empty state message for the section itself).
3. **No side effects data** -- `sideEffects` field is absent. Sections A, B, C, E, F, G, H render. Section D is skipped.
4. **Neither efficacy nor side effects** -- This is the current state for all 15 treatments. The detail view renders identically to the existing `TreatmentDetailPanel` described in DESIGN_SPEC.md, just with the new navigation (Section H) and the enhanced claims filter (Section E.3) added.
5. **Partial efficacy data** -- `efficacy` object exists but only some sub-fields are populated (e.g., `keyTrials` exists but `timeToEffect` is absent). Each sub-component within Section C renders independently; absent sub-fields are simply not shown.
6. **Partial side effects data** -- Same principle. Each sub-component within Section D renders independently.

### 8.3 Content Agent Instructions

When populating the new `efficacy` and `sideEffects` fields, content agents should follow these guidelines:

**For `efficacy.keyTrials`:**
- Include the 3-6 most important trials. Do not list every study -- pick the ones that a clinician would cite first.
- `name` should be recognizable: "Kaufman 1998" or "PROPECIA Phase III" or "Olsen 2002".
- `n` is the intent-to-treat population where possible.
- `result` should state the primary outcome quantitatively ("+15.8 hairs/cm^2 vs placebo") rather than qualitatively ("significant improvement").
- `pValue` should be the exact reported value (e.g., "p < 0.001", "p = 0.032").
- `responderRate` and `responderDefinition` are only needed if the trial reported these.

**For `sideEffects.commonAEs`:**
- List AEs with incidence >= 1% in clinical trials, plus any AEs commonly discussed in patient communities even if the rate is lower.
- `rate` should cite the clinical trial rate where available, or qualitative descriptors ("Rare", "Common") if no precise rate exists.
- `notes` is optional but valuable for context (e.g., "vs 0.4% placebo", "reversible on discontinuation").

**For `sideEffects.seriousAEs`:**
- Include any serious adverse event that has been reported in the literature or regulatory submissions, even if causality is debated.
- The string should include a note on the strength of the causal evidence (e.g., "Post-finasteride syndrome -- debated, no established incidence rate").

**For `sideEffects.specialPopulations`:**
- Use clear, direct language. "Category X -- absolutely contraindicated" rather than "Should be used with caution."
- If no data exists for a population, omit the field rather than writing "No data."

---

## 9. Accessibility

### 9.1 Semantic HTML

```html
<article class="treatment-detail" aria-labelledby="{slug}-title" id="panel-{slug}">
  <nav class="detail-nav" aria-label="Treatment navigation">
    <button class="detail-nav-back">...</button>
    <div class="detail-nav-arrows" role="group" aria-label="Previous and next treatment">
      <button class="detail-nav-arrow prev" aria-label="Previous treatment: {name}">...</button>
      <button class="detail-nav-arrow next" aria-label="Next treatment: {name}">...</button>
    </div>
  </nav>

  <header class="detail-header">
    <h4 id="{slug}-title">{name}</h4>
    ...
  </header>

  <section class="efficacy-section" aria-labelledby="{slug}-efficacy-heading">
    <h3 id="{slug}-efficacy-heading">Efficacy</h3>
    <table class="trials-table" aria-label="Key clinical trials for {name}">
      <caption class="sr-only">Key clinical trial results for {name}</caption>
      ...
    </table>
    ...
  </section>

  <section class="side-effects-section" aria-labelledby="{slug}-se-heading">
    <h3 id="{slug}-se-heading">Side Effects &amp; Safety</h3>
    <div class="black-box-warning" role="alert">...</div>
    <table class="ae-table" aria-label="Common adverse events for {name}">
      <caption class="sr-only">Common adverse events for {name}</caption>
      ...
    </table>
    ...
  </section>

  <!-- Claims section uses existing semantic structure from DESIGN_SPEC.md -->
  ...

  <nav class="detail-nav-footer" aria-label="Treatment navigation">...</nav>
</article>
```

### 9.2 Keyboard Navigation

- All interactive elements (buttons, table rows, filter pills) are keyboard-focusable.
- Tab order follows the visual order: back button, prev/next arrows, then down through sections.
- Claims filter pills are navigable with arrow keys (same pattern as the comparison table category filter).
- Prev/next navigation buttons have clear `aria-label` attributes that include the target treatment name.

### 9.3 Screen Reader Considerations

- The trials table and AE table use `<caption>` elements (visually hidden with `.sr-only` if desired).
- The black box warning uses `role="alert"` so screen readers announce it immediately.
- Evidence grade badges include `aria-label="Evidence grade: A"` (not just the letter).
- Strength dots include `aria-label="Strength of evidence: 4 out of 5"`.

### 9.4 Color Independence

- All color-coded elements (grade badges, evidence badges, design badges, AE rate highlighting) have text labels that convey the same information without color.
- The black box warning has both the red border AND the "FDA BLACK BOX WARNING" text label.
- Responder rate bars show the numeric percentage as text, not just via bar width.

---

*End of detail view design specification.*
