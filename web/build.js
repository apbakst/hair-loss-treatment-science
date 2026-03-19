const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');

// Dynamically read ALL data.json files from content directories
const treatments = [];
const dirs = fs.readdirSync(contentDir).filter(d => {
  const full = path.join(contentDir, d);
  return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'data.json'));
});

dirs.forEach(slug => {
  const raw = JSON.parse(fs.readFileSync(path.join(contentDir, slug, 'data.json'), 'utf8'));
  const t = normalizeData(raw, slug);
  treatments.push(t);
});

function normalizeData(raw, slug) {
  // Standard schema files
  if (raw.claims && raw.claims.length > 0 && typeof raw.claims[0].assessmentSummary === 'string') {
    return raw;
  }

  // Normalize minoxidil
  if (slug === 'minoxidil') {
    const elc = {'in-silico':0,'in-vitro':0,'in-vivo-animal':0,'ex-vivo':0,'human-open-label':0,'human-rct':0};
    const claims = (raw.claims||[]).map(c => {
      let evLevel = 'human-rct';
      if (c.modelType) {
        const mt = c.modelType.toLowerCase();
        if (mt === 'in vitro') evLevel = 'in-vitro';
        else if (mt.includes('in vivo animal')) evLevel = 'in-vivo-animal';
        else if (mt.includes('in vitro') && mt.includes('in vivo')) evLevel = 'in-vivo-animal';
        else if (mt === 'human observational' || mt.includes('open-label') || mt.includes('retrospective')) evLevel = 'human-open-label';
        else if (mt.includes('human rct') || mt === 'human rct') evLevel = 'human-rct';
      }
      elc[evLevel] = (elc[evLevel]||0) + 1;
      const citArray = (c.citations||[]).map(ci => {
        if (typeof ci === 'string') return {authors: ci.split('.')[0], year: parseInt((ci.match(/\d{4}/)||['2000'])[0])};
        return ci;
      });
      return {
        number: c.number, title: c.title || '', evidenceLevel: evLevel,
        evidenceWeight: c.evidenceWeight || 'Moderate',
        model: c.model || '', finding: c.finding || '',
        assessment: c.weightExplanation || c.finding || '',
        assessmentSummary: (c.weightExplanation || c.finding || '').substring(0,200),
        citations: citArray, hairSpecific: true
      };
    });
    const humanTrials = (elc['human-open-label']||0) + (elc['human-rct']||0);
    const me = Array.isArray(raw.missingEvidence) ? raw.missingEvidence : [];
    return {
      id:'minoxidil', name:'Minoxidil', fullName:'Minoxidil (Rogaine / Regaine)',
      aliases:['Rogaine','Regaine'], category:'fda-approved', categoryLabel:'FDA-Approved',
      approvalStatus:'fda-approved', approvalNote:'FDA-approved for androgenetic alopecia (1988). Available as 2% and 5% topical solution/foam.',
      mechanismOfAction: raw.mechanismOfAction || '',
      primaryTargets:['Potassium channels (Kir6/SUR2)','VEGF upregulation','Wnt/beta-catenin','Prostaglandin E2'],
      routeOfAdministration:['topical','oral'], typicalDose:'Topical: 5% solution/foam twice daily. Oral: 0.25-5 mg/day (off-label).',
      evidenceGrade:'A', evidenceGradeRationale:'Multiple large RCTs spanning 35+ years, FDA-approved.',
      highestEvidenceLevel:'human-rct', totalClaimsEvaluated: claims.length, humanTrialCount: humanTrials,
      evidenceLevelCounts: elc,
      oneLinerSummary:'The most widely studied hair growth agent with 35+ years of RCT evidence in both men and women.',
      strengthOfEvidenceForHair:5,
      keyLimitation:'30-40% non-responder rate due to low sulfotransferase; gains reverse on discontinuation.',
      bestFor:'First-line topical treatment for male and female pattern hair loss.',
      claims: claims, missingEvidence: me,
      bottomLine: { summary: typeof raw.bottomLine === 'string' ? raw.bottomLine : '', keyTakeaway: 'The most proven topical hair growth treatment available.', verdict: 'Proven gold standard' },
      articleUrl:'/evidence/minoxidil', pubmedSearchUrl:'https://pubmed.ncbi.nlm.nih.gov/?term=minoxidil+hair+loss',
      lastUpdated:'2026-03-18',
      ...(raw.efficacy ? {efficacy: raw.efficacy} : {}),
      ...(raw.sideEffects ? {sideEffects: raw.sideEffects} : {})
    };
  }

  // Normalize dutasteride
  if (slug === 'dutasteride') {
    const elc = {'in-silico':0,'in-vitro':0,'in-vivo-animal':0,'ex-vivo':0,'human-open-label':0,'human-rct':0};
    const claims = (raw.claims||[]).map(c => {
      let evLevel = 'human-rct';
      const m = (c.model||'').toLowerCase();
      if (m.includes('retrospective') || m.includes('chart review') || m.includes('mixed') || m.includes('pharmacokinetic')) evLevel = 'human-open-label';
      elc[evLevel] = (elc[evLevel]||0) + 1;
      const citStr = typeof c.citation === 'string' ? c.citation : '';
      const citArray = [{authors: citStr.split('.')[0] || 'Unknown', year: parseInt((citStr.match(/\d{4}/)||['2020'])[0])}];
      return {
        number: c.id || 0, title: c.claim || '', evidenceLevel: evLevel,
        evidenceWeight: c.evidenceWeight || 'High',
        model: c.model || '', finding: c.finding || '',
        assessment: c.finding || '', assessmentSummary: (c.finding||'').substring(0,200),
        citations: citArray, hairSpecific: true
      };
    });
    const humanTrials = (elc['human-open-label']||0) + (elc['human-rct']||0);
    const me = Array.isArray(raw.missingEvidence) ? raw.missingEvidence : [];
    return {
      id:'dutasteride', name:'Dutasteride', fullName:'Dutasteride (Avodart)',
      category:'off-label', categoryLabel:'Off-Label', approvalStatus:'off-label',
      approvalNote:'FDA-approved for BPH. Approved for AGA in South Korea, Japan, Taiwan. Off-label elsewhere.',
      mechanismOfAction: raw.mechanism || '',
      primaryTargets:['5-alpha reductase Type I & II','DHT reduction (~90-98%)'],
      routeOfAdministration:['oral','topical','mesotherapy injection'],
      typicalDose:'Oral: 0.5 mg daily. Topical: 0.05% solution.',
      evidenceGrade:'B', evidenceGradeRationale:'Multiple RCTs showing superiority over finasteride.',
      highestEvidenceLevel:'human-rct', totalClaimsEvaluated: claims.length, humanTrialCount: humanTrials,
      evidenceLevelCounts: elc,
      oneLinerSummary:'Most potent 5-alpha reductase inhibitor with RCT evidence of superiority over finasteride.',
      strengthOfEvidenceForHair:4,
      keyLimitation:'4-5 week half-life; not FDA-approved for AGA; limited long-term safety data in young men.',
      bestFor:'Second-line treatment or patients seeking maximum DHT suppression.',
      claims: claims, missingEvidence: me,
      bottomLine: { summary: typeof raw.bottomLine === 'string' ? raw.bottomLine : '', keyTakeaway: 'Probably the most effective single drug for AGA based on RCT evidence.', verdict: 'Proven - strongest DHT suppression' },
      articleUrl:'/evidence/dutasteride', pubmedSearchUrl:'https://pubmed.ncbi.nlm.nih.gov/?term=dutasteride+androgenetic+alopecia',
      lastUpdated:'2026-03-18',
      ...(raw.efficacy ? {efficacy: raw.efficacy} : {}),
      ...(raw.sideEffects ? {sideEffects: raw.sideEffects} : {})
    };
  }

  // Normalize ketoconazole
  if (slug === 'ketoconazole') {
    const elc = {'in-silico':0,'in-vitro':0,'in-vivo-animal':0,'ex-vivo':0,'human-open-label':0,'human-rct':0};
    const claims = (raw.claims||[]).map((c, i) => {
      let evLevel = 'human-rct';
      const m = (c.model||'').toLowerCase();
      if (m === 'in vitro') evLevel = 'in-vitro';
      else if (m.includes('in vitro') && !m.includes('human') && !m.includes('oral')) evLevel = 'in-vitro';
      else if (m.includes('in vivo animal') || m === 'in vivo animal') evLevel = 'in-vivo-animal';
      else if (m.includes('human controlled') || m.includes('human rct')) evLevel = 'human-rct';
      else if (m.includes('human open-label') || m.includes('human randomized trial (open-label)')) evLevel = 'human-open-label';
      else if (m.includes('systematic review') || m.includes('fda')) evLevel = 'human-rct';
      elc[evLevel] = (elc[evLevel]||0) + 1;
      const citArray = (c.citations||[]).map(ci => ({
        authors: ci.authors||'', year: ci.year||2000, title: ci.title||'', journal: ci.journal||'', pmid: ci.pubmedId||ci.pmid||''
      }));
      return {
        number: i+1, title: c.claim || '', evidenceLevel: evLevel,
        evidenceWeight: c.evidenceWeight || 'Moderate',
        model: c.model || '', finding: c.finding || '',
        assessment: c.finding || '', assessmentSummary: (c.finding||'').substring(0,200),
        citations: citArray, hairSpecific: true
      };
    });
    const humanTrials = (elc['human-open-label']||0) + (elc['human-rct']||0);
    return {
      id:'ketoconazole', name:'Ketoconazole', fullName:'Ketoconazole (Nizoral)',
      category:'off-label', categoryLabel:'Off-Label', approvalStatus:'off-label',
      approvalNote:'FDA-approved as antifungal shampoo. Off-label for AGA.',
      mechanismOfAction: raw.primaryMechanism || '',
      primaryTargets:['Malassezia reduction','Androgen receptor binding','Anti-inflammatory'],
      routeOfAdministration:['topical'], typicalDose: raw.dosing || '2% shampoo 2-4x/week.',
      evidenceGrade:'B', evidenceGradeRationale:'RCT evidence for 2% shampoo; systematic reviews support adjunctive use.',
      highestEvidenceLevel:'human-rct', totalClaimsEvaluated: claims.length, humanTrialCount: humanTrials,
      evidenceLevelCounts: elc,
      oneLinerSummary:'Well-tolerated adjunct with antifungal, anti-inflammatory, and potential anti-androgenic properties.',
      strengthOfEvidenceForHair:3,
      keyLimitation:'Anti-androgenic mechanism uncertain for shampoo; best as adjunct, not standalone.',
      bestFor:'Adjunct to finasteride/minoxidil, especially with dandruff.',
      claims: claims,
      missingEvidence:['Large RCT of ketoconazole shampoo monotherapy vs minoxidil 5%','Long-term data beyond 21 months','Dose-response for leave-on vs rinse-off'],
      bottomLine: { summary: raw.verdictSummary || '', keyTakeaway: 'A well-tolerated adjunct. Best used alongside finasteride and minoxidil.', verdict: 'Promising adjunct therapy' },
      articleUrl:'/evidence/ketoconazole', pubmedSearchUrl:'https://pubmed.ncbi.nlm.nih.gov/?term=ketoconazole+androgenetic+alopecia',
      lastUpdated:'2026-03-18',
      ...(raw.efficacy ? {efficacy: raw.efficacy} : {}),
      ...(raw.sideEffects ? {sideEffects: raw.sideEffects} : {})
    };
  }

  // Normalize TDM105
  if (slug === 'tdm105') {
    const claims = [
      {number:1, title:'TDM-105795 is a TRbeta1-selective thyroid hormone receptor agonist for topical hair growth', evidenceLevel:'in-vivo-animal', evidenceWeight:'Moderate', model:'C3H mice (topical application) and preclinical toxicology in rats and minipigs.', finding:'Dose-dependent stimulation of hair growth in mice; induced anagen in telogen-phase follicles.', assessment:'Preclinical data from company press releases, not peer-reviewed. TRbeta1-selective approach is supported by independent research.', assessmentSummary:'Promising preclinical mechanism but compound-specific data is unpublished.', citations:[{authors:'Technoderma Medicines',year:2024,title:'Press release'}], hairSpecific:true},
      {number:2, title:'Phase 2a trial showed +24.3 hairs/cm2 at 16 weeks', evidenceLevel:'human-rct', evidenceWeight:'Moderate', model:'Phase 2a RCT, 71 men with AGA, 16 weeks, 13 US sites.', finding:'High dose: +24.3 hairs/cm2. Placebo: +14.0. Net: +10.3 over placebo.', assessment:'Modest net effect; high placebo response; p-values not disclosed; unpublished.', assessmentSummary:'Modest Phase 2a signal with high placebo response and undisclosed p-values.', citations:[{authors:'Technoderma Medicines',year:2024,title:'Phase 2a results press release'}], hairSpecific:true}
    ];
    return {
      id:'tdm105', name:'TDM-105795', fullName:'TDM-105795 (Topical TRbeta1-Selective Thyromimetic)',
      category:'investigational', categoryLabel:'Investigational', approvalStatus:'investigational',
      approvalNote:'Not approved. Phase 2a completed February 2024.',
      mechanismOfAction: raw.mechanismOfAction || '',
      primaryTargets:['TRbeta1 receptor','Wnt/beta-catenin','Sonic hedgehog'],
      routeOfAdministration:['topical'], typicalDose:'0.02% or 0.0025% once daily (investigational).',
      evidenceGrade:'C', evidenceGradeRationale:'One small Phase 2a trial with modest net effect.',
      highestEvidenceLevel:'human-rct', totalClaimsEvaluated:2, humanTrialCount:1,
      evidenceLevelCounts:{'in-silico':0,'in-vitro':0,'in-vivo-animal':1,'ex-vivo':0,'human-open-label':0,'human-rct':1},
      oneLinerSummary:'First-in-class thyromimetic with Phase 2a data showing modest hair count increases.',
      strengthOfEvidenceForHair:3,
      keyLimitation:'No peer-reviewed publications; p-values not disclosed; high placebo response.',
      bestFor:'Not available - investigational only.',
      claims: claims,
      missingEvidence:['Peer-reviewed publication of any TDM-105795 data','Disclosed p-values and confidence intervals','Phase 2b or 3 trial','Independent research on the compound'],
      bottomLine: { summary:'TDM-105795 is a genuinely novel approach with Phase 2a data.', keyTakeaway:'First-in-class mechanism with Phase 2a data. Promising but very early.', verdict:'Early-stage investigational' },
      articleUrl:'/evidence/tdm105', pubmedSearchUrl:'https://pubmed.ncbi.nlm.nih.gov/?term=thyroid+hormone+receptor+agonist+hair',
      lastUpdated:'2026-03-18',
      ...(raw.efficacy ? {efficacy: raw.efficacy} : {}),
      ...(raw.sideEffects ? {sideEffects: raw.sideEffects} : {})
    };
  }

  return raw;
}

// Sort treatments by category order then by strength
const catOrder = {'fda-approved':0,'off-label':1,'investigational':2,'peptides-cosmeceuticals':3};
// Debug: show categories
treatments.forEach(t => {
  const cval = catOrder[t.category];
  if (cval === undefined) console.log('WARNING: unknown category for', t.id, ':', JSON.stringify(t.category));
});
treatments.sort((a,b) => {
  const ca = (catOrder[a.category] !== undefined) ? catOrder[a.category] : 9;
  const cb = (catOrder[b.category] !== undefined) ? catOrder[b.category] : 9;
  if (ca !== cb) return ca - cb;
  return (b.strengthOfEvidenceForHair||0) - (a.strengthOfEvidenceForHair||0);
});

// Embed into HTML
const json = JSON.stringify(treatments);
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
// Replace the entire TREATMENTS array line
const pattern = /const TREATMENTS = \[.*?\];/s;
if (pattern.test(html)) {
  html = html.replace(pattern, 'const TREATMENTS = ' + json + ';');
} else {
  html = html.replace('PLACEHOLDER_DATA', json);
}
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Done. Embedded ' + treatments.length + ' treatments.');
console.log('Treatments: ' + treatments.map(t => t.id + '(' + t.category + ')').join(', '));
