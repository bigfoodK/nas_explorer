import React from 'react';
import Path from 'path';
import { RouteProps } from 'react-router-dom';
import { BrowseProps, BrowseStates } from './browseInterfaces';
import { getFileIndexesAsync, getFileIndexCompareFunction } from '../../commonUtils';
import FileItemList from './FileItemList';
import './Browse.css';
import config from '../../config';

export default class Browse extends React.Component<BrowseProps & RouteProps, BrowseStates> {
  constructor(props: BrowseProps & RouteProps) {
    super(props);

    this.state = {
      sortBy: 'name',
      fileIndexes: [],
    };
    
    this.renewFileIndexesState = this.renewFileIndexesState.bind(this);
    this.renewFileIndexesState(this.props.match.params.path);
  }

  componentWillReceiveProps(nextProps: BrowseProps & RouteProps) {
    this.renewFileIndexesState(nextProps.match.params.path);
  }

  renewFileIndexesState(directoryPath: string) {
    const directoryUrl = config.debugHost + Path.join(config.indexUrlPrefix, directoryPath || '');

    getFileIndexesAsync(directoryUrl)
    .then(result => {
      result.sort(getFileIndexCompareFunction('name'));
      this.setState({
        sortBy: this.state.sortBy,
        fileIndexes: result,
      });
    });
  }

  render() {
    return (
      <div className="browse">
        <FileItemList 
          fileIndexes = {this.state.fileIndexes}
        />
      </div>
    );
  }
}
