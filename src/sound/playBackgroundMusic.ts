import { Audio, AudioLoader, AudioListener } from 'three';

let backgroundMusic: Audio | null = null;
let audioListener: AudioListener | null = null;

export function initBackgroundMusic(listener: AudioListener): void {
  audioListener = listener;
  const audioLoader = new AudioLoader();

  backgroundMusic = new Audio(audioListener);

  audioLoader.load('/audio/bg-music.mp3', buffer => {
    if (backgroundMusic) {
      backgroundMusic.setBuffer(buffer);
      backgroundMusic.setLoop(true);
      backgroundMusic.setVolume(0.3); // Lower volume for background music
    }
  });
}

export function playBackgroundMusic(): void {
  if (backgroundMusic && backgroundMusic.buffer && !backgroundMusic.isPlaying) {
    backgroundMusic.play();
  }
}

export function stopBackgroundMusic(): void {
  if (backgroundMusic && backgroundMusic.isPlaying) {
    backgroundMusic.stop();
  }
}

export function pauseBackgroundMusic(): void {
  if (backgroundMusic && backgroundMusic.isPlaying) {
    backgroundMusic.pause();
  }
}

export function resumeBackgroundMusic(): void {
  if (backgroundMusic && backgroundMusic.buffer && !backgroundMusic.isPlaying) {
    backgroundMusic.play();
  }
}
