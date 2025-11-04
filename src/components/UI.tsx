import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { queueMove } from '@/logic/playerLogic';
import { UI_CONFIG } from '@/utils/constants';

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

  // Keys are namespaced to this game
  const NAME_KEY = 'crossy_player_name';
  const ID_KEY = 'crossy_player_id';

  useEffect(() => {
    if (status !== 'running' && typeof window !== 'undefined') {
      try {
        const storedName = localStorage.getItem(NAME_KEY);
        setExistingName(storedName);
      } catch (e) {
        // ignore
      }
    }
  }, [status]);

  if (status === 'running') return null;

  const ensureUserId = () => {
    if (typeof window === 'undefined') return;
    try {
      let id = localStorage.getItem(ID_KEY);
      if (!id) {
        // Prefer crypto.randomUUID when available
        const generated = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? (crypto as any).randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem(ID_KEY, generated);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleSaveNameAndRetry = () => {
    const name = nameInput.trim();
    if (!name) return;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(NAME_KEY, name);
        ensureUserId();
        setExistingName(name);
      } catch (e) {
        // ignore
      }
    }
    reset();
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
          <button onClick={reset}>Retry</button>
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
    const handleKeyDown = event => {
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
