import wixWindow from 'wix-window';
import wixLocation from 'wix-location';

$w.onReady(function () {

  // ─── DYNAMIC COPYRIGHT YEAR ───────────────────────────────────────────────
  // Targets: #copyrightText (Text element in footer)
  // Section: Footer
  try {
    const year = new Date().getFullYear();
    $w('#copyrightText').text = `© ${year} by Foster Rx LLC. All Rights Reserved.`;
  } catch (e) {
    console.log('copyrightText element not found:', e);
  }

  // ─── STICKY NAV SHADOW ON SCROLL ──────────────────────────────────────────
  // Targets: #siteHeader (Header container)
  // Section: Navigation
  // Note: In Wix, add/remove a CSS class via changeStyleAttribute on scroll
  wixWindow.getBoundingRect().then((rect) => {
    // Wix does not expose native scroll events in Velo directly.
    // Use the workaround: set a fixed box shadow on header after page load.
    // For dynamic scroll shadow, use a custom scroll handler via wix-window.
  });

  // ─── NAV ANCHOR SCROLL HANDLERS ───────────────────────────────────────────
  // Targets: #navProblem, #navOfferings, #navInsights, #navTeam, #navCTA
  // Section: Navigation
  // Each nav link scrolls to its corresponding section anchor on the page.

  const navLinks = [
    { buttonId: '#navProblem',   sectionId: '#sectionProblem'   },
    { buttonId: '#navOfferings', sectionId: '#sectionOfferings' },
    { buttonId: '#navInsights',  sectionId: '#sectionInsights'  },
    { buttonId: '#navTeam',      sectionId: '#sectionTeam'      },
    { buttonId: '#navCTA',       sectionId: '#sectionCTA'       },
  ];

  navLinks.forEach(({ buttonId, sectionId }) => {
    try {
      $w(buttonId).onClick(() => {
        $w(sectionId).scrollTo();
      });
    } catch (e) {
      console.log(`Nav element ${buttonId} not found:`, e);
    }
  });

  // ─── MOBILE NAV HAMBURGER TOGGLE ──────────────────────────────────────────
  // Targets: #mobileMenuButton (icon/button), #mobileNav (container/box)
  // Section: Navigation (mobile)
  // Toggles mobile nav visibility on hamburger click.

  let mobileNavOpen = false;

  try {
    $w('#mobileMenuButton').onClick(() => {
      mobileNavOpen = !mobileNavOpen;
      if (mobileNavOpen) {
        $w('#mobileNav').show('fade', { duration: 200 });
      } else {
        $w('#mobileNav').hide('fade', { duration: 200 });
      }
    });
  } catch (e) {
    console.log('mobileMenuButton element not found:', e);
  }

  // ─── BOOKING CTA BUTTONS (SITE-WIDE) ──────────────────────────────────────
  // Targets: #btnNavCTA (nav bar CTA button)
  // Section: Navigation
  // TODO: Replace BOOKING_URL with your actual Outlook booking link

  const BOOKING_URL = 'https://outlook.office.com/bookwithme/user/fd4f04c623d94128b78993cd23fbead9@fosterrx.com/meetingtype/_0FJELVYr0OZK8BTji-Kzg2?anonymous&ismsaljsauthenabled&ep=mlink';
  const CONTACT_EMAIL = 'mailto:info@fosterrx.com';

  try {
    $w('#btnNavCTA').onClick(() => {
      wixLocation.to(BOOKING_URL);
    });
  } catch (e) {
    console.log('btnNavCTA element not found:', e);
  }

});
