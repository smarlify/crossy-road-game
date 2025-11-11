/**
 * Leaderboard Service for Crossy Road
 *
 * Handles direct score submission to Firebase using Google account data
 */

import { firestore } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

const GAME_NAME = 'Crossy Road';

interface LeaderboardEntry {
  name: string;
  email?: string;
  score: number;
  level?: number;
  gameName: string;
  timestamp: unknown;
  crossDomainUserId: string;
  isPersonalRecord: boolean;
}

/**
 * Generate a consistent cross-domain user ID from email
 */
function getCrossDomainUserIdFromEmail(email: string): string {
  // Create a simple hash from email for consistent ID
  return 'user_email_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Submit a score to the leaderboard
 */
export async function submitScoreToLeaderboard(
  score: number,
  name: string,
  email: string
): Promise<void> {
  try {
    if (!email || !name || score <= 0) {
      console.log('Invalid score submission data:', { score, name, email });
      return;
    }

    const crossDomainUserId = getCrossDomainUserIdFromEmail(email);

    console.log('📤 [Crossy Road] Submitting score to Firebase:', {
      name,
      email,
      score,
      crossDomainUserId,
    });

    // Create leaderboard entry (omit undefined fields)
    const leaderboardEntry: any = {
      name,
      email,
      score,
      gameName: GAME_NAME,
      timestamp: serverTimestamp(),
      crossDomainUserId,
      isPersonalRecord: true,
    };

    // Add to leaderboard collection
    const leaderboardRef = collection(firestore, 'leaderboard');
    await setDoc(doc(leaderboardRef), leaderboardEntry);

    // Update personal record
    await updatePersonalRecord(crossDomainUserId, score);

    // Update user profile
    await updateUserProfile(crossDomainUserId, name, email);

    console.log('✅ [Crossy Road] Score submitted successfully to Firebase');
  } catch (error) {
    console.error('❌ [Crossy Road] Error submitting to leaderboard:', error);
    throw error;
  }
}

/**
 * Update personal record for a user
 */
async function updatePersonalRecord(
  crossDomainUserId: string,
  score: number
): Promise<void> {
  try {
    const personalRecordsRef = doc(
      firestore,
      'personalRecords',
      crossDomainUserId
    );
    const personalRecordsDoc = await getDoc(personalRecordsRef);

    const personalRecords = personalRecordsDoc.exists()
      ? personalRecordsDoc.data()
      : {};

    // Update the record for this game (omit level since it's not used)
    personalRecords[GAME_NAME] = {
      score,
      timestamp: new Date().toISOString(),
      gameName: GAME_NAME,
    };

    await setDoc(personalRecordsRef, personalRecords, { merge: true });
    console.log('📊 [Crossy Road] Personal record updated');
  } catch (error) {
    console.error('Error updating personal record:', error);
  }
}

/**
 * Update user profile with name and email
 */
async function updateUserProfile(
  crossDomainUserId: string,
  name: string,
  email: string
): Promise<void> {
  try {
    const userProfileRef = doc(firestore, 'userProfiles', crossDomainUserId);
    const userProfile = {
      name: name.trim(),
      email: email.trim(),
      updatedAt: serverTimestamp(),
      crossDomainUserId,
    };

    await setDoc(userProfileRef, userProfile, { merge: true });
    console.log('👤 [Crossy Road] User profile updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
}
