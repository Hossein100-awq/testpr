// pages/Login.jsx
//
// Same navigation as your original: grantDemoAccess() on submit, then
// navigate back to location.state?.from, or /home if there's nowhere to
// return to. Only the visual design has changed.

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logo } from '../assets';
import { grantDemoAccess } from '../utils/demoAccess';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    grantDemoAccess();

    const destination = location.state?.from;
    const returnPath = destination
      ? `${destination.pathname}${destination.search || ''}${destination.hash || ''}`
      : '/home';

    navigate(returnPath, { replace: true });
  };

  return (
    <main className="av-page">
      <style>{css}</style>

      <div className="av-ring av-ring-outer" aria-hidden="true" />
      <div className="av-ring av-ring-inner" aria-hidden="true" />

      <section className="av-seal" aria-labelledby="av-heading">
        <span className="av-corner av-corner-tl" aria-hidden="true" />
        <span className="av-corner av-corner-tr" aria-hidden="true" />
        <span className="av-corner av-corner-bl" aria-hidden="true" />
        <span className="av-corner av-corner-br" aria-hidden="true" />

        <img className="av-emblem" src={logo} alt="Avax Gods" />

        <h1 id="av-heading" className="av-title">Enter the arena.</h1>
        <p className="av-lead">
          The Arena Guardian is waiting. Step through and continue your run.
        </p>

        <div className="av-rule" aria-hidden="true" />

        <form className="av-form" onSubmit={handleSubmit}>
          <button className="av-button" type="submit">
            <span>Enter the arena</span>
            <svg className="av-arrow" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3 9h11.5M10.5 4.5 15 9l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <p className="av-notice">No account or password needed for this demo.</p>
      </section>

      <p className="av-footer">Made with 💜 by JavaScript Mastery</p>
    </main>
  );
};

export default Login;

const css = `
.av-page{
  --av-void:#0a0908; --av-void-2:#120d0c; --av-ember:#e3503f; --av-ember-dim:#7a2b22;
  --av-gold:#c9a24b; --av-gold-dim:#5c4c28; --av-bone:#f4ede0; --av-parchment:#b9ae95;

  position:relative; min-height:100vh; display:flex; flex-direction:column;
  align-items:center; justify-content:center; overflow:hidden; isolation:isolate;
  padding:32px 20px; background:
    radial-gradient(1200px 820px at 50% 38%, #201512 0%, var(--av-void) 58%, #050404 100%);
  color:var(--av-bone);
  font-family:Georgia,"Iowan Old Style","Palatino Linotype",Palatino,serif;
}
.av-page *,.av-page *::before,.av-page *::after{box-sizing:border-box}

.av-ring{position:absolute; left:50%; top:46%; border-radius:50%; transform:translate(-50%,-50%);
  border:1px solid rgba(201,162,75,.16); pointer-events:none}
.av-ring-outer{width:min(90vw,760px); aspect-ratio:1; animation:av-spin 110s linear infinite}
.av-ring-outer::before, .av-ring-outer::after{content:"";position:absolute; width:5px;height:5px;border-radius:50%;
  background:var(--av-gold); box-shadow:0 0 10px 2px rgba(201,162,75,.6)}
.av-ring-outer::before{left:50%; top:-2.5px; transform:translateX(-50%)}
.av-ring-outer::after{left:50%; bottom:-2.5px; transform:translateX(-50%)}
.av-ring-inner{width:min(68vw,560px); aspect-ratio:1; border-color:rgba(227,80,63,.14);
  animation:av-spin 75s linear infinite reverse}
@keyframes av-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}

.av-seal{
  position:relative; z-index:1; width:min(92vw,440px); padding:52px 40px 40px;
  text-align:center; background:linear-gradient(180deg, rgba(24,17,15,.86), rgba(16,11,10,.92));
  border:1px solid rgba(201,162,75,.35);
  clip-path:polygon(18px 0,calc(100% - 18px) 0,100% 18px,100% calc(100% - 18px),calc(100% - 18px) 100%,18px 100%,0 calc(100% - 18px),0 18px);
  box-shadow:0 30px 70px -20px rgba(0,0,0,.75), inset 0 0 0 1px rgba(255,255,255,.02);
  backdrop-filter:blur(2px);
}

.av-corner{position:absolute; width:22px; height:22px; border:1.5px solid var(--av-gold); opacity:.85}
.av-corner-tl{top:9px; left:9px; border-right:0; border-bottom:0}
.av-corner-tr{top:9px; right:9px; border-left:0; border-bottom:0}
.av-corner-bl{bottom:9px; left:9px; border-right:0; border-top:0}
.av-corner-br{bottom:9px; right:9px; border-left:0; border-top:0}

.av-emblem{width:40px; height:40px; object-fit:contain; margin:0 auto 22px;
  filter:drop-shadow(0 0 10px rgba(227,80,63,.45))}

.av-title{margin:0 0 14px; font-size:clamp(28px,4vw,34px); line-height:1.15; font-weight:400;
  letter-spacing:.2px; color:var(--av-bone)}

.av-lead{margin:0 auto 26px; max-width:30ch; color:var(--av-parchment); font-size:15.5px;
  line-height:1.65; font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif}

.av-rule{width:64px; height:1px; margin:0 auto 26px;
  background:linear-gradient(90deg, transparent, var(--av-gold-dim), var(--av-gold), var(--av-gold-dim), transparent)}

.av-form{margin:0 0 22px}

.av-button{
  display:inline-flex; align-items:center; justify-content:center; gap:10px;
  width:100%; height:54px; padding:0 24px; cursor:pointer;
  background:linear-gradient(180deg, #e8574a, var(--av-ember) 55%, #c03e30);
  color:#190604; border:1px solid rgba(255,206,190,.45);
  font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;
  font-size:15.5px; font-weight:700; letter-spacing:.2px;
  clip-path:polygon(10px 0,calc(100% - 10px) 0,100% 10px,100% calc(100% - 10px),calc(100% - 10px) 100%,10px 100%,0 calc(100% - 10px),0 10px);
  box-shadow:0 14px 30px -10px rgba(227,80,63,.55);
  transition:transform .12s ease, box-shadow .2s ease, filter .2s ease;
}
.av-button:hover{filter:brightness(1.08); box-shadow:0 18px 38px -10px rgba(227,80,63,.7)}
.av-button:active{transform:translateY(1px)}
.av-button:focus-visible{outline:2px solid var(--av-gold); outline-offset:3px}
.av-arrow{flex:none; transition:transform .18s ease}
.av-button:hover .av-arrow{transform:translateX(3px)}

.av-notice{margin:0; color:#8d8372; font-size:12.5px; letter-spacing:.2px;
  font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif}

.av-footer{position:relative; z-index:1; margin:28px 0 0; color:#564f42; font-size:12.5px;
  font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif}

@media (max-width:420px){
  .av-seal{padding:44px 24px 32px}
}
@media (prefers-reduced-motion:reduce){
  .av-ring{animation:none !important}
  .av-arrow, .av-button{transition:none !important}
}
`;