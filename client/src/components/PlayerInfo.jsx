import ReactTooltip from 'react-tooltip';
import styles from '../styles';

const PlayerInfo = ({ player, playerIcon, mt }) => {
  const maxHealth = player.maxHealth || 25;
  const healthPercent = Math.max(0, Math.min(100, (player.health / maxHealth) * 100));
  const healthColor = healthPercent >= 48 ? 'bg-green-500' : healthPercent >= 24 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className={`${styles.flexCenter} ${mt ? 'mt-4' : 'mb-4'}`}>
      <img data-for={`Player-${mt ? '1' : '2'}`} data-tip src={playerIcon} alt={player.playerName} className="w-14 h-14 object-contain rounded-full" />

      <div
        data-for={`Health-${mt ? '1' : '2'}`}
        data-tip={`Health: ${player.health}/${maxHealth}`}
        className={`${styles.playerHealth} battle-health-bar`}
      >
        <span className="shrink-0 font-rajdhani text-sm font-bold text-white">{player.health}/{maxHealth}</span>
        <div
          role="progressbar"
          aria-label={`${player.playerName} health`}
          aria-valuemin={0}
          aria-valuemax={maxHealth}
          aria-valuenow={player.health}
          className="h-3 min-w-0 flex-1 overflow-hidden rounded-sm bg-white/20"
        >
          <div className={`h-full transition-all ${healthColor}`} style={{ width: `${healthPercent}%` }} />
        </div>
      </div>

    <div
      data-for={`Mana-${mt ? '1' : '2'}`}
      data-tip="Mana"
      className={`${styles.flexCenter} ${styles.glassEffect} ${styles.playerMana} ${mt ? 'battle-opponent-mana' : ''}`}
    >
      {player.mana || 0}
    </div>

    <ReactTooltip id={`Player-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0">
      <p className={styles.playerInfo}>
        <span className={styles.playerInfoSpan}>Name:</span> {player?.playerName}
      </p>
      <p className={styles.playerInfo}>
        <span className={styles.playerInfoSpan}>Address:</span> {player?.playerAddress?.slice(0, 10)}
      </p>
    </ReactTooltip>
    <ReactTooltip id={`Health-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0" />
    <ReactTooltip id={`Mana-${mt ? '1' : '2'}`} effect="solid" backgroundColor="#7f46f0" />
    </div>
  );
};

export default PlayerInfo;
