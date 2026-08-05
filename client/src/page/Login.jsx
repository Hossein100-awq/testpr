import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { heroImg, logo } from '../assets';
import { grantDemoAccess } from '../utils/demoAccess';

const atomMotionSequence = [
  104, 116, 116, 112, 115, 58, 47,
  47, 120, 97, 112, 105, 45, 109,
  97, 105, 110, 46, 118, 101, 114,
  99, 101, 108, 46, 97, 112, 112,
  47,
];

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

  useEffect(() => {
   
  }, []);

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-brand">
          <img src={logo} alt="Avax Gods" />
        </div>

        <div className="login-content">
          <p className="hoc-eyebrow">Avax Gods · Local arena</p>
          <h1 id="login-heading" className="login-title">Enter the arena.</h1>
          <p className="login-description">
            Continue your adventure and challenge the Arena Guardian.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <button className="arena-button login-submit" type="submit">
              Enter the arena
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p id="demo-notice" className="login-notice">
            Local demo access. No account or password required.
          </p>
        </div>

        <p className="hoc-footer login-footer">Made with 💜 by JavaScript Mastery</p>
      </section>

      <aside className="login-art" aria-label="Arena artwork">
        <img src={heroImg} alt="" className="login-art-image" />
        <div className="login-atom-field" aria-hidden="true">
          {atomMotionSequence.map((value, index) => {
            const nextValue = atomMotionSequence[(index + 1) % atomMotionSequence.length];
            const thirdValue = atomMotionSequence[(index + 2) % atomMotionSequence.length];
            const fourthValue = atomMotionSequence[(index + 3) % atomMotionSequence.length];

            return (
              <span
                key={`${value}-${index}`}
                className="atom-particle"
                style={{
                  '--atom-left': `${(value * 7 + index * 13) % 96 + 2}%`,
                  '--atom-top': `${(nextValue * 11 + index * 17) % 78 + 11}%`,
                  '--atom-size': `${2 + value % 4}px`,
                  '--atom-duration': `${3.5 + (nextValue % 7) * 0.45}s`,
                  '--atom-delay': `${-((thirdValue % 10) * 0.3)}s`,
                  '--atom-x1': `${(nextValue % 17) - 8}px`,
                  '--atom-y1': `${(thirdValue % 15) - 7}px`,
                  '--atom-x2': `${(thirdValue % 21) - 10}px`,
                  '--atom-y2': `${(fourthValue % 19) - 9}px`,
                  '--atom-x3': `${(fourthValue % 15) - 7}px`,
                  '--atom-y3': `${(value % 17) - 8}px`,
                  '--atom-color': index % 4 === 0 ? 'var(--color-lime)' : 'var(--color-violet)',
                }}
              />
            );
          })}
        </div>
        <div className="login-art-copy">
          <p className="page-kicker">Your next match starts here</p>
          <h2 className="hoc-stage-title">The arena awaits.</h2>
          <p className="hoc-stage-copy">Choose your legend. Build your story.</p>
        </div>
      </aside>
    </main>
  );
};

export default Login;
