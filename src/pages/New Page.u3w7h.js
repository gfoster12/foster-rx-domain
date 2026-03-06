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

<div id="s-nav" class="sec-label">SECTION 1 — NAVIGATION</div>
<nav>
  <div class="nav-logo">
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
      <!-- ADDED IDS -->
      <button id="btnHeroPrimary" class="btn-hero-p">Book a Pilot Conversation →</button>
      <button id="btnHeroGhost" class="btn-hero-g">See How It Works ↓</button>
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

<!-- (Keep the rest of your sections exactly as you pasted them) -->

<div id="s-cta" class="sec-label">SECTION 11 — CLOSING CTA BANNER</div>
<section class="cta-banner">
  <div class="container">
    <h2>Ready to make your Phase II<br>decision defensible?</h2>
    <p>We're working with a select group of Phase II sponsors for our pilot cohort. Book a 30-minute conversation to see if Foster Rx is the right fit for your program.</p>
    <div class="cta-btns">
      <!-- ADDED IDS -->
      <button id="btnCtaPrimary" class="btn-cta-p">Book a Pilot Conversation →</button>
      <button id="btnCtaEmail" class="btn-cta-g">info@fosterrx.com</button>
    </div>
  </div>
</section>

<div id="s-footer" class="sec-label">SECTION 12 — FOOTER</div>
<footer>
  <!-- your footer as-is -->
</footer>

</div>

<script>
  // Defaults (can be overridden by Wix Velo via postMessage)
  let CONFIG = {
    bookingUrl: "https://scheduler.zoom.us/gabrielle-foster-frx",
    email: "info@fosterrx.com"
  };

  function safeOpen(url){
    try { window.open(url, "_blank", "noopener"); } catch(e) { location.href = url; }
  }
  function scrollToId(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
  }

  // Wire buttons
  document.addEventListener("DOMContentLoaded", () => {
    const btnHeroPrimary = document.getElementById("btnHeroPrimary");
    const btnHeroGhost   = document.getElementById("btnHeroGhost");
    const btnCtaPrimary  = document.getElementById("btnCtaPrimary");
    const btnCtaEmail    = document.getElementById("btnCtaEmail");

    if(btnHeroPrimary) btnHeroPrimary.addEventListener("click", () => safeOpen(CONFIG.bookingUrl));
    if(btnCtaPrimary)  btnCtaPrimary.addEventListener("click", () => safeOpen(CONFIG.bookingUrl));
    if(btnHeroGhost)   btnHeroGhost.addEventListener("click", () => scrollToId("s-how"));
    if(btnCtaEmail)    btnCtaEmail.addEventListener("click", () => safeOpen(`mailto:${CONFIG.email}`));
  });

  // Receive config from Wix (parent)
  window.addEventListener("message", (event) => {
    // optional: validate origin if you want tighter security
    const data = event.data;
    if(!data || data.type !== "FRX_CONFIG") return;
    CONFIG = { ...CONFIG, ...data.payload };

    // Update CTA email label if present
    const btnCtaEmail = document.getElementById("btnCtaEmail");
    if(btnCtaEmail && CONFIG.email) btnCtaEmail.textContent = CONFIG.email;
  });
</script>

</body>
</html>