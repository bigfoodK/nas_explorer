import { match } from 'react-router-dom';
import { FileIndex } from '../../commonInterfaces';

export interface BrowseProps {
  match: match & {
    params: {
      path: string;
    }
  };
}

export interface BrowseStates {
  sortBy: string;
  fileIndexes: FileIndex[];
}

export interface FileItemProps {
  fileIndex: FileIndex;
}

export interface FileItemListProps {
  fileIndexes: FileIndex[];
}