import { match } from 'react-router-dom';

export interface FileIndex {
  type: ('directory' | 'text' | 'image' | 'audio' | 'video' | 'binary');
  name: string;
  path: string;
  size: number;
  createdAtMs: number;
  modifiedAtMs: number;
}

export interface VideoProps {
  match: match & {
    params: {
      path: string;
    }
  };
}

export interface VideoStates {
  videos: FileIndex[];
  nextVideo: FileIndex | null;
  currentVideo: FileIndex | null;
  previousVideo: FileIndex | null;
  currentVideoObjectUrl: string | null;
}

export interface VideoPlayerProps {
  videoObjectUrl: string | null;
}