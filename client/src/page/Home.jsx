import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';
import { characters } from '../assets';
import WalletConnect from '../components/WalletConnect';

const Home = () => {
  const { gameData, registerPlayer, setShowAlert } = useGlobalContext();

  const [playerName, setPlayerName] = useState(
    gameData.player?.playerName || ''
  );

  const [characterId, setCharacterId] = useState(
    gameData.player?.characterId || characters[0].id
  );

  const navigate = useNavigate();

  const handleClick = async () => {
    if (!registerPlayer(playerName, characterId)) {
      setShowAlert({
        status: true,
        type: 'failure',
        message: 'Enter a name to join the arena.',
      });

      return;
    }

    setShowAlert({
      status: true,
      type: 'info',
      message: gameData.player
        ? 'Your player profile has been updated.'
        : `${playerName.trim()} is ready for battle.`,
    });

    navigate('/create-battle');
  };

  useEffect(() => {
    if (gameData.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData, navigate]);

  return (
    <div className="flex flex-col">
      {/* Wallet connection */}
      <div className="mb-6 flex justify-end">
        <WalletConnect />
      </div>

      {/* Player name */}
      <CustomInput
        label="Name"
        placeHolder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />

      {/* Character selection */}
      <fieldset className="mt-5">
        <legend className="mb-3 font-rajdhani text-lg font-semibold text-white">
          Choose your character
        </legend>

        <div className="character-grid">
          {characters.map((character) => (
            <button
              key={character.id}
              type="button"
              aria-label={`Choose ${character.name}`}
              aria-pressed={characterId === character.id}
              onClick={() => setCharacterId(character.id)}
              className="character-option"
            >
              <img
                src={character.image}
                alt=""
                className="h-full w-full object-cover"
              />

              <span className="character-option-name">
                {character.name}
              </span>
            </button>
          ))}
        </div>

        <p
          className="mt-2 font-rajdhani text-sm text-white/70"
          aria-live="polite"
        >
          Selected:{' '}
          {characters.find(
            (character) => character.id === characterId
          )?.name}
        </p>
      </fieldset>

      {/* Enter arena */}
      <CustomButton
        title={gameData.player ? 'Save player profile' : 'Enter the arena'}
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> Local demo edition
  </>,
  <>
    Choose a name and challenge the arena <br /> No wallet or contract required
  </>,
);