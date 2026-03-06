import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

$w.onReady(function () {

  const BOOKING_URL = 'TODO_REPLACE_WITH_OUTLOOK_BOOKING_URL';
  const CONTACT_EMAIL = 'mailto:info@fosterrx.com';

  // ── HERO CTAs ──────────────────────────────────────────────────────────────
  // #btnHeroPrimary → Section: Hero → "Book a Pilot Conversation"
  // #btnHeroSecondary → Section: Hero → "See How It Works" (scrolls to #sectionHow)

  try {
    $w('#btnHeroPrimary').onClick(() => { wixLocation.to(BOOKING_URL); });
  } catch (e) { console.log('btnHeroPrimary not found:', e); }

  try {
    $w('#btnHeroSecondary').onClick(() => { $w('#sectionHow').scrollTo(); });
  } catch (e) { console.log('btnHeroSecondary not found:', e); }

  // ── CLOSING CTA BANNER ─────────────────────────────────────────────────────
  // #btnCTAPrimary  → "Book a Pilot Conversation"
  // #btnCTASecondary → "info@fosterrx.com"

  try {
    $w('#btnCTAPrimary').onClick(() => { wixLocation.to(BOOKING_URL); });
  } catch (e) { console.log('btnCTAPrimary not found:', e); }

  try {
    $w('#btnCTASecondary').onClick(() => { wixLocation.to(CONTACT_EMAIL); });
  } catch (e) { console.log('btnCTASecondary not found:', e); }

  // ── OFFERING TRACK CTAs ────────────────────────────────────────────────────
  // #btnOfferSponsor  → Track 1: Phase II Sponsors
  // #btnOfferData     → Track 2: Data & AI Teams
  // #btnOfferAcademic → Track 3: Academic & Early-Stage

  try {
    $w('#btnOfferSponsor').onClick(() => { wixLocation.to(BOOKING_URL); });
  } catch (e) { console.log('btnOfferSponsor not found:', e); }

  try {
    $w('#btnOfferData').onClick(() => {
      wixLocation.to(CONTACT_EMAIL + '?subject=Data%20Products%20Inquiry');
    });
  } catch (e) { console.log('btnOfferData not found:', e); }

  try {
    $w('#btnOfferAcademic').onClick(() => {
      wixLocation.to(CONTACT_EMAIL + '?subject=Translational%20Evaluation%20Inquiry');
    });
  } catch (e) { console.log('btnOfferAcademic not found:', e); }

  // ── STAT COUNTER ANIMATION ─────────────────────────────────────────────────
  // Triggers when #sectionProblem enters the viewport
  // #stat1 → counts to 28 (suffix: %)
  // #stat2 → counts to 90 (suffix: %)
  // #stat3 → set directly to ~$2.1M (no count animation)

  let countersRun = false;

  function animateCounter(elementId, end, suffix, prefix, duration) {
    try {
      const el = $w(elementId);
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(end * eased);
        el.text = prefix + current + suffix;
        if (progress < 1) setTimeout(tick, 16);
      };
      tick();
    } catch (e) { console.log(elementId + ' not found:', e); }
  }

  function runCounters() {
    if (countersRun) return;
    countersRun = true;
    animateCounter('#stat1', 28, '%', '', 1400);
    animateCounter('#stat2', 90, '%', '', 1600);
    try { $w('#stat3').text = '~$2.1M'; } catch (e) { console.log('stat3 not found:', e); }
  }

  try {
    $w('#sectionProblem').onViewportEnter(() => { runCounters(); });
  } catch (e) {
    console.log('sectionProblem viewport event not available, running on load');
    runCounters();
  }

  // ── FEATURE CARD HOVER STATES ──────────────────────────────────────────────
  // #featCard1 through #featCard4 → Section: Solution
  // Adds teal border on mouse enter, removes on mouse leave

  ['#featCard1', '#featCard2', '#featCard3', '#featCard4'].forEach((id) => {
    try {
      $w(id).onMouseIn(() => { $w(id).style.borderColor = '#5a8a7d'; });
      $w(id).onMouseOut(() => { $w(id).style.borderColor = 'transparent'; });
    } catch (e) { console.log(id + ' hover not available:', e); }
  });

  // ── INSIGHTS CARD LINKS ───────────────────────────────────────��────────────
  // #insightLink1 → first blog post (update URL when published)
  // #insightLink2 → second blog post (update URL when published)

  try {
    $w('#insightLink1').onClick(() => {
      wixLocation.to('/blog/why-90-percent-of-phase-ii-trials-hit-an-amendment');
    });
  } catch (e) { console.log('insightLink1 not found:', e); }

  try {
    $w('#insightLink2').onClick(() => {
      wixLocation.to('/blog/decision-intelligence-vs-ai');
    });
  } catch (e) { console.log('insightLink2 not found:', e); }
});