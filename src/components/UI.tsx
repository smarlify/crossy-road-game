import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { queueMove } from '@/logic/playerLogic';
import { UI_CONFIG } from '@/utils/constants';
import { getTopScores, saveLeaderboardScore } from '@/utils/leaderboard';

export function Score() {
  const score = useGameStore(state => state.score);
  return <div id="score">{score}</div>;
}

export function Controls() {
  useEventListeners();
  return (
    <div id="controls">
      <div>
        <button onClick={() => queueMove('forward')}>▲</button>
        <button onClick={() => queueMove('left')}>◀</button>
        <button onClick={() => queueMove('backward')}>▼</button>
        <button onClick={() => queueMove('right')}>▶</button>
      </div>
    </div>
  );
}

export function Result() {
  const status = useGameStore(state => state.status);
  const score = useGameStore(state => state.score);
  const reset = useGameStore(state => state.reset);
  const playCount = useGameStore(state => state.playCount);

  const [existingName, setExistingName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [leaderboard, setLeaderboard] = useState<Array<{ name: string; score: number }>>([]);

  const NAME_KEY = 'crossy_player_name';
  const ID_KEY = 'crossy_player_id';

  useEffect(() => {
    if (status !== 'running' && typeof window !== 'undefined') {
      try {
        const storedName = localStorage.getItem(NAME_KEY);
        setExistingName(storedName);
      } catch {
        // ignore
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === 'over') {
      getTopScores('crossy-road', 10).then(entries => {
        setLeaderboard(entries.map(e => ({ name: e.name, score: e.score })));
      }).catch(() => setLeaderboard([]));
    }
  }, [status]);

  if (status === 'running') return null;

  const ensureUserId = () => {
    if (typeof window === 'undefined') return;
    try {
      let id = localStorage.getItem(ID_KEY);
      if (!id) {
        const generated = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? (crypto as any).randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(ID_KEY, generated);
      }
    } catch {
      // ignore
    }
  };

  const submitScoreThenReset = async (finalName: string) => {
    ensureUserId();
    const userId = typeof window !== 'undefined' ? (localStorage.getItem(ID_KEY) || 'unknown') : 'unknown';
    try {
      await saveLeaderboardScore('crossy-road', { userId, name: finalName || 'Anonymous', score });
    } catch {
      // ignore failures
    }
    reset();
  };

  const handleSaveNameAndRetry = () => {
    const name = nameInput.trim();
    if (!name) return;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(NAME_KEY, name);
        setExistingName(name);
      } catch {
        // ignore
      }
    }
    submitScoreThenReset(name);
  };

  const shouldPromptForName = playCount === 0 && !existingName;

  return (
    <div id="result-container">
      <div id="result">
        <h1>Game Over</h1>
        <p>Your score: {score}</p>
        {existingName && (
          <p>Player: {existingName}</p>
        )}
        {shouldPromptForName ? (
          <>
            <p>Enter your name to continue:</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSaveNameAndRetry();
              }}
              placeholder="Your name"
              aria-label="Player name"
              autoFocus
            />
            <button onClick={handleSaveNameAndRetry}>Save & Retry</button>
          </>
        ) : (
          <button onClick={() => submitScoreThenReset(existingName || 'Anonymous')}>Retry</button>
        )}
        {leaderboard.length > 0 && (
          <div style={{ marginTop: 16, width: '100%', maxWidth: 320 }}>
            <h3 style={{ margin: '12px 0 8px 0' }}>Leaderboard</h3>
            <ol style={{ paddingLeft: 16, margin: 0 }}>
              {leaderboard.map((e, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{e.name || 'Anonymous'}</span>
                  <span>{e.score}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export function CornScore() {
  const cornCount = useGameStore(state => state.cornCount);
  const { MAX_CORN_DISPLAY, CORN_SCORE_STYLE } = UI_CONFIG;

  let corns = '';
  if (cornCount <= MAX_CORN_DISPLAY) {
    corns = '🌽'.repeat(cornCount);
  } else {
    corns = '🌽'.repeat(MAX_CORN_DISPLAY) + ` +${cornCount - MAX_CORN_DISPLAY}`;
  }

  return (
    <div id="corn-score" style={CORN_SCORE_STYLE}>
      {corns}
    </div>
  );
}

export function useEventListeners() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        queueMove('forward');
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        queueMove('backward');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        queueMove('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        queueMove('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
