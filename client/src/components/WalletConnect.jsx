// components/WalletConnect.jsx
//
// MetaMask-only wallet connect UI for Avax Gods (Avalanche C-Chain).
// Everything — logic and styles — in this one file. No extra packages:
// talks directly to the browser wallet via the standard EIP-1193
// provider API (window.ethereum).
//
// Usage:
//   import WalletConnect from './components/WalletConnect';
//   <WalletConnect onConnected={(address) => { ... }} />

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const AVALANCHE_MAINNET = {
  chainIdHex: '0xa86a', // 43114
  chainName: 'Avalanche C-Chain',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io'],
};

const STORAGE_KEY = 'avax_wallet_provider';

function detectMetaMask() {
  if (typeof window === 'undefined') return null;
  if (window.ethereum?.isMetaMask) {
    return { key: 'metamask', name: 'MetaMask', provider: window.ethereum };
  }
  return null;
}

function truncate(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';
}

function weiHexToAvax(weiHex) {
  try {
    const wei = BigInt(weiHex);
    const whole = wei / 1000000000000000000n;
    const frac = wei % 1000000000000000000n;
    const fracStr = frac.toString().padStart(18, '0').slice(0, 4);
    return `${whole.toString()}.${fracStr}`;
  } catch {
    return '0.0000';
  }
}

const WalletMenu = React.memo(function WalletMenu({
  address, balance, onRightChain, copied, onCopy, onDisconnect,
}) {
  return (
    <div className="wc-menu" role="menu">
      <div className="wc-menu-head">
        <span className="wc-menu-addr">{truncate(address)}</span>
        <button type="button" className="wc-menu-copy" onClick={onCopy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="wc-menu-row">
        <span>Balance</span>
        <strong>{balance || '—'} AVAX</strong>
      </div>
      <div className="wc-menu-row">
        <span>Network</span>
        <strong className={onRightChain ? 'wc-ok-text' : 'wc-warn-text'}>
          {onRightChain ? 'Avalanche C-Chain' : 'Unsupported'}
        </strong>
      </div>
      <a
        className="wc-menu-link"
        href={`${AVALANCHE_MAINNET.blockExplorerUrls[0]}/address/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        View on Snowtrace ↗
      </a>
      <button type="button" className="wc-menu-disconnect" onClick={onDisconnect}>
        Disconnect
      </button>
    </div>
  );
});

const ConnectedWallet = React.memo(function ConnectedWallet({
  address, balance, onRightChain, menuOpen, onToggleMenu,
  copied, onCopy, onDisconnect, onSwitch,
}) {
  return (
    <div className="wc-connected">
      {!onRightChain && (
        <button type="button" className="wc-chip wc-chip-warn" onClick={onSwitch}>
          <span className="wc-dot wc-dot-warn" />
          Wrong network — switch
        </button>
      )}

      <button
        type="button"
        className="wc-chip"
        onClick={onToggleMenu}
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <span className="wc-dot wc-dot-ok" />
        <span className="wc-addr">{truncate(address)}</span>
        {balance && <span className="wc-bal">{balance} AVAX</span>}
        <svg className={`wc-chev ${menuOpen ? 'wc-chev-up' : ''}`} width="12" height="12" viewBox="0 0 12 12">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {menuOpen && (
        <WalletMenu
          address={address}
          balance={balance}
          onRightChain={onRightChain}
          copied={copied}
          onCopy={onCopy}
          onDisconnect={onDisconnect}
        />
      )}
    </div>
  );
});

export default function WalletConnect({ onConnected, onDisconnected }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | connecting | connected | error
  const [errorMsg, setErrorMsg] = useState('');
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('');
  const [balance, setBalance] = useState('');
  const [copied, setCopied] = useState(false);

  const activeProviderRef = useRef(null);
  const rootRef = useRef(null);

  const metamask = useMemo(() => detectMetaMask(), []);
  const onRightChain = chainId === AVALANCHE_MAINNET.chainIdHex;

  const refreshAccountData = useCallback(async (provider, acct) => {
    try {
      const [cid, balHex] = await Promise.all([
        provider.request({ method: 'eth_chainId' }),
        provider.request({ method: 'eth_getBalance', params: [acct, 'latest'] }),
      ]);
      setChainId(cid);
      setBalance(weiHexToAvax(balHex));
    } catch {
      /* non-fatal: UI still shows the address */
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    const entry = activeProviderRef.current;
    try {
      await entry?.provider.request?.({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch {
      /* MetaMask only supports revoke on recent versions — safe to ignore */
    }
    activeProviderRef.current = null;
    setAddress('');
    setChainId('');
    setBalance('');
    setStatus('idle');
    setMenuOpen(false);
    localStorage.removeItem(STORAGE_KEY);
    onDisconnected?.();
  }, [onDisconnected]);

  const attachListeners = useCallback((provider) => {
    const handleAccounts = (accounts) => {
      if (!accounts || accounts.length === 0) {
        handleDisconnect();
      } else {
        setAddress(accounts[0]);
        refreshAccountData(provider, accounts[0]);
      }
    };
    const handleChain = (cid) => setChainId(cid);

    provider.on?.('accountsChanged', handleAccounts);
    provider.on?.('chainChanged', handleChain);
    return () => {
      provider.removeListener?.('accountsChanged', handleAccounts);
      provider.removeListener?.('chainChanged', handleChain);
    };
  }, [handleDisconnect, refreshAccountData]);

  const connect = useCallback(async () => {
    if (!metamask) return;
    setStatus('connecting');
    setErrorMsg('');
    try {
      const accounts = await metamask.provider.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) throw new Error('No account returned.');

      activeProviderRef.current = metamask;
      setAddress(accounts[0]);
      setStatus('connected');
      localStorage.setItem(STORAGE_KEY, metamask.key);
      attachListeners(metamask.provider);
      await refreshAccountData(metamask.provider, accounts[0]);
      onConnected?.(accounts[0]);
    } catch (err) {
      setStatus('error');
      if (err?.code === 4001) setErrorMsg('Connection request was rejected.');
      else if (err?.code === -32002) setErrorMsg('A connection request is already pending — check MetaMask.');
      else setErrorMsg(err?.message || 'Could not connect to MetaMask.');
    }
  }, [metamask, attachListeners, refreshAccountData, onConnected]);

  const switchToAvalanche = useCallback(async () => {
    const entry = activeProviderRef.current;
    if (!entry) return;
    try {
      await entry.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_MAINNET.chainIdHex }],
      });
    } catch (err) {
      if (err?.code === 4902) {
        try {
          await entry.provider.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_MAINNET],
          });
        } catch {
          setErrorMsg('Could not add Avalanche network to MetaMask.');
        }
      } else {
        setErrorMsg('Could not switch network.');
      }
    }
  }, []);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  }, [address]);

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  useEffect(() => {
    if (!metamask) return;
    if (localStorage.getItem(STORAGE_KEY) !== metamask.key) return;

    (async () => {
      try {
        const accounts = await metamask.provider.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          activeProviderRef.current = metamask;
          setAddress(accounts[0]);
          setStatus('connected');
          attachListeners(metamask.provider);
          refreshAccountData(metamask.provider, accounts[0]);
        }
      } catch {
        /* ignore — user will just see the connect button */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="wc-root" ref={rootRef}>
      <style>{css}</style>

      {status === 'connected' ? (
        <ConnectedWallet
          address={address}
          balance={balance}
          onRightChain={onRightChain}
          menuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          copied={copied}
          onCopy={copyAddress}
          onDisconnect={handleDisconnect}
          onSwitch={switchToAvalanche}
        />
      ) : metamask ? (
        <>
          <button type="button" className="wc-connect-btn" onClick={connect} disabled={status === 'connecting'}>
            {status === 'connecting' ? (
              <>
                <span className="wc-spinner" /> Connecting…
              </>
            ) : (
              'Connect MetaMask'
            )}
          </button>
          {errorMsg && <p className="wc-inline-error">{errorMsg}</p>}
        </>
      ) : (
        <a
          className="wc-connect-btn wc-connect-btn-link"
          href="https://metamask.io"
          target="_blank"
          rel="noreferrer"
        >
          Install MetaMask ↗
        </a>
      )}
    </div>
  );
}

const css = `
.wc-root{
  --wc-void:#0a0908; --wc-panel:#15100e; --wc-ember:#e3503f; --wc-gold:#c9a24b;
  --wc-bone:#f4ede0; --wc-parchment:#b9ae95; --wc-ok:#5bc98a; --wc-warn:#e3a53f;
  position:relative; display:inline-block;
  font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif; color:var(--wc-bone);
}
.wc-root *,.wc-root *::before,.wc-root *::after{box-sizing:border-box}

.wc-connect-btn{
  display:inline-flex; align-items:center; gap:8px; height:42px; padding:0 20px; cursor:pointer;
  background:linear-gradient(180deg,#e8574a,var(--wc-ember) 55%,#c03e30);
  color:#190604; border:1px solid rgba(255,206,190,.45); font-weight:700; font-size:14px;
  border-radius:8px; transition:filter .2s ease, box-shadow .2s ease;
  box-shadow:0 10px 22px -10px rgba(227,80,63,.6); text-decoration:none;
}
.wc-connect-btn:hover:not(:disabled){filter:brightness(1.08)}
.wc-connect-btn:disabled{opacity:.75; cursor:not-allowed}
.wc-connect-btn:focus-visible{outline:2px solid var(--wc-gold); outline-offset:2px}
.wc-connect-btn-link{background:var(--wc-panel); color:var(--wc-gold); border:1px solid rgba(201,162,75,.4); box-shadow:none}
.wc-connect-btn-link:hover{background:rgba(201,162,75,.12)}

.wc-inline-error{margin:8px 0 0; font-size:12.5px; color:#ffb3a8}

.wc-spinner{width:14px; height:14px; border-radius:50%; border:2px solid rgba(25,6,4,.35);
  border-top-color:#190604; animation:wc-spin .7s linear infinite}
@keyframes wc-spin{to{transform:rotate(360deg)}}

.wc-connected{position:relative; display:flex; align-items:center; gap:8px}
.wc-chip{
  display:inline-flex; align-items:center; gap:8px; height:40px; padding:0 14px; cursor:pointer;
  background:var(--wc-panel); border:1px solid rgba(201,162,75,.35); border-radius:8px;
  color:var(--wc-bone); font-size:13.5px; font-weight:600;
}
.wc-chip:hover{border-color:rgba(201,162,75,.6)}
.wc-chip:focus-visible{outline:2px solid var(--wc-gold); outline-offset:2px}
.wc-chip-warn{border-color:rgba(227,165,63,.5); color:var(--wc-warn)}

.wc-dot{width:7px; height:7px; border-radius:50%; flex:none}
.wc-dot-ok{background:var(--wc-ok); box-shadow:0 0 6px var(--wc-ok)}
.wc-dot-warn{background:var(--wc-warn); box-shadow:0 0 6px var(--wc-warn)}

.wc-addr{font-variant-numeric:tabular-nums}
.wc-bal{color:var(--wc-parchment); font-weight:500; padding-left:6px; border-left:1px solid rgba(201,162,75,.25)}
.wc-chev{transition:transform .15s ease}
.wc-chev-up{transform:rotate(180deg)}

.wc-menu{
  position:absolute; top:calc(100% + 10px); right:0; width:270px; z-index:30;
  background:var(--wc-panel); border:1px solid rgba(201,162,75,.35); border-radius:10px;
  box-shadow:0 24px 50px -16px rgba(0,0,0,.65); padding:14px; animation:wc-pop .14s ease-out;
}
@keyframes wc-pop{from{opacity:0; transform:translateY(-4px)}to{opacity:1; transform:translateY(0)}}
.wc-menu-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px}
.wc-menu-addr{font-weight:700; font-size:14px}
.wc-menu-copy{background:none; border:1px solid rgba(201,162,75,.4); color:var(--wc-gold);
  font-size:12px; padding:4px 10px; border-radius:6px; cursor:pointer}
.wc-menu-copy:hover{background:rgba(201,162,75,.12)}
.wc-menu-row{display:flex; justify-content:space-between; font-size:13px; padding:7px 0;
  border-top:1px solid rgba(255,255,255,.06); color:var(--wc-parchment)}
.wc-ok-text{color:var(--wc-ok)}
.wc-warn-text{color:var(--wc-warn)}
.wc-menu-link{display:block; margin:10px 0 12px; font-size:13px; color:var(--wc-gold); text-decoration:none}
.wc-menu-link:hover{text-decoration:underline}
.wc-menu-disconnect{
  width:100%; height:38px; border-radius:7px; border:1px solid rgba(227,80,63,.4);
  background:rgba(227,80,63,.08); color:#ff9387; font-weight:600; font-size:13px; cursor:pointer;
}
.wc-menu-disconnect:hover{background:rgba(227,80,63,.16)}

@media (prefers-reduced-motion:reduce){
  .wc-menu, .wc-spinner, .wc-chev{animation:none !important; transition:none !important}
}
`;