<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Foster Rx — Site Blueprint v3</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
  :root{
    --teal-dark:#3d6b61;--teal-mid:#5a8a7d;--teal-light:#8fb8ae;
    --teal-pale:#c8ddd9;--bg-light:#eef1f0;--bg-dark:#1a2e2a;
    --text-dark:#1a2e2a;--text-mid:#3d5a54;--text-muted:#6b8c85;
    --gold:#c9a84c;--radius:12px;
    --shadow:0 4px 24px rgba(61,107,97,.10);
    --shadow-lg:0 12px 48px rgba(61,107,97,.16);
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:#f0f3f2;color:var(--text-dark);}
  .page-wrap{max-width:1280px;margin:0 auto;background:white;box-shadow:0 0 80px rgba(0,0,0,.12);}

  /* ── ANNOTATIONS ── */
  .note{background:#fffbeb;border-left:4px solid var(--gold);padding:13px 48px;font-size:12px;color:#5a4200;line-height:1.65;}
  .note strong{font-weight:700;}
  .sec-label{background:var(--teal-dark);color:white;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:8px 48px;display:block;}

  /* ── TOC ── */
  .toc{background:#f0f7f5;border-bottom:2px solid var(--teal-pale);padding:18px 48px;display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
  .toc-label{font-size:11px;font-weight:700;color:var(--teal-dark);text-transform:uppercase;letter-spacing:.1em;margin-right:6px;}
  .toc-item{background:white;border:1px solid var(--teal-pale);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:500;color:var(--text-mid);text-decoration:none;}

  /* ── NAV ── */
  nav{
    position:sticky;top:0;z-index:100;
    background:rgba(255,255,255,.97);backdrop-filter:blur(10px);
    border-bottom:1px solid var(--teal-pale);
    display:flex;align-items:center;justify-content:space-between;
    padding:0 52px;height:70px;
    box-shadow:0 2px 16px rgba(61,107,97,.06);
  }
  .nav-logo{display:flex;align-items:center;gap:12px;}
  .nav-logo-img{height:36px;width:auto;display:block;}
  .nav-logo-fallback{
    height:36px;background:var(--teal-dark);border-radius:8px;
    display:flex;align-items:center;justify-content:center;
    padding:0 14px;font-weight:700;font-size:15px;color:white;letter-spacing:-.01em;
  }
  .nav-links{display:flex;gap:28px;list-style:none;}
  .nav-links a{text-decoration:none;font-size:14px;font-weight:500;color:var(--text-mid);}
  .nav-cta{background:var(--teal-dark);color:white!important;padding:10px 22px;border-radius:7px;font-size:13px!important;font-weight:600!important;}

  /* ── SVG ICON HELPER ── */
  .icon-box{
    width:46px;height:46px;flex-shrink:0;
    background:var(--teal-dark);border-radius:11px;
    display:flex;align-items:center;justify-content:center;
  }
  .icon-box svg{width:22px;height:22px;stroke:white;fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;}
  .icon-box-light{
    width:46px;height:46px;flex-shrink:0;
    background:var(--teal-pale);border-radius:11px;
    display:flex;align-items:center;justify-content:center;
  }
  .icon-box-light svg{width:22px;height:22px;stroke:var(--teal-dark);fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;}
  .icon-box-ghost{
    width:52px;height:52px;flex-shrink:0;
    background:rgba(143,184,174,.15);border-radius:12px;
    display:flex;align-items:center;justify-content:center;
    margin-bottom:20px;
  }
  .icon-box-ghost svg{width:24px;height:24px;stroke:var(--teal-light);fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;}
  .off-icon-box{
    width:54px;height:54px;flex-shrink:0;
    background:var(--teal-pale);border-radius:13px;
    display:flex;align-items:center;justify-content:center;
    margin-bottom:22px;
  }
  .off-icon-box svg{width:26px;height:26px;stroke:var(--teal-dark);fill:none;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round;}
  .off-card.primary .off-icon-box{background:rgba(143,184,174,.18);}
  .off-card.primary .off-icon-box svg{stroke:var(--teal-light);}

  /* ── HERO ── */
  .hero{
    min-height:94vh;
    background:linear-gradient(148deg,#111e1b 0%,#1a2e2a 50%,#243d38 100%);
    display:flex;align-items:center;
    padding:100px 52px 80px;
    position:relative;overflow:hidden;
  }
  .hero-dots{position:absolute;inset:0;opacity:.035;background-image:radial-gradient(circle at 2px 2px,white 1px,transparent 0);background-size:30px 30px;}
  .hero-orb{position:absolute;right:-60px;top:50%;transform:translateY(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle at center,rgba(90,138,125,.18) 0%,transparent 68%);pointer-events:none;}
  .hero-inner{max-width:780px;position:relative;z-index:2;}
  .hero-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(143,184,174,.12);border:1px solid rgba(143,184,174,.28);border-radius:100px;padding:6px 16px;margin-bottom:30px;}
  .hero-dot{width:7px;height:7px;background:var(--teal-light);border-radius:50%;animation:pulse 2.2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.45;transform:scale(1.35);}}
  .hero-pill-txt{font-size:12px;font-weight:600;color:var(--teal-pale);letter-spacing:.08em;text-transform:uppercase;}
  .hero-h1{font-family:'Playfair Display',serif;font-size:clamp(42px,5.2vw,68px);font-weight:600;line-height:1.1;color:#fff;margin-bottom:26px;letter-spacing:-.02em;}
  .hero-h1 em{font-style:italic;color:var(--teal-light);}
  .hero-sub{font-size:18px;font-weight:400;line-height:1.72;color:rgba(255,255,255,.62);max-width:620px;margin-bottom:44px;}
  .hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:56px;}
  .btn-hero-p{background:#fff;color:var(--teal-dark);padding:14px 28px;border-radius:8px;font-size:15px;font-weight:700;border:none;cursor:pointer;}
  .btn-hero-g{background:transparent;color:rgba(255,255,255,.72);padding:14px 22px;border-radius:8px;font-size:15px;font-weight:500;border:1px solid rgba(255,255,255,.2);cursor:pointer;}
  .hero-trust{display:flex;align-items:center;gap:18px;flex-wrap:wrap;}
  .trust-lbl{font-size:11px;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.1em;font-weight:600;white-space:nowrap;}
  .trust-b{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:5px;padding:5px 12px;font-size:11px;font-weight:600;color:rgba(255,255,255,.45);letter-spacing:.04em;text-transform:uppercase;}

  /* ── PROOF STRIP ── */
  .proof-strip{background:var(--teal-dark);padding:22px 52px;display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;}
  .proof-item{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.72);font-size:13px;font-weight:500;}
  .proof-item svg{width:15px;height:15px;stroke:var(--teal-light);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
  .proof-item strong{color:white;font-weight:700;}
  .proof-sep{width:1px;height:22px;background:rgba(255,255,255,.15);}

  /* ── SHARED LAYOUT ── */
  .container{max-width:1100px;margin:0 auto;}
  .stag{font-size:11px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--teal-mid);margin-bottom:14px;}
  .sh2{font-family:'Playfair Display',serif;font-size:clamp(34px,4vw,54px);font-weight:600;line-height:1.16;color:var(--text-dark);margin-bottom:20px;letter-spacing:-.02em;}
  .s-intro{font-size:17px;line-height:1.78;color:var(--text-mid);max-width:600px;margin-bottom:64px;}

  /* ── PROBLEM ── */
  .problem{background:var(--bg-light);padding:108px 52px;}
  .stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-bottom:52px;}
  .stat-c{background:white;border-radius:14px;padding:36px 32px;box-shadow:var(--shadow);border-top:3px solid var(--teal-mid);position:relative;overflow:hidden;}
  .stat-c::after{content:'';position:absolute;bottom:-24px;right:-24px;width:80px;height:80px;border-radius:50%;background:var(--teal-pale);opacity:.35;}
  .stat-n{font-family:'Playfair Display',serif;font-size:56px;font-weight:700;color:var(--teal-dark);line-height:1;margin-bottom:10px;}
  .stat-l{font-size:14px;font-weight:500;color:var(--text-mid);line-height:1.55;}
  .prob-dark{background:var(--bg-dark);border-radius:18px;padding:52px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:44px;}
  .prob-item h4{font-size:15px;font-weight:700;color:white;margin-bottom:8px;}
  .prob-item p{font-size:14px;line-height:1.68;color:rgba(255,255,255,.52);}

  /* ── SOLUTION ── */
  .solution{background:white;padding:108px 52px;}
  .sol-grid{display:grid;grid-template-columns:1fr 1fr;gap:84px;align-items:start;}
  .sol-image{border-radius:18px;overflow:hidden;box-shadow:var(--shadow-lg);}
  .sol-image img{width:100%;height:100%;object-fit:cover;display:block;}
  .sol-quote{font-size:14px;color:var(--text-muted);line-height:1.72;font-style:italic;border-left:3px solid var(--teal-pale);padding-left:18px;margin-top:32px;}
  .feat-card{background:var(--bg-light);border-radius:14px;padding:24px 26px;margin-bottom:14px;display:flex;gap:18px;align-items:flex-start;border:1px solid transparent;transition:border-color .2s,box-shadow .2s,transform .2s;}
  .feat-card:hover{border-color:var(--teal-mid);box-shadow:var(--shadow);transform:translateX(4px);}
  .feat-card h4{font-size:15px;font-weight:700;color:var(--text-dark);margin-bottom:5px;}
  .feat-card p{font-size:13px;line-height:1.62;color:var(--text-muted);}

  /* ── HOW IT WORKS ── */
  .how{background:var(--bg-light);padding:108px 52px;}
  .how-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;margin-top:64px;}
  .how-img{border-radius:18px;overflow:hidden;box-shadow:var(--shadow-lg);}
  .how-img img{width:100%;display:block;}
  .steps-list{display:flex;flex-direction:column;gap:0;}
  .step-item{display:flex;gap:22px;align-items:flex-start;padding:28px 0;border-bottom:1px solid var(--teal-pale);position:relative;}
  .step-item:last-child{border-bottom:none;}
  .step-num-box{
    width:48px;height:48px;flex-shrink:0;
    background:var(--teal-dark);border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:white;
  }
  .step-item h4{font-size:15px;font-weight:700;color:var(--text-dark);margin-bottom:6px;}
  .step-item p{font-size:13px;line-height:1.65;color:var(--text-muted);}

  /* ── OFFERINGS ── */
  .offerings{background:white;padding:108px 52px;}
  .off-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:64px;}
  .off-card{border-radius:18px;padding:44px 36px;border:1px solid var(--teal-pale);display:flex;flex-direction:column;position:relative;overflow:hidden;transition:box-shadow .25s,transform .25s;}
  .off-card:hover{box-shadow:var(--shadow-lg);transform:translateY(-4px);}
  .off-card.primary{background:var(--bg-dark);border-color:transparent;}
  .off-track{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:18px;color:var(--teal-mid);}
  .off-card.primary .off-track{color:var(--teal-light);}
  .off-h3{font-family:'Playfair Display',serif;font-size:23px;font-weight:600;color:var(--text-dark);margin-bottom:12px;line-height:1.25;}
  .off-card.primary .off-h3{color:white;}
  .off-desc{font-size:14px;line-height:1.72;color:var(--text-mid);margin-bottom:24px;flex:1;}
  .off-card.primary .off-desc{color:rgba(255,255,255,.55);}
  .off-items{list-style:none;margin-bottom:32px;display:flex;flex-direction:column;gap:9px;}
  .off-items li{font-size:13px;color:var(--text-muted);padding-left:18px;position:relative;line-height:1.55;}
  .off-items li::before{content:'→';position:absolute;left:0;color:var(--teal-mid);font-weight:700;font-size:12px;}
  .off-card.primary .off-items li{color:rgba(255,255,255,.5);}
  .off-card.primary .off-items li::before{color:var(--teal-light);}
  .off-cta{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--teal-dark);cursor:pointer;background:none;border:none;text-decoration:none;}
  .off-cta svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  .off-card.primary .off-cta{color:var(--teal-light);}
  .off-wl-badge{position:absolute;top:18px;right:18px;background:rgba(61,107,97,.08);border:1px solid var(--teal-pale);border-radius:20px;padding:4px 10px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--teal-mid);text-transform:uppercase;}

  /* ── TRACTION STRIP ── */
  .traction-strip{background:var(--bg-light);border-top:1px solid var(--teal-pale);border-bottom:1px solid var(--teal-pale);padding:52px;}
  .traction-inner{display:flex;align-items:flex-start;gap:64px;}
  .traction-label-col{flex-shrink:0;width:180px;}
  .traction-label-col .stag{margin-bottom:8px;}
  .traction-label-col p{font-size:13px;color:var(--text-muted);line-height:1.6;}
  .traction-items{display:flex;flex-wrap:wrap;gap:12px;flex:1;}
  .tr-chip{display:inline-flex;align-items:center;gap:9px;background:white;border:1px solid var(--teal-pale);border-radius:8px;padding:11px 16px;font-size:13px;font-weight:500;color:var(--text-mid);}
  .tr-chip svg{width:16px;height:16px;stroke:var(--teal-dark);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
  .tr-chip strong{font-weight:700;color:var(--text-dark);}

  /* ── INSIGHTS ── */
  .insights{background:white;padding:108px 52px;}
  .insights-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:64px;}
  .insight-card{border-radius:16px;overflow:hidden;border:1px solid var(--teal-pale);transition:box-shadow .2s,transform .2s;}
  .insight-card:hover{box-shadow:var(--shadow);transform:translateY(-3px);}
  .insight-img{height:180px;background:linear-gradient(135deg,var(--bg-dark),var(--teal-dark));display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
  .insight-img svg{width:48px;height:48px;stroke:rgba(255,255,255,.2);fill:none;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}
  .insight-img-tag{position:absolute;top:14px;left:14px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;color:rgba(255,255,255,.75);letter-spacing:.06em;text-transform:uppercase;}
  .insight-body{padding:28px;}
  .insight-date{font-size:11px;font-weight:600;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px;}
  .insight-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:var(--text-dark);line-height:1.4;margin-bottom:12px;}
  .insight-excerpt{font-size:13px;line-height:1.68;color:var(--text-muted);margin-bottom:20px;}
  .insight-link{font-size:13px;font-weight:700;color:var(--teal-dark);text-decoration:none;display:inline-flex;align-items:center;gap:6px;}
  .insight-link svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}

  /* ── TEAM ── */
  .team{background:var(--bg-light);padding:108px 52px;}
  .founder-card{background:white;border-radius:22px;padding:56px;display:grid;grid-template-columns:auto 1fr;gap:56px;align-items:start;max-width:900px;margin:56px auto 0;border:1px solid var(--teal-pale);box-shadow:var(--shadow-lg);}
  .founder-photo{width:170px;height:170px;border-radius:16px;overflow:hidden;flex-shrink:0;background:var(--teal-pale);}
  .founder-photo img{width:100%;height:100%;object-fit:cover;}
  .f-name{font-family:'Playfair Display',serif;font-size:32px;font-weight:600;color:var(--text-dark);margin-bottom:4px;}
  .f-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:var(--teal-mid);margin-bottom:22px;}
  .f-bio{font-size:15px;line-height:1.78;color:var(--text-mid);margin-bottom:28px;}
  .f-creds{display:flex;flex-wrap:wrap;gap:8px;}
  .cred{background:var(--bg-light);border:1px solid var(--teal-pale);border-radius:6px;padding:7px 13px;font-size:12px;font-weight:600;color:var(--text-mid);display:inline-flex;align-items:center;gap:7px;}
  .cred svg{width:13px;height:13px;stroke:var(--teal-mid);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0;}
  .logo-row{display:flex;align-items:center;justify-content:center;gap:36px;flex-wrap:wrap;margin-top:56px;padding-top:44px;border-top:1px solid var(--teal-pale);}
  .logo-row span{font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.06em;text-transform:uppercase;opacity:.55;}

  /* ── CTA ── */
  .cta-banner{background:linear-gradient(138deg,#111e1b 0%,#1e3830 100%);padding:90px 52px;text-align:center;position:relative;overflow:hidden;}
  .cta-banner::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 2px 2px,rgba(255,255,255,.025) 1px,transparent 0);background-size:28px 28px;}
  .cta-banner .container{position:relative;z-index:1;}
  .cta-banner h2{font-family:'Playfair Display',serif;font-size:clamp(30px,4vw,50px);font-weight:600;color:white;margin-bottom:16px;letter-spacing:-.02em;}
  .cta-banner p{font-size:17px;color:rgba(255,255,255,.52);margin-bottom:38px;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.68;}
  .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
  .btn-cta-p{background:white;color:var(--teal-dark);padding:15px 30px;border-radius:8px;font-size:15px;font-weight:700;border:none;cursor:pointer;}
  .btn-cta-g{background:transparent;color:rgba(255,255,255,.75);padding:15px 24px;border-radius:8px;font-size:15px;font-weight:500;border:1px solid rgba(255,255,255,.22);cursor:pointer;}

  /* ── FOOTER ── */
  footer{background:#0e1916;padding:64px 52px 36px;}
  .foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:52px;margin-bottom:52px;}
  .foot-brand-name{font-weight:700;font-size:19px;color:rgba(255,255,255,.72);letter-spacing:-.02em;margin-bottom:14px;}
  .foot-brand p{font-size:13px;line-height:1.72;color:rgba(255,255,255,.38);max-width:240px;}
  .foot-socials{display:flex;gap:10px;margin-top:22px;}
  .soc{width:34px;height:34px;background:rgba(255,255,255,.07);border-radius:7px;display:flex;align-items:center;justify-content:center;text-decoration:none;}
  .soc svg{width:16px;height:16px;stroke:rgba(255,255,255,.45);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}
  .foot-col h5{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:rgba(255,255,255,.5);margin-bottom:18px;}
  .foot-col ul{list-style:none;}
  .foot-col li{font-size:13px;margin-bottom:11px;}
  .foot-col a{color:rgba(255,255,255,.4);text-decoration:none;}
  .foot-bottom{border-top:1px solid rgba(255,255,255,.07);padding-top:26px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.28);}

  @media(max-width:800px){
    .stats-row,.prob-dark,.sol-grid,.how-grid,.off-grid,.foot-grid,.insights-grid{grid-template-columns:1fr;}
    .founder-card{grid-template-columns:1fr;text-align:center;}
    .traction-inner{flex-direction:column;gap:28px;}
    nav,section,.hero,.proof-strip,.traction-strip,.cta-banner,footer{padding-left:22px;padding-right:22px;}
  }
</style>
</head>
<body>
<div class="page-wrap">

<!-- TOC -->
<div class="toc">
  <span class="toc-label">Sections</span>
  <a href="#s-nav" class="toc-item">1 Nav</a>
  <a href="#s-hero" class="toc-item">2 Hero</a>
  <a href="#s-proof" class="toc-item">3 Proof Strip</a>
  <a href="#s-problem" class="toc-item">4 Problem</a>
  <a href="#s-solution" class="toc-item">5 Solution</a>
  <a href="#s-how" class="toc-item">6 How It Works</a>
  <a href="#s-offerings" class="toc-item">7 Offerings</a>
  <a href="#s-traction" class="toc-item">8 Traction Strip</a>
  <a href="#s-insights" class="toc-item">9 Insights</a>
  <a href="#s-team" class="toc-item">10 Team</a>
  <a href="#s-cta" class="toc-item">11 CTA</a>
  <a href="#s-footer" class="toc-item">12 Footer</a>
</div>

<!-- ═══ 1. NAV ═══ -->
<div id="s-nav" class="sec-label">SECTION 1 — NAVIGATION</div>
<nav>
  <div class="nav-logo">
    <!-- LOGO: Replace src with your uploaded logo file URL from Wix Media Manager -->
    <img class="nav-logo-img"
      src="https://static.wixstatic.com/media/6b590a_bb882c3bf6174fae87800f80af7ea062~mv2.png"
      alt="Foster Rx"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
    <div class="nav-logo-fallback" style="display:none;">Foster Rx</div>
  </div>
  <ul class="nav-links">
    <li><a href="#s-problem">The Problem</a></li>
    <li><a href="#s-offerings">Offerings</a></li>
    <li><a href="#s-insights">Insights</a></li>
    <li><a href="#s-team">Team</a></li>
    <li><a href="#s-cta" class="nav-cta">Book a Conversation</a></li>
  </ul>
</nav>
<div class="note"><strong>LOGO NOTE:</strong> Upload your logo file in Wix Media Manager → copy the URL → replace the src above. Use the full-color version on white nav. If logo is dark, it will work perfectly on the white nav background. No text next to logo needed if the logo contains the wordmark. For Wix: Settings → Logo → upload file. Ensure "Retina" version uploaded (2x resolution PNG or SVG preferred).</div>

<!-- ═══ 2. HERO ═══ -->
<div id="s-hero" class="sec-label">SECTION 2 — HERO</div>
<section class="hero">
  <div class="hero-dots"></div>
  <div class="hero-orb"></div>
  <div class="hero-inner">
    <div class="hero-pill">
      <div class="hero-dot"></div>
      <span class="hero-pill-txt">Decision Intelligence · Phase II Execution</span>
    </div>
    <h1 class="hero-h1">The decision layer that<br>makes Phase II <em>defensible.</em></h1>
    <p class="hero-sub">90% of Phase II trials require at least one costly amendment. Foster Rx gives sponsors the intelligence infrastructure to surface design vulnerabilities before they happen — and the institutional memory to never repeat them.</p>
    <div class="hero-btns">
      <button class="btn-hero-p">Book a Pilot Conversation →</button>
      <button class="btn-hero-g">See How It Works ↓</button>
    </div>
    <div class="hero-trust">
      <span class="trust-lbl">Expertise from</span>
      <span class="trust-b">Takeda</span>
      <span class="trust-b">MIT</span>
      <span class="trust-b">Gates Foundation</span>
      <span class="trust-b">VA</span>
    </div>
  </div>
</section>
<div class="note"><strong>HERO NOTES:</strong> Full viewport height. Dark green gradient. Serif headline, "defensible" italic teal. Primary CTA → Outlook booking. Ghost CTA → anchor #s-how. Trust badges reduced to 4 — the strongest credentials. No partners listed here. Logo should also appear in nav above.</div>

<!-- ═══ 3. PROOF STRIP ═══ -->
<div id="s-proof" class="sec-label">SECTION 3 — PROOF STRIP (directly below hero)</div>
<div class="proof-strip">
  <div class="proof-item">
    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
    <span><strong>Patent Pending</strong>&nbsp;·&nbsp;No. 19/459,855</span>
  </div>
  <div class="proof-sep"></div>
  <div class="proof-item">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    <span><strong>MVP v.01</strong>&nbsp;Build In Progress</span>
  </div>
  <div class="proof-sep"></div>
  <div class="proof-item">
    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
    <span><strong>200+</strong>&nbsp;KOLs Engaged</span>
  </div>
  <div class="proof-sep"></div>
  <div class="proof-item">
    <svg viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
    <span><strong>2</strong>&nbsp;AI-Discovered Orphan Assets</span>
  </div>
</div>
<div class="note"><strong>PROOF STRIP NOTES:</strong> 4 items only — no LOI, no partners. SVG icons monochrome teal-light. This is the right amount of signal for a sponsor-facing homepage. Dark teal background creates separation from hero. Investors who need full traction detail see it further down the page.</div>

<!-- ═══ 4. PROBLEM ═══ -->
<div id="s-problem" class="sec-label">SECTION 4 — THE PROBLEM</div>
<section class="problem">
  <div class="container">
    <div class="stag">The Problem</div>
    <h2 class="sh2">Phase II is where value<br>is won — or lost.</h2>
    <p class="s-intro">Only 28% of drug programs make it through Phase II. The culprit isn't the science. It's fragmented data, undocumented decisions, and institutional knowledge that walks out the door after every failed program.</p>
    <div class="stats-row">
      <div class="stat-c">
        <div class="stat-n">28%</div>
        <div class="stat-l">of drug programs ever complete Phase II</div>
      </div>
      <div class="stat-c">
        <div class="stat-n">90%</div>
        <div class="stat-l">of Phase IIs hit at least one substantial amendment <span style="display:block;opacity:.6;font-size:12px;margin-top:4px;">(average: 3.3 per trial)</span></div>
      </div>
      <div class="stat-c">
        <div class="stat-n" style="font-size:38px;line-height:1.1;">~$2.1M<br>+3 mo.</div>
        <div class="stat-l">direct cost and unplanned delay per amendment</div>
      </div>
    </div>
    <div class="prob-dark">
      <div class="prob-item">
        <div class="icon-box-ghost">
          <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 8h10M7 12h6"/></svg>
        </div>
        <h4>Data is fragmented</h4>
        <p>Translational data lives in silos. Trial teams make critical design decisions without full visibility into what the evidence actually supports.</p>
      </div>
      <div class="prob-item">
        <div class="icon-box-ghost">
          <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0018 0V5"/><path d="M3 12a9 3 0 0018 0"/></svg>
        </div>
        <h4>No institutional memory</h4>
        <p>When programs fail, the knowledge that explains why disappears with the team. The next program repeats the same mistakes from scratch.</p>
      </div>
      <div class="prob-item">
        <div class="icon-box-ghost">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
        </div>
        <h4>Decisions go undocumented</h4>
        <p>Critical choices about endpoints, patient populations, and protocol design are made informally — with no audit trail regulators can rely on.</p>
      </div>
    </div>
  </div>
</section>
<div class="note"><strong>PROBLEM NOTES:</strong> SVG icons in ghost teal boxes inside dark panel — all monochrome, stroke only. Stats use Velo scroll-count animation. Three root causes match your deck exactly. This section does the selling before the product is introduced.</div>

<!-- ═══ 5. SOLUTION ═══ -->
<div id="s-solution" class="sec-label">SECTION 5 — OUR SOLUTION</div>
<section class="solution">
  <div class="container">
    <div class="sol-grid">
      <div>
        <div class="stag">Intelligent Decision Infrastructure</div>
        <h2 class="sh2">Make every Phase II decision defensible.</h2>
        <p style="font-size:16px;line-height:1.78;color:var(--text-mid);margin-bottom:20px;">Foster Rx is the decision intelligence layer for Phase II execution. We build the infrastructure sponsors need to identify design vulnerabilities before they become costly amendments — and deliver documented, auditable recommendations that are regulator-ready from day one.</p>
        <p style="font-size:16px;line-height:1.78;color:var(--text-mid);">Sponsors receive a living asset intelligence data room they can use to adjust design, stop a trial early, or build the case for their next program — with every decision traceable back to its evidence.</p>
        <div class="sol-quote">"A provenance-linked knowledge graph feeding a governed decision layer — transforming structured translational data into defensible feasibility intelligence."</div>
      </div>
      <!-- RIGHT: use your existing Wix marketing image -->
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="feat-card">
          <div class="icon-box">
            <!-- Crosshair / target icon -->
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
          </div>
          <div><h4>Feasibility analysis before execution</h4><p>Identifies design vulnerabilities across endpoints, patient groups, and regulatory expectations before a single patient is enrolled.</p></div>
        </div>
        <div class="feat-card">
          <div class="icon-box">
            <!-- Link / chain icon -->
            <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </div>
          <div><h4>DecisionEvents — structured, auditable choices</h4><p>Every critical decision is captured, provenance-linked, and stored in a living asset intelligence data room the sponsor owns.</p></div>
        </div>
        <div class="feat-card">
          <div class="icon-box">
            <!-- Shield check icon -->
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9,12 11,14 15,10"/></svg>
          </div>
          <div><h4>Regulator-ready from day one</h4><p>Full governance and provenance tracing on every recommendation. Stop a trial early or pivot with evidence, not guesswork.</p></div>
        </div>
        <div class="feat-card">
          <div class="icon-box">
            <!-- Archive / memory icon -->
            <svg viewBox="0 0 24 24"><polyline points="21,8 21,21 3,21 3,8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          </div>
          <div><h4>Institutional memory that compounds</h4><p>Knowledge persists across programs and indications. Sponsors stop repeating expensive mistakes and build real portfolio intelligence.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="note"><strong>SOLUTION NOTES:</strong> All icons are stroke SVGs — no emojis, no color fills, white on dark teal icon boxes. Feature cards hover → slide right + shadow. Left column: narrative + pull quote. Your existing Wix marketing image (Updated FRX Marketing Image-web.png) could replace the cards column if preferred, or sit between Solution and How It Works as a full-width visual break.</div>

<!-- ═══ 6. HOW IT WORKS ═══ -->
<div id="s-how" class="sec-label">SECTION 6 — HOW IT WORKS</div>
<section class="how">
  <div class="container">
    <div class="stag">How It Works</div>
    <h2 class="sh2">From fragmented data<br>to defensible decisions.</h2>
    <div class="how-grid">
      <!-- LEFT: image from your existing Wix assets -->
      <div class="how-img">
        <img
          src="https://static.wixstatic.com/media/6b590a_748a8ee99bb04ca5b673302149c7e914~mv2.png"
          alt="Foster Rx Platform"
          style="width:100%;border-radius:18px;display:block;"
          onerror="this.style.background='linear-gradient(135deg,#1a2e2a,#3d6b61)';this.style.height='400px';this.removeAttribute('src')"/>
      </div>
      <!-- RIGHT: vertical step list -->
      <div class="steps-list">
        <div class="step-item">
          <div class="step-num-box">1</div>
          <div>
            <h4>Asset Intake</h4>
            <p>Sponsor submits existing translational data, prior study results, and protocol drafts into the Foster Rx intelligence platform.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num-box">2</div>
          <div>
            <h4>Feasibility &amp; Vulnerability Scan</h4>
            <p>Our knowledge graph evaluates design feasibility — identifying risks across endpoints, patient eligibility, and regulatory alignment.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num-box">3</div>
          <div>
            <h4>DecisionEvents Created</h4>
            <p>Every recommendation is captured as a structured, auditable DecisionEvent with full provenance, rationale, and supporting evidence.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num-box">4</div>
          <div>
            <h4>Asset Intelligence Delivered</h4>
            <p>Sponsors receive a living data room — adjust design, stop early, or build forward with fully documented decisions regulators can rely on.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<div class="note"><strong>HOW IT WORKS NOTES:</strong> Changed from horizontal 4-column to 2-column layout — image left, step list right. This creates a much stronger visual anchor and lets you use your existing platform marketing image. The vertical step list with teal numbered circles reads more naturally than a horizontal flow on most screens. Image src points to your existing Wix asset — swap for any updated platform screenshot or diagram as the product develops.</div>

<!-- ═══ 7. OFFERINGS ═══ -->
<div id="s-offerings" class="sec-label">SECTION 7 — OFFERINGS (3-track)</div>
<section class="offerings">
  <div class="container">
    <div class="stag">What We Offer</div>
    <h2 class="sh2" style="max-width:560px;">Three tracks.<br>One intelligence layer.</h2>
    <p class="s-intro" style="margin-bottom:0;">Foster Rx serves sponsors, data &amp; AI teams, and academic programs — each through a distinct engagement designed around where their decision risk actually lives.</p>
    <div class="off-grid">

      <!-- TRACK 1: SPONSORS (primary / dark) -->
      <div class="off-card primary">
        <div class="off-track">For Phase II Sponsors</div>
        <div class="off-icon-box">
          <!-- Activity / waveform icon -->
          <svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
        </div>
        <h3 class="off-h3">Phase II Decision Intelligence</h3>
        <p class="off-desc">The core Foster Rx engagement — a structured feasibility analysis of your Phase II design, delivering an auditable asset intelligence data room built for the decisions ahead.</p>
        <ul class="off-items">
          <li>Protocol feasibility analysis — endpoints, populations, regulatory alignment</li>
          <li>Trial design vulnerability identification before execution begins</li>
          <li>DecisionEvents data room — structured, auditable, regulator-ready</li>
          <li>Institutional memory infrastructure across programs and indications</li>
          <li>Documented recommendations sponsors can act on or present to regulators</li>
        </ul>
        <button class="off-cta">Book a Pilot Conversation <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></button>
      </div>

      <!-- TRACK 2: DATA & AI -->
      <div class="off-card">
        <div class="off-wl-badge">White-label available</div>
        <div class="off-track">For Data &amp; AI Teams</div>
        <div class="off-icon-box">
          <!-- Server / database stack icon -->
          <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        </div>
        <h3 class="off-h3">Curated Healthcare AI Datasets</h3>
        <p class="off-desc">Governance-tracked, provenance-linked datasets purpose-built for healthcare model training — structured with full chain-of-custody from within our DecisionEvents infrastructure.</p>
        <ul class="off-items">
          <li>Curated training datasets with regulatory-grade provenance</li>
          <li>Structured from real clinical decision workflows — not scraped</li>
          <li>Built for AI teams that need auditability, not just volume</li>
          <li>White-label licensing for organizations deploying under their own brand</li>
          <li>Tech transfer packages for teams building internal model infrastructure</li>
        </ul>
        <button class="off-cta">Inquire About Data Products <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></button>
      </div>

      <!-- TRACK 3: ACADEMIC -->
      <div class="off-card">
        <div class="off-track">For Academic &amp; Early-Stage Programs</div>
        <div class="off-icon-box">
          <!-- Book open icon -->
          <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        </div>
        <h3 class="off-h3">Translational Viability &amp; Tech Transfer Evaluation</h3>
        <p class="off-desc">Advisory evaluations for academic institutions, TTO offices, and early-stage investors assessing whether preclinical or academic IP has a defensible path to clinical execution.</p>
        <ul class="off-items">
          <li>Academic spinout and tech transfer readiness evaluations</li>
          <li>Translational viability analysis — does the science support a Phase II design?</li>
          <li>Asset readiness reports for TTO offices and venture partners</li>
          <li>Go / no-go frameworks grounded in regulatory and clinical operations expertise</li>
          <li>Structured, documented outputs suitable for IP licensing discussions</li>
        </ul>
        <button class="off-cta">Start an Evaluation <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></button>
      </div>

    </div>
  </div>
</section>
<div class="note"><strong>OFFERINGS NOTES:</strong> All icons SVG stroke, no emojis. Primary (dark) card = Track 1 sponsors. "White-label available" appears as a quiet badge top-right of Track 2 only. Track 3 is advisory, not platform. Each card has its own arrow CTA. Feasibility analysis is the named entry-point for Track 1. This architecture lets different visitor types self-identify immediately.</div>

<!-- ═══ 8. TRACTION STRIP ═══ -->
<div id="s-traction" class="sec-label">SECTION 8 — TRACTION (discrete strip)</div>
<div class="traction-strip">
  <div class="traction-inner">
    <div class="traction-label-col">
      <div class="stag">Where We Are</div>
      <p>Building with intent.<br>Moving with discipline.</p>
    </div>
    <div class="traction-items">
      <div class="tr-chip">
        <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        <div><strong>Patent Pending</strong> · No. 19/459,855</div>
      </div>
      <div class="tr-chip">
        <svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
        <div><strong>Architecture</strong> Built &amp; Validated</div>
      </div>
      <div class="tr-chip">
        <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <div><strong>MVP v.01</strong> Build In Progress</div>
      </div>
      <div class="tr-chip">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
        <div><strong>200+ KOLs</strong> Engaged</div>
      </div>
      <div class="tr-chip">
        <svg viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
        <div><strong>2 Orphan Assets</strong> AI-Discovered, Lab-Ready</div>
      </div>
    </div>
  </div>
</div>
<div class="note"><strong>TRACTION STRIP NOTES:</strong> 5 chips — no LOI, no partners, no fundraising amount. All SVG icons, monochrome. Label column left keeps it anchored. Light gray background — this section is confident and quiet, not a hero. Sponsors skip past it; investors who look will find it. This is the right level of disclosure for a public-facing site at this stage.</div>

<!-- ═══ 9. INSIGHTS ═══ -->
<div id="s-insights" class="sec-label">SECTION 9 — INSIGHTS (thought leadership + future media)</div>
<section class="insights">
  <div class="container">
    <div class="stag">Insights</div>
    <h2 class="sh2" style="max-width:560px;">From the field.</h2>
    <p class="s-intro" style="margin-bottom:0;">Perspectives on decision intelligence, Phase II execution, and the infrastructure the biopharma industry is still missing.</p>
    <div class="insights-grid">

      <!-- CARD 1: Authored piece — seed this first -->
      <div class="insight-card">
        <div class="insight-img" style="background:linear-gradient(135deg,#1a2e2a,#3d6b61);">
          <div class="insight-img-tag">Perspective</div>
          <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
        </div>
        <div class="insight-body">
          <div class="insight-date">March 2026 · By Gabrielle Foster</div>
          <div class="insight-title">Why 90% of Phase II Trials Hit an Amendment — And What the Industry Keeps Getting Wrong</div>
          <div class="insight-excerpt">The data on Phase II failure is well-known. What's less discussed is the infrastructure problem underneath it — and why better AI alone won't fix it.</div>
          <a href="#" class="insight-link">Read More <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></a>
        </div>
      </div>

      <!-- CARD 2: Second authored piece -->
      <div class="insight-card">
        <div class="insight-img" style="background:linear-gradient(135deg,#243d38,#5a8a7d);">
          <div class="insight-img-tag">Perspective</div>
          <svg viewBox="0 0 24 24"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>
        </div>
        <div class="insight-body">
          <div class="insight-date">February 2026 · By Gabrielle Foster</div>
          <div class="insight-title">Decision Intelligence Is Not the Same as AI — Here's the Difference</div>
          <div class="insight-excerpt">Biotech has embraced AI for discovery. But the hardest decisions happen in execution — and that's where the infrastructure gap lives.</div>
          <a href="#" class="insight-link">Read More <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg></a>
        </div>
      </div>

      <!-- CARD 3: Placeholder for press / event / podcast -->
      <div class="insight-card" style="border-style:dashed;opacity:.65;">
        <div class="insight-img" style="background:var(--bg-light);">
          <svg viewBox="0 0 24 24" style="stroke:var(--teal-pale)!important;"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </div>
        <div class="insight-body">
          <div class="insight-date" style="color:var(--teal-pale);">Coming Soon</div>
          <div class="insight-title" style="color:var(--text-muted);">Press · Events · Podcast Appearances</div>
          <div class="insight-excerpt">As Foster Rx grows, this section will feature press coverage, speaking engagements, and media appearances. The content is on its way.</div>
        </div>
      </div>

    </div>
  </div>
</section>
<div class="note"><strong>INSIGHTS NOTES:</strong> Start with 2 authored pieces seeded here — write these first, they double as LinkedIn content. Third card is a visible placeholder that signals "more coming" rather than looking empty. As press / podcast appearances happen, replace the placeholder. Tag system (Perspective / Press / Event / Podcast) lets the section scale naturally without restructuring. Do NOT call this "Media" or "News" until you have actual media coverage — calling it "Insights" is stronger and more durable. All icons SVG, no emojis, monochrome on gradient image backgrounds. In Wix, this can be a Blog connected to a CMS collection so cards populate automatically when you publish.</div>

<!-- ═══ 10. TEAM ═══ -->
<div id="s-team" class="sec-label">SECTION 10 — TEAM</div>
<section class="team">
  <div class="container">
    <div class="stag" style="text-align:center;">The Team</div>
    <h2 class="sh2" style="text-align:center;max-width:580px;margin:0 auto;">Built by someone who<br>lived this problem firsthand.</h2>
    <div class="founder-card">
      <!-- Photo: your existing headshot from Wix -->
      <div class="founder-photo">
        <img
          src="https://static.wixstatic.com/media/6b590a_4bde956d862d4441a685d69594ff2f38~mv2.jpg"
          alt="Gabrielle Foster"
          onerror="this.parentElement.style.background='var(--teal-pale)'"/>
      </div>
      <div>
        <div class="f-name">Gabrielle Foster</div>
        <div class="f-title">Founder &amp; CEO</div>
        <p class="f-bio">Former R&amp;D Clinical Operations leader at Takeda. MIT-trained data scientist (MPH/MSPH). Doctoral researcher in AI-enabled clinical trials. Gabrielle spent her career at the intersection of clinical operations, translational science, and data infrastructure — and founded Foster Rx to solve the decision intelligence gap she lived firsthand.</p>
        <div class="f-creds">
          <span class="cred">
            <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
            Ex-Takeda R&amp;D
          </span>
          <span class="cred">
            <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            MIT Data Science
          </span>
          <span class="cred">
            <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
            MPH / MSPH
          </span>
          <span class="cred">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
            Gates Foundation
          </span>
          <span class="cred">
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
            VA Researcher
          </span>
          <span class="cred">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Doctoral Researcher · AI Trials
          </span>
        </div>
      </div>
    </div>
    <!-- Logo row: your existing logo assets from Wix media library -->
    <div class="logo-row">
      <span>Takeda</span>
      <span>MIT</span>
      <span>Gates Foundation</span>
      <span>Univ. of Maryland</span>
      <span>Dept. of Veterans Affairs</span>
    </div>
  </div>
</section>
<div class="note"><strong>TEAM NOTES:</strong> Single founder card. SVG icons on credential badges — no emojis. Logo row uses your existing Wix media library images (replace text spans with actual logo img tags — logos already exist in your Wix assets). Photo pulls from your existing Wix headshot URL. Add an "Advisors" sub-section below this card when you have 2–3 names to list publicly.</div>

<!-- ═══ 11. CTA BANNER ═══ -->
<div id="s-cta" class="sec-label">SECTION 11 — CLOSING CTA BANNER</div>
<section class="cta-banner">
  <div class="container">
    <h2>Ready to make your Phase II<br>decision defensible?</h2>
    <p>We're working with a select group of Phase II sponsors for our pilot cohort. Book a 30-minute conversation to see if Foster Rx is the right fit for your program.</p>
    <div class="cta-btns">
      <button class="btn-cta-p">Book a Pilot Conversation →</button>
      <button class="btn-cta-g">info@fosterrx.com</button>
    </div>
  </div>
</section>
<div class="note"><strong>CTA NOTES:</strong> Replaces the generic contact form. "Select group" language is intentional — positions Foster Rx as selective. Primary CTA = Outlook booking link. Secondary = mailto:info@fosterrx.com. Remove the homepage contact form entirely.</div>

<!-- ═══ 12. FOOTER ═══ -->
<div id="s-footer" class="sec-label">SECTION 12 — FOOTER</div>
<footer>
  <div class="container">
    <div class="foot-grid">
      <div class="foot-brand">
        <!-- LOGO: Use your logo image in footer — white/light version if available, or text -->
        <div class="foot-brand-name">Foster Rx</div>
        <p>The decision intelligence layer for Phase II clinical trial execution.<br>Annapolis, MD, USA.</p>
        <div class="foot-socials">
          <a href="http://linkedin.com/company/foster-rx-llc/" class="soc">
            <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="https://github.com/Foster-Rx" class="soc">
            <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
          </a>
        </div>
      </div>
      <div class="foot-col">
        <h5>Platform</h5>
        <ul>
          <li><a href="#">How It Works</a></li>
          <li><a href="#">DecisionEvents</a></li>
          <li><a href="#">Asset Intelligence</a></li>
          <li><a href="#">Feasibility Analysis</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h5>Offerings</h5>
        <ul>
          <li><a href="#">For Phase II Sponsors</a></li>
          <li><a href="#">Healthcare AI Datasets</a></li>
          <li><a href="#">Tech Transfer Evaluations</a></li>
          <li><a href="#">White-Label Licensing</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h5>Contact</h5>
        <ul>
          <li><a href="mailto:info@fosterrx.com">info@fosterrx.com</a></li>
          <li><a href="tel:9737222532">973-722-2532</a></li>
          <li><a href="#">Book a Meeting</a></li>
          <li><a href="https://www.fosterrx.com">www.fosterrx.com</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2025 by Foster Rx LLC. All Rights Reserved.</span>
      <span>Patent Pending · No. 19/459,855</span>
    </div>
  </div>
</footer>
<div class="note" style="border-bottom:1px solid #e8d08a;"><strong>FOOTER NOTES — CRITICAL:</strong> Remove "+123-456-789", "contact@wix.com", "© 2035 by The Clinic" — all still live on your site. Footer logo: upload a white/reversed version of your logo for the dark footer background. SVG LinkedIn + GitHub icons. Patent number in bottom bar = quiet credibility signal. No partners section anywhere on the page.</div>

</div>
</body>
</html>