import { characters } from '../assets';

const signatureKits = [
  { name: 'Nova Burst', type: 'burst', cost: 5, description: 'Deal attack + 5 damage.' },
  { name: 'Soul Leech', type: 'drain', cost: 4, description: 'Deal attack damage and steal 2 mana.' },
  { name: 'Second Wind', type: 'mend', cost: 4, description: 'Deal attack - 1 damage and recover 4 health.' },
  { name: 'Aegis', type: 'aegis', cost: 0, description: 'Block with defense + 5 and recover 4 mana.' },
  { name: 'Overdrive', type: 'overdrive', cost: 6, description: 'Deal double attack damage.' },
];

export const getCharacterAbilities = (characterId) => {
  const characterIndex = characters.findIndex((character) => character.id === characterId);
  const character = characters[characterIndex] || characters[0];
  const signature = signatureKits[Math.max(characterIndex, 0) % signatureKits.length];

  return [
    { id: 'strike', name: 'Strike', cost: 0, description: 'Deal attack damage. Uses no mana.' },
    { id: 'heavy', name: 'Heavy strike', cost: 5, description: 'Deal attack + 3 damage.' },
    { id: 'guard', name: 'Guard', cost: 0, description: 'Block with defense + 3 and recover 3 mana.' },
    { id: 'counter', name: 'Counter', cost: 2, description: 'Deal attack - 1 and block 2 damage.' },
    {
      id: 'signature',
      name: `${character.name}: ${signature.name}`,
      cost: signature.cost,
      description: signature.description,
      type: signature.type,
    },
  ];
};

export const isOffensiveAbility = (ability) => {
  if (!ability) return false;

  const abilityType = ability.id === 'signature' ? ability.type : ability.id;
  return abilityType !== 'guard' && abilityType !== 'aegis';
};

const abilityEffect = (ability, actor) => {
  const attackStrength = actor.attackStrength + (actor.attackBonus || 0);

  switch (ability.id === 'signature' ? ability.type : ability.id) {
    case 'strike':
      return { damage: attackStrength, shield: 0, heal: 0, manaGain: 0, manaDrain: 0 };
    case 'heavy':
      return { damage: attackStrength + 3, shield: 0, heal: 0, manaGain: 0, manaDrain: 0 };
    case 'guard':
      return { damage: 0, shield: actor.defenseStrength + 3, heal: 0, manaGain: 3, manaDrain: 0 };
    case 'counter':
      return { damage: Math.max(1, attackStrength - 1), shield: 2, heal: 0, manaGain: 0, manaDrain: 0 };
    case 'burst':
      return { damage: attackStrength + 5, shield: 0, heal: 0, manaGain: 0, manaDrain: 0 };
    case 'drain':
      return { damage: attackStrength, shield: 0, heal: 0, manaGain: 0, manaDrain: 2 };
    case 'mend':
      return { damage: Math.max(1, attackStrength - 1), shield: 0, heal: 4, manaGain: 0, manaDrain: 0 };
    case 'aegis':
      return { damage: 0, shield: actor.defenseStrength + 5, heal: 0, manaGain: 4, manaDrain: 0 };
    case 'overdrive':
      return { damage: attackStrength * 2, shield: 0, heal: 0, manaGain: 0, manaDrain: 0 };
    default:
      return { damage: 0, shield: 0, heal: 0, manaGain: 0, manaDrain: 0 };
  }
};

export const resolveAbilityExchange = (player, opponent, playerAbility, opponentAbility) => {
  const playerEffect = abilityEffect(playerAbility, player);
  const opponentEffect = abilityEffect(opponentAbility, opponent);
  const nextPlayer = { ...player };
  const nextOpponent = { ...opponent };
  const damageToPlayer = Math.max(0, opponentEffect.damage - playerEffect.shield);
  const damageToOpponent = Math.max(0, playerEffect.damage - opponentEffect.shield);

  const playerMaxMana = player.maxMana || 10;
  const opponentMaxMana = opponent.maxMana || 10;
  nextPlayer.mana = Math.min(playerMaxMana, Math.max(0, nextPlayer.mana - playerAbility.cost + playerEffect.manaGain));
  nextOpponent.mana = Math.min(opponentMaxMana, Math.max(0, nextOpponent.mana - opponentAbility.cost + opponentEffect.manaGain));
  const manaDrainedFromOpponent = Math.min(playerEffect.manaDrain, nextOpponent.mana, playerMaxMana - nextPlayer.mana);
  nextOpponent.mana -= manaDrainedFromOpponent;
  nextPlayer.mana += manaDrainedFromOpponent;
  const manaDrainedFromPlayer = Math.min(opponentEffect.manaDrain, nextPlayer.mana, opponentMaxMana - nextOpponent.mana);
  nextPlayer.mana -= manaDrainedFromPlayer;
  nextOpponent.mana += manaDrainedFromPlayer;
  nextPlayer.health = Math.min(player.maxHealth || 25, Math.max(0, nextPlayer.health + playerEffect.heal - damageToPlayer));
  nextOpponent.health = Math.min(opponent.maxHealth || 25, Math.max(0, nextOpponent.health + opponentEffect.heal - damageToOpponent));

  let winner = null;
  if (nextOpponent.health === 0 && nextPlayer.health === 0) {
    winner = 'draw';
  } else if (nextOpponent.health === 0) {
    winner = 'player';
  } else if (nextPlayer.health === 0) {
    winner = 'opponent';
  }

  return {
    player: nextPlayer,
    opponent: nextOpponent,
    winner,
    damageToPlayer,
    damageToOpponent,
    playerAbility,
    opponentAbility,
  };
};