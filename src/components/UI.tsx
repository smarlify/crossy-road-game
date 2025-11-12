import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { queueMove } from '@/logic/playerLogic';
import { UI_CONFIG } from '@/utils/constants';
import { signInWithGooglePopup, isUserLoggedIn } from '@/config/firebase';

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
  const getGoogleEmail = useUserStore(state => state.getGoogleEmail);
  const getGoogleDisplayName = useUserStore(state => state.getGoogleDisplayName);
  const addEntry = useLeaderboardStore(state => state.addEntry);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    // Save score if user is logged in on first game over
    if (status === 'over' && isUserLoggedIn() && !scoreSaved) {
      const email = getGoogleEmail();
      const displayName = getGoogleDisplayName();
      const name = displayName || email?.split('@')[0] || 'Anonymous';
      if (email && score > 0) {
        addEntry({
          id: email,
          name: name,
          score: score,
        }).then(() => {
          setScoreSaved(true);
        }).catch(error => {
          console.error('Failed to save score:', error);
        });
      }
    }
  }, [status, addEntry, score, getGoogleEmail, getGoogleDisplayName, scoreSaved]);

  // Only render if game is over
  if (status !== 'over') return null;

  const handleRetry = () => {
    reset();
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const email = await signInWithGooglePopup();
      if (email && score > 0) {
        // Get display name from Google account
        const displayName = getGoogleDisplayName();
        const name = displayName || email.split('@')[0];

        // Save the score with the Google display name
        await addEntry({
          id: email,
          name: name,
          score: score,
        });
        setScoreSaved(true);
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Get player name from Google account or userData
  const displayName = getGoogleDisplayName();
  const playerName = displayName || userData?.name || null;

  return (
    <div id="result-container">
      <div id="result">
        <h1>Game Over</h1>
        {playerName && <p className="player-name">Player: {playerName}</p>}
        <p>Your score: {score}</p>
        {(isUserLoggedIn() || userData) && <button onClick={handleRetry}>Retry</button>}
        {!isUserLoggedIn() && !userData && (
          <div id="sign-in-section">
            <p id="sign-in-prompt">Want to save your score? Sign in with Google!</p>
            <button
              id="sign-in-button"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              {isSigningIn ? '🔄 Signing in...' : '🎮 Sign In with Google'}
            </button>
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
