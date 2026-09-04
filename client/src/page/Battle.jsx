/* eslint-disable prefer-destructuring */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles';
import { Card, CustomButton, GameInfo, PlayerInfo } from '../components';
import { useGlobalContext } from '../context';
import { player02 as player02Icon } from '../assets';
import { getCharacterAbilities, isOffensiveAbility } from '../utils/abilities';

const Battle = () => {
  const { gameData, battleGround, makeMove, createBattle, upgradePlayer, showAlert, player1Ref, player2Ref } = useGlobalContext();
  const navigate = useNavigate();
  const battle = gameData.activeBattle;
  const player1 = gameData.player ? {
    ...gameData.player,
    att: gameData.player.attackStrength,
    def: gameData.player.defenseStrength,
  } : {};
  const player2 = battle?.opponent ? {
    ...battle.opponent,
    att: 'X',
    def: 'X',
  } : {};
  const abilities = getCharacterAbilities(player1.characterId);
  const opponentAbilities = getCharacterAbilities(player2.characterId);
  const selectedOpponentAbility = opponentAbilities.find((ability) => (
    ability.id === (battle?.pendingAction?.opponentAbilityId || battle?.moves?.[1])
  ));
  const opponentIsAttacking = battle?.pendingAction?.phase === 'opponent-action'
    && isOffensiveAbility(selectedOpponentAbility);
  const isFighting = Boolean(battle?.pendingAction);
  const playerWon = battle?.winner === player1.playerAddress;

  useEffect(() => {
    if (!battle) navigate('/create-battle');
  }, [battle, navigate]);

  const handleMove = (ability) => {
    makeMove(ability.id);
  };

  const handleNextArena = () => {
    const nextBattle = createBattle();
    if (nextBattle) navigate(`/battle/${encodeURIComponent(nextBattle.name)}`);
  };

  const renderOpponentAbilities = () => (
    <ul className="mt-2 space-y-2">
      {opponentAbilities.map((ability) => (
        <li
          key={ability.id}
          className={`border-l-2 py-1 pl-2 ${selectedOpponentAbility?.id === ability.id ? 'border-red-300 bg-red-950/50' : 'border-white/20'}`}
        >
          <span className="block font-rajdhani text-sm font-bold text-white">{ability.name}</span>
          <span className="block text-xs text-white/70">{ability.description}</span>
          <span className="block text-[10px] text-yellow-200">{ability.cost} mana</span>
        </li>
      ))}
    </ul>
  );

  if (!battle) return null;

  return (
    <main className={`${styles.flexBetween} ${styles.gameContainer} battle-arena ${battleGround} relative`}>
      {showAlert?.status && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center px-4" role="status" aria-live="polite">
          <div className={`max-w-[min(90vw,38rem)] border border-white/40 bg-black/85 px-6 py-4 text-center font-rajdhani text-lg font-bold text-white shadow-2xl backdrop-blur-md ${showAlert.type === 'success' ? 'ring-2 ring-green-400/70' : showAlert.type === 'failure' ? 'ring-2 ring-red-400/70' : 'ring-2 ring-cyan-300/70'}`}>
            {showAlert.message}
          </div>
        </div>
      )}

      {battle.battleStatus === 1 && (
        <aside className="battle-player-skills fixed bottom-[5.25rem] left-2 right-2 z-20 rounded-sm border border-white/25 bg-black/75 p-2 shadow-xl backdrop-blur-md md:absolute md:bottom-auto md:left-4 md:right-auto md:top-1/2 md:w-64 md:-translate-y-1/2 md:p-4">
          <h2 className="col-span-5 mb-2 font-rajdhani text-sm font-bold uppercase text-white md:col-span-1 md:text-lg">
            {player1.playerName}&apos;s skills
          </h2>
          <div className="grid grid-cols-5 gap-1 md:grid-cols-1 md:gap-2">
            {abilities.map((ability) => {
              const isWaiting = Boolean(battle.pendingAction);
              const canAfford = player1.mana >= ability.cost;

              return (
                <button
                  key={ability.id}
                  type="button"
                  disabled={isWaiting || !canAfford}
                  onClick={() => handleMove(ability)}
                  className="min-h-14 border border-white/30 bg-white/5 p-1 text-center text-white transition-colors enabled:hover:border-yellow-300 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45 md:min-h-20 md:p-3 md:text-left"
                  title={`${ability.description} Cost: ${ability.cost} mana`}
                >
                  <span className="block font-rajdhani text-[10px] font-bold leading-tight md:text-base">
                    {ability.name}
                  </span>
                  <span className="mt-1 hidden text-xs text-white/70 md:block">
                    {ability.description}
                  </span>
                  <span className="mt-1 block text-[9px] text-yellow-200 md:text-xs">
                    {ability.cost} mana
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      <aside className="battle-opponent-skills absolute right-2 top-20 z-20 w-48 rounded-sm border border-red-200/30 bg-black/75 p-3 shadow-xl backdrop-blur-md md:fixed md:right-4 md:top-1/2 md:w-64 md:-translate-y-1/2">
        <details className="md:hidden">
          <summary className="cursor-pointer font-rajdhani text-sm font-bold text-white">
            Arena skills · Tier {battle.tier || 1}
          </summary>
          {renderOpponentAbilities()}
        </details>
        <div className="hidden md:block">
          <h2 className="font-rajdhani text-lg font-bold uppercase text-white">
            Arena skills · Tier {battle.tier || 1}
          </h2>
          {renderOpponentAbilities()}
        </div>
      </aside>

      <div className="battle-opponent-info">
        <PlayerInfo player={player2} playerIcon={player02Icon} mt />
      </div>

      <section className={`${styles.flexCenter} battle-center flex-col`}>
        <div className="battle-round-info">
          <p className="mb-1 text-center font-rajdhani text-sm font-semibold uppercase text-yellow-100">
            Arena tier {battle.tier || 1}
          </p>
          <p className="mb-2 text-center text-lg text-white">Round {battle.round}</p>
          <p className="mb-5 max-w-md text-center text-white" aria-live="polite">{battle.lastResult}</p>
        </div>

        <div className={`battle-card-row ${isFighting ? 'is-fighting' : ''}`}>
          <div className={`battle-card-motion battle-card-motion-right ${isFighting ? 'is-fighting' : ''}`}>
            <Card card={player2} title={player2?.playerName} cardRef={player2Ref} />
          </div>
          <div className={`battle-card-motion battle-card-motion-left ${isFighting ? 'is-fighting' : ''}`}>
            <Card
              card={player1}
              title={player1?.playerName}
              cardRef={player1Ref}
            />
          </div>
        </div>

        {battle.battleStatus !== 1 && !playerWon && (
          <CustomButton title="Fight again" handleClick={handleNextArena} restStyles="mt-5" />
        )}
      </section>

      <section
        aria-label="Your hero status"
        className={`battle-hero-status fixed bottom-2 left-1/2 z-20 w-[min(92vw,34rem)] -translate-x-1/2 border border-white/25 bg-black/80 px-3 py-2 text-white shadow-xl backdrop-blur-md md:bottom-3 ${opponentIsAttacking ? 'hero-impact' : ''}`}
      >
        <div className="mb-1 flex items-center justify-between gap-3 font-rajdhani text-sm font-bold">
          <span className="truncate">{player1.playerName}</span>
          <span className="shrink-0 text-yellow-200">Attack +{player1.attackBonus || 0}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-rajdhani text-xs font-semibold">HP {player1.health}/{player1.maxHealth || 25}</span>
          <div
            role="progressbar"
            aria-label="Hero health"
            aria-valuemin={0}
            aria-valuemax={player1.maxHealth || 25}
            aria-valuenow={player1.health}
            className="h-2 flex-1 overflow-hidden bg-white/20"
          >
            <div
              className={`h-full transition-all ${player1.health >= 12 ? 'bg-green-500' : player1.health >= 6 ? 'bg-orange-500' : 'bg-red-500'}`}
              style={{ width: `${Math.max(0, Math.min(100, (player1.health / (player1.maxHealth || 25)) * 100))}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="shrink-0 font-rajdhani text-xs font-semibold text-cyan-100">
            Mana {player1.mana}/{player1.maxMana || 10}
          </span>
          <div
            role="progressbar"
            aria-label="Hero mana"
            aria-valuemin={0}
            aria-valuemax={player1.maxMana || 10}
            aria-valuenow={player1.mana}
            className="h-2 flex-1 overflow-hidden bg-white/20"
          >
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, (player1.mana / (player1.maxMana || 10)) * 100))}%` }}
            />
          </div>
        </div>
      </section>

      {battle.battleStatus !== 1 && playerWon && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <section className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-yellow-200/50 bg-black/90 p-4 text-white shadow-2xl backdrop-blur-md sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-rajdhani text-xl font-bold">Victory rewards</h2>
              <span className="font-rajdhani text-sm text-yellow-200">+3 upgrade points earned</span>
            </div>
            <p className="mb-3 mt-1 font-rajdhani text-sm text-white/80">
              Available points: {player1.upgradePoints || 0}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'health', label: '+5 max HP', current: `${player1.maxHealth || 25}/100` },
                { id: 'mana', label: '+3 max mana', current: `${player1.maxMana || 10}/40` },
                { id: 'attack', label: '+1 attack', current: `+${player1.attackBonus || 0}/12` },
              ].map((upgrade) => {
                const capped = upgrade.id === 'health'
                  ? player1.maxHealth >= 100
                  : upgrade.id === 'mana' ? player1.maxMana >= 40 : player1.attackBonus >= 12;
                const disabled = !player1.upgradePoints || capped;

                return (
                  <button
                    key={upgrade.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => upgradePlayer(upgrade.id)}
                    className="min-h-16 border border-white/25 bg-white/5 p-2 text-left font-rajdhani text-xs transition-colors enabled:hover:border-yellow-200 disabled:opacity-40 sm:text-sm"
                  >
                    <span className="block font-bold">{upgrade.label}</span>
                    <span className="block text-white/65">{upgrade.current}</span>
                  </button>
                );
              })}
            </div>
            <CustomButton title="Enter next arena" handleClick={handleNextArena} restStyles="mt-5" />
          </section>
        </div>
      )}

      <GameInfo />
    </main>
  );
};

export default Battle;
