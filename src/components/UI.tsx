import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
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
  const userData = useUserStore(state => state.userData);
  const setUserName = useUserStore(state => state.setUserName);

  const leaderboard = useLeaderboardStore(state => state.entries);
  const loading = useLeaderboardStore(state => state.loading);
  const fetchLeaderboard = useLeaderboardStore(state => state.fetchLeaderboard);

  const [nameInput, setNameInput] = useState('');
  const [showNameForm, setShowNameForm] = useState(false);

  // Fetch leaderboard when game is over
  useEffect(() => {
    if (status === 'over') {
      fetchLeaderboard('crossy-road');
    }
  }, [status, fetchLeaderboard]);

  if (status === 'running') return null;

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput);
      setShowNameForm(false);
      reset();
    }
  };

  const handleRetry = () => {
    if (userData) {
      reset();
    } else {
      setShowNameForm(true);
    }
  };

  if (showNameForm) {
    return (
      <div id="result-container">
        <div id="result">
          <h1>Game Over</h1>
          <p>Your score: {score}</p>
          <form onSubmit={handleNameSubmit} id="name-form">
            <label htmlFor="player-name">Enter your name:</label>
            <input
              id="player-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              autoFocus
              maxLength={20}
            />
            <button type="submit">Start</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div id="result-container">
      <div id="result">
        <h1>Game Over</h1>
        {userData && <p className="player-name">Player: {userData.name}</p>}
        <p>Your score: {score}</p>

        {/* Leaderboard */}
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : leaderboard.length > 0 ? (
            <ol className="leaderboard-list">
              {leaderboard.map((entry, index) => (
                <li
                  key={`${entry.id}-${entry.timestamp}`}
                  className={entry.id === userData?.id && entry.score === score ? 'current-player' : ''}
                >
                  <span className="rank">{index + 1}.</span>
                  <span className="name">{entry.name}</span>
                  <span className="score">{entry.score}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="no-scores">No scores yet. Be the first!</p>
          )}
        </div>

        <button onClick={handleRetry}>Retry</button>
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
