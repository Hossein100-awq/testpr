import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { characters } from '../assets';
import { getCharacterAbilities, resolveAbilityExchange } from '../utils/abilities';

const GlobalContext = createContext();
const STORAGE_KEY = 'avax-gods-demo-v1';
const PLAYER_ADDRESS = '0x000000000000000000000000000000000000d001';
const OPPONENT_ADDRESS = '0x000000000000000000000000000000000000d002';

const emptyDemoState = { player: null, battles: [], activeBattleId: null };

const rollAttack = () => Math.floor(Math.random() * 9) + 1;
const randomCharacterId = () => characters[Math.floor(Math.random() * characters.length)].id;

const loadDemoState = () => {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (savedState) {
      return {
        player: savedState.player
          ? {
            ...savedState.player,
            characterId: savedState.player.characterId || 'ace',
            maxHealth: savedState.player.maxHealth || 25,
            maxMana: savedState.player.maxMana || 10,
            attackBonus: savedState.player.attackBonus || 0,
            upgradePoints: savedState.player.upgradePoints || 0,
          }
          : null,
        battles: Array.isArray(savedState.battles)
          ? savedState.battles.map((battle) => ({
            ...battle,
            tier: battle.tier || 1,
            opponent: battle.opponent
              ? { ...battle.opponent, maxHealth: battle.opponent.maxHealth || 25 }
              : battle.opponent,
            pendingAction: null,
          }))
          : [],
        activeBattleId: savedState.activeBattleId || null,
      };
    }
  } catch (error) {
    return emptyDemoState;
  }

  return emptyDemoState;
};

const createPlayer = (address, name, characterId) => {
  const attackStrength = rollAttack();

  return {
    playerAddress: address,
    playerName: name,
    characterId,
    health: 25,
    maxHealth: 25,
    mana: 10,
    maxMana: 10,
    attackBonus: 0,
    upgradePoints: 0,
    attackStrength,
    defenseStrength: 10 - attackStrength,
  };
};

export const GlobalContextProvider = ({ children }) => {
  const [demoState, setDemoState] = useState(loadDemoState);
  const [battleGround, setBattleGround] = useState('bg-astral');
  const [showAlert, setShowAlert] = useState({ status: false, type: 'info', message: '' });
  const [battleName, setBattleName] = useState('');

  const player1Ref = useRef();
  const player2Ref = useRef();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoState));
  }, [demoState]);

  useEffect(() => {
    const savedGround = localStorage.getItem('battleground');

    if (savedGround) setBattleGround(savedGround);
  }, []);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: 'info', message: '' });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const activeBattle = demoState.battles.find((battle) => battle.id === demoState.activeBattleId) || null;
  const gameData = {
    player: demoState.player,
    players: demoState.player ? [demoState.player] : [],
    pendingBattles: demoState.battles.filter((battle) => battle.battleStatus === 0),
    activeBattle,
  };

  const registerPlayer = (name, characterId) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;

    setDemoState((current) => ({
      ...current,
      player: current.player
        ? { ...current.player, playerName: trimmedName, characterId }
        : createPlayer(PLAYER_ADDRESS, trimmedName, characterId),
    }));
    return true;
  };

  const createBattle = (name) => {
    if (!demoState.player) return null;

    const arenaTier = 1 + demoState.battles.filter((battle) => battle.winner === PLAYER_ADDRESS).length;
    const tierBonus = arenaTier - 1;
    const trimmedName = name?.trim() || `Arena ${arenaTier}`;
    const player = {
      ...demoState.player,
      health: demoState.player.maxHealth,
      mana: demoState.player.maxMana,
    };
    const opponentStats = createPlayer(OPPONENT_ADDRESS, 'Arena Guardian', randomCharacterId());
    const easyAttack = Math.ceil(rollAttack() / 3);
    const easyDefense = Math.ceil(rollAttack() / 3);
    const opponent = {
      ...opponentStats,
      playerName: `Arena Guardian · Tier ${arenaTier}`,
      health: 18 + (tierBonus * 10),
      maxHealth: 18 + (tierBonus * 10),
      attackStrength: easyAttack + Math.min(12, tierBonus * 2),
      defenseStrength: easyDefense + Math.min(8, tierBonus),
    };
    const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const battle = {
      id,
      name: trimmedName,
      tier: arenaTier,
      battleStatus: 1,
      players: [PLAYER_ADDRESS, OPPONENT_ADDRESS],
      round: 1,
      moves: [0, 0],
      winner: null,
      lastResult: `Arena tier ${arenaTier}. The guardian is ready. Choose your move.`,
      opponent,
    };

    setDemoState((current) => ({
      ...current,
      player,
      battles: [...current.battles, battle],
      activeBattleId: id,
    }));
    return battle;
  };

  const makeMove = (abilityId) => {
    if (!activeBattle || activeBattle.battleStatus !== 1 || !demoState.player) return;
    if (activeBattle.pendingAction) return;

    const ability = getCharacterAbilities(demoState.player.characterId).find((move) => move.id === abilityId);
    if (!ability || demoState.player.mana < ability.cost) {
      setShowAlert({ status: true, type: 'failure', message: 'Not enough mana for that ability.' });
      return;
    }

    const affordableMoves = getCharacterAbilities(activeBattle.opponent.characterId)
      .filter((move) => move.cost <= activeBattle.opponent.mana);
    const opponentAbility = affordableMoves[Math.floor(Math.random() * affordableMoves.length)]
      || getCharacterAbilities(activeBattle.opponent.characterId)[2];
    const updatedBattle = {
      ...activeBattle,
      pendingAction: {
        id: `${Date.now()}-${Math.random()}`,
        abilityId,
        opponentAbilityId: opponentAbility.id,
        phase: 'windup',
      },
      lastResult: `You chose ${ability.name}. The Arena Guardian is preparing its response...`,
    };

    setDemoState((current) => ({
      ...current,
      battles: current.battles.map((battle) => (battle.id === updatedBattle.id ? updatedBattle : battle)),
    }));
  };

  useEffect(() => {
    if (!activeBattle?.pendingAction) return undefined;

    const { id: pendingId, phase, abilityId, opponentAbilityId } = activeBattle.pendingAction;

    if (phase === 'windup') {
      const timer = setTimeout(() => {
        const opponentAbility = getCharacterAbilities(activeBattle.opponent.characterId)
          .find((move) => move.id === opponentAbilityId);

        setDemoState((current) => {
          const currentBattle = current.battles.find((battle) => battle.id === activeBattle.id);
          if (!currentBattle || currentBattle.pendingAction?.id !== pendingId) return current;

          const updatedBattle = {
            ...currentBattle,
            pendingAction: { ...currentBattle.pendingAction, phase: 'opponent-action' },
            lastResult: `${activeBattle.opponent.playerName} uses ${opponentAbility.name}!`,
          };

          return {
            ...current,
            battles: current.battles.map((battle) => (battle.id === updatedBattle.id ? updatedBattle : battle)),
          };
        });
      }, 350);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const playerAbility = getCharacterAbilities(demoState.player.characterId)
        .find((move) => move.id === abilityId);
      const opponentAbility = getCharacterAbilities(activeBattle.opponent.characterId)
        .find((move) => move.id === opponentAbilityId);
      const exchange = resolveAbilityExchange(
        demoState.player,
        activeBattle.opponent,
        playerAbility,
        opponentAbility,
      );
      const winner = exchange.winner === 'player'
        ? PLAYER_ADDRESS
        : exchange.winner === 'opponent' ? OPPONENT_ADDRESS : exchange.winner;
      const result = exchange.winner
        ? exchange.winner === 'draw'
          ? `You used ${playerAbility.name}; ${activeBattle.opponent.playerName} used ${opponentAbility.name}. Both fighters fall. The match is a draw.`
          : `You used ${playerAbility.name} for ${exchange.damageToOpponent} damage. ${activeBattle.opponent.playerName} used ${opponentAbility.name} for ${exchange.damageToPlayer} damage. ${exchange.winner === 'player' ? 'You win!' : `${activeBattle.opponent.playerName} wins!`}`
        : `You used ${playerAbility.name} for ${exchange.damageToOpponent} damage. ${activeBattle.opponent.playerName} used ${opponentAbility.name} for ${exchange.damageToPlayer} damage.`;
      const updatedBattle = {
        ...activeBattle,
        battleStatus: winner ? 2 : 1,
        round: activeBattle.round + (winner ? 0 : 1),
        moves: [playerAbility.id, opponentAbility.id],
        winner,
        opponent: exchange.opponent,
        pendingAction: null,
        lastResult: result,
      };

      setDemoState((current) => {
        const currentBattle = current.battles.find((battle) => battle.id === activeBattle.id);
        if (!currentBattle || currentBattle.pendingAction?.id !== pendingId) return current;

        return {
          ...current,
          player: exchange.winner === 'player'
            ? { ...exchange.player, upgradePoints: (exchange.player.upgradePoints || 0) + 3 }
            : exchange.player,
          battles: current.battles.map((battle) => (battle.id === updatedBattle.id ? updatedBattle : battle)),
        };
      });
      setShowAlert({
        status: true,
        type: winner === PLAYER_ADDRESS ? 'success' : winner ? 'failure' : 'info',
        message: result,
      });
    }, 900);

    return () => clearTimeout(timer);
  }, [activeBattle?.id, activeBattle?.pendingAction?.id, activeBattle?.pendingAction?.phase, demoState.player]);

  const upgradePlayer = (upgradeType) => {
    setDemoState((current) => {
      const player = current.player;
      if (!player || player.upgradePoints < 1) return current;

      let upgradedPlayer;
      if (upgradeType === 'health' && player.maxHealth < 100) {
        const maxHealth = Math.min(100, player.maxHealth + 5);
        upgradedPlayer = { ...player, maxHealth, health: Math.min(maxHealth, player.health + 5) };
      } else if (upgradeType === 'mana' && player.maxMana < 40) {
        const maxMana = Math.min(40, player.maxMana + 3);
        upgradedPlayer = { ...player, maxMana, mana: Math.min(maxMana, player.mana + 3) };
      } else if (upgradeType === 'attack' && player.attackBonus < 12) {
        upgradedPlayer = { ...player, attackBonus: player.attackBonus + 1 };
      } else {
        return current;
      }

      return {
        ...current,
        player: { ...upgradedPlayer, upgradePoints: player.upgradePoints - 1 },
      };
    });
  };

  const quitBattle = () => {
    if (!activeBattle || activeBattle.battleStatus !== 1) return;

    const updatedBattle = {
      ...activeBattle,
      battleStatus: 2,
      winner: OPPONENT_ADDRESS,
      lastResult: 'You left the battle. The Arena Guardian wins.',
    };

    setDemoState((current) => ({
      ...current,
      battles: current.battles.map((battle) => (battle.id === updatedBattle.id ? updatedBattle : battle)),
    }));
    setShowAlert({ status: true, type: 'info', message: updatedBattle.lastResult });
  };

  return (
    <GlobalContext.Provider
      value={{
        player1Ref,
        player2Ref,
        battleGround,
        setBattleGround,
        gameData,
        walletAddress: PLAYER_ADDRESS,
        registerPlayer,
        createBattle,
        makeMove,
        quitBattle,
        upgradePlayer,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
