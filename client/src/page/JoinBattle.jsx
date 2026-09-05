import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../context';
import { CustomButton, PageHOC } from '../components';
import styles from '../styles';

const JoinBattle = () => {
  const navigate = useNavigate();
  const { gameData } = useGlobalContext();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) navigate(`/battle/${gameData.activeBattle.name}`);
  }, [gameData]);

  return (
    <>
      <h2 className={styles.joinHeadText}>Available Battles:</h2>

      <div className={`${styles.joinContainer} battle-list`}>
        {gameData.pendingBattles.length
          ? gameData.pendingBattles
            .filter((battle) => battle.battleStatus !== 1)
            .map((battle, index) => (
              <div key={battle.name + index} className={`${styles.flexBetween} battle-list-item`}>
                <p className={styles.joinBattleTitle}>{index + 1}. {battle.name}</p>
                <CustomButton
                  title="Join"
                  handleClick={() => navigate(`/battle/${encodeURIComponent(battle.name)}`)}
                />
              </div>
            )) : (
                <div className="flex flex-col items-center gap-5">
                  <p className={styles.joinLoading}>No open demo battles</p>
                  <CustomButton title="Start a bot match" handleClick={() => navigate('/create-battle')} />
                </div>
          )}
      </div>

      <button type="button" className="arena-link" onClick={() => navigate('/create-battle')}>
        Or create a new battle
      </button>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>Join <br /> a Battle</>,
  <>Join already existing battles</>,
);
