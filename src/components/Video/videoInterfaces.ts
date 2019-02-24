import React from 'react';
import { match } from 'react-router-dom';
import { FileIndex } from '../../commonInterfaces';

export interface VideoProps {
  match: match & {
    params: {
      path: string;
    }
  };
}

export interface VideoStates {
  sortBy: string;
  videos: FileIndex[];
  nextVideo: FileIndex | null;
  currentVideo: FileIndex | null;
  previousVideo: FileIndex | null;
  currentSubtitle: FileIndex | null;
  currentVideoObjectUrl: string | null;
}

export interface VideoPlayerProps {
  videoObjectUrl: string | null;
  subtitle: FileIndex | null;
}

export interface VideoPlayerStates {
  isMouseOver: boolean;
  isMouseMove: boolean;
  isFullscreen: boolean;
  isPlaying: boolean;
  videoTime: number;
  videoVolume: number;
  videoDuration: number;
}

export interface MenuProps {
  nextVideo: FileIndex | null;
  previousVideo: FileIndex | null;
}

export interface ControlProps {
  isActive: boolean;
  isFullscreen: boolean;
  isPlaying: boolean;
  videoTime: number;
  videoVolume: number;
  videoDuration: number;
  videoTimeString: string;
  videoDurationString: string;
  handleFullscreen: Function;
  handlePlayButtonClick: () => void;
  handleVolumeButtonClick: () => void;
  handleVolumeChange: (event: React.FormEvent<HTMLInputElement>) => void;
  handleTimeChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

export interface SubtitleProps {
  videoTime: number;
  subtitle: FileIndex | null;
}

export interface SubtitleStates {
  subtitleText: JSX.Element[];
}
