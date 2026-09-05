import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGlobalContext } from '../context';
import { CustomButton, CustomInput, PageHOC } from '../components';

const CreateBattle = () => {
  const { gameData, battleName, setBattleName, createBattle } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) navigate(`/battle/${encodeURIComponent(gameData.activeBattle.name)}`);
  }, [gameData]);

  const handleClick = () => {
    const battle = createBattle(battleName);
    if (battle) navigate(`/battle/${encodeURIComponent(battle.name)}`);
  };

  return (
    <>
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeHolder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />

        <CustomButton
          title="Fight the arena"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>
      <button type="button" className="arena-link" onClick={() => navigate('/join-battle')}>
        Browse demo battles
      </button>
      <button type="button" className="arena-link mt-1" onClick={() => navigate('/home')}>
        Change your character
      </button>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>Create <br /> a new Battle</>,
  <>Choose a battle name and face the Arena Guardian</>,
);
