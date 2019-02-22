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
  currentVideoObjectUrl: string | null;
}

export interface VideoPlayerProps {
  videoObjectUrl: string | null;
}

export interface MenuProps {
  nextVideo: FileIndex | null;
  previousVideo: FileIndex | null;
}
