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
  currentVideoUrl: string | null;
  currentSubtitle: FileIndex | null;
}

export interface VideoPlayerProps {
  videoUrl: string | null;
  subtitle: FileIndex | null;
}

export interface VideoPlayerStates {
  isMouseOver: boolean;
  isMouseOverControl: boolean;
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
  handleFullscreen: () => void;
  handlePlayButtonClick: () => void;
  handleMouseEnterControl: () => void;
  handleMouseLeaveControl: () => void;
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
