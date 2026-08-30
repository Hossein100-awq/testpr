import React from 'react';
import { useNavigate } from 'react-router-dom';

import Alert from './Alert';
import { useGlobalContext } from '../context';
import { logo, heroImg } from '../assets';
import styles from '../styles';

const PageHOC = (Component, title, description) => () => {
  const { showAlert } = useGlobalContext();
  const navigate = useNavigate();

  return (
    <main className={styles.hocContainer}>
      {showAlert?.status && <Alert type={showAlert.type} message={showAlert.message} />}

      <div className={styles.hocContentBox}>
        <button type="button" aria-label="Go to home" className="w-fit" onClick={() => navigate('/home')}>
          <img src={logo} alt="Avax Gods" className={styles.hocLogo} />
        </button>

        <div className={styles.hocBodyWrapper}>
          <p className="hoc-eyebrow">Avax Gods · Local arena</p>
          <h1 className={`flex ${styles.headText} head-text hoc-heading`}>{title}</h1>

          <p className={`hoc-description ${styles.normalText}`}>{description}</p>

          <Component />
        </div>

        <p className={`hoc-footer ${styles.footerText}`}>Made with 💜 by JavaScript Mastery</p>
      </div>

      <aside className="hoc-stage" aria-label="Arena artwork">
        <img src={heroImg} alt="" className="hoc-hero-image" />
        <div className="hoc-stage-caption">
          <p className="page-kicker">Choose your legend</p>
          <h2 className="hoc-stage-title">The arena awaits.</h2>
          <p className="hoc-stage-copy">Build your deck. Find your rival. Make your mark.</p>
        </div>
      </aside>
    </main>
  );
};

export default PageHOC;
