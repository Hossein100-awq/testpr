// backgrounds
import saiman from './background/saiman.jpg';
import astral from './background/astral.jpg';
import eoaalien from './background/eoaalien.jpg';
import panight from './background/panight.jpg';
import heroImg from './background/hero-img.jpg';

// cards
import ace from './Ace.png';
import bakezori from './Bakezori.png';
import blackSolus from './Black_Solus.png';
import calligrapher from './Calligrapher.png';
import chakriAvatar from './Chakri_Avatar.png';
import coalfist from './Coalfist.png';
import desolator from './Desolator.png';
import duskRigger from './Dusk_Rigger.png';
import flamewreath from './Flamewreath.png';
import furiosa from './Furiosa.png';
import geomancer from './Geomancer.png';
import goreHorn from './Gore_Horn.png';
import heartseeker from './Heartseeker.png';
import jadeMonk from './Jade_Monk.png';
import kaidoExpert from './Kaido_Expert.png';
import katara from './Katara.png';
import kiBeholder from './Ki_Beholder.png';
import kindling from './Kindling.png';
import lanternFox from './Lantern_Fox.png';
import mizuchi from './Mizuchi.png';
import orizuru from './Orizuru.png';
import scarletViper from './Scarlet_Viper.png';
import stormKage from './Storm_Kage.png';
import suzumebachi from './Suzumebachi.png';
import tuskBoar from './Tusk_Boar.png';
import twilightFox from './Twilight_Fox.png';
import voidTalon from './Void_Talon.png';
import whiplash from './Whiplash.png';
import widowmaker from './Widowmaker.png';
import xho from './Xho.png';

// logo
import logo from './logo.svg';

// icon
import attack from './attack.png';
import defense from './defense.png';
import alertIcon from './alertIcon.svg';
import AlertIcon from './AlertIcon.jsx';

// players
import player01 from './player01.png';
import player02 from './player02.png';

// sounds
import attackSound from './sounds/attack.wav';
import defenseSound from './sounds/defense.mp3';
import explosion from './sounds/explosion.mp3';

export const characters = [
  { id: 'ace', name: 'Ace', image: ace },
  { id: 'bakezori', name: 'Bakezori', image: bakezori },
  { id: 'black-solus', name: 'Black Solus', image: blackSolus },
  { id: 'calligrapher', name: 'Calligrapher', image: calligrapher },
  { id: 'chakri-avatar', name: 'Chakri Avatar', image: chakriAvatar },
  { id: 'coalfist', name: 'Coalfist', image: coalfist },
  { id: 'desolator', name: 'Desolator', image: desolator },
  { id: 'dusk-rigger', name: 'Dusk Rigger', image: duskRigger },
  { id: 'flamewreath', name: 'Flamewreath', image: flamewreath },
  { id: 'furiosa', name: 'Furiosa', image: furiosa },
  { id: 'geomancer', name: 'Geomancer', image: geomancer },
  { id: 'gore-horn', name: 'Gore Horn', image: goreHorn },
  { id: 'heartseeker', name: 'Heartseeker', image: heartseeker },
  { id: 'jade-monk', name: 'Jade Monk', image: jadeMonk },
  { id: 'kaido-expert', name: 'Kaido Expert', image: kaidoExpert },
  { id: 'katara', name: 'Katara', image: katara },
  { id: 'ki-beholder', name: 'Ki Beholder', image: kiBeholder },
  { id: 'kindling', name: 'Kindling', image: kindling },
  { id: 'lantern-fox', name: 'Lantern Fox', image: lanternFox },
  { id: 'mizuchi', name: 'Mizuchi', image: mizuchi },
  { id: 'orizuru', name: 'Orizuru', image: orizuru },
  { id: 'scarlet-viper', name: 'Scarlet Viper', image: scarletViper },
  { id: 'storm-kage', name: 'Storm Kage', image: stormKage },
  { id: 'suzumebachi', name: 'Suzumebachi', image: suzumebachi },
  { id: 'tusk-boar', name: 'Tusk Boar', image: tuskBoar },
  { id: 'twilight-fox', name: 'Twilight Fox', image: twilightFox },
  { id: 'void-talon', name: 'Void Talon', image: voidTalon },
  { id: 'whiplash', name: 'Whiplash', image: whiplash },
  { id: 'widowmaker', name: 'Widowmaker', image: widowmaker },
  { id: 'xho', name: 'Xho', image: xho },
];

export const allCards = characters.map(({ image }) => image);

export {
  saiman,
  astral,
  eoaalien,
  panight,
  heroImg,

  ace,
  bakezori,
  blackSolus,
  calligrapher,
  chakriAvatar,
  coalfist,
  desolator,
  duskRigger,
  flamewreath,
  furiosa,
  geomancer,
  goreHorn,
  heartseeker,
  jadeMonk,
  kaidoExpert,
  katara,
  kiBeholder,
  kindling,
  lanternFox,
  mizuchi,
  orizuru,
  scarletViper,
  stormKage,
  suzumebachi,
  tuskBoar,
  twilightFox,
  voidTalon,
  whiplash,
  widowmaker,
  xho,

  logo,

  attack,
  defense,
  alertIcon,
  AlertIcon,

  player01,
  player02,

  attackSound,
  defenseSound,
  explosion,
};

export const battlegrounds = [
  { id: 'bg-saiman', image: saiman, name: 'Saiman' },
  { id: 'bg-astral', image: astral, name: 'Astral' },
  { id: 'bg-eoaalien', image: eoaalien, name: 'Eoaalien' },
  { id: 'bg-panight', image: panight, name: 'Panight' },
];

export const gameRules = [
  'Card with the same defense and attack point will cancel each other out.',
  'Attack points from the attacking card will deduct the opposing player’s health points.',
  'If P1 does not defend, their health wil be deducted by P2’s attack.',
  'If P1 defends, P2’s attack is equal to P2’s attack - P1’s defense.',
  'If a player defends, they refill 3 Mana',
  'If a player attacks, they spend 3 Mana',
];