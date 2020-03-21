import React from 'react';
import { RouteProps } from 'react-router-dom';
import { BrowseProps, BrowseStates } from './browseInterfaces';
import { getFileIndexCompareFunction } from '../../commonUtils';
import FileItemList from './FileItemList';
import RestAPI from '../../restAPI';;
import './Browse.css';

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
    RestAPI.Explore.getFileIndexesAsync(directoryPath)
    .then(response => {
      if (!response.isSuccessful) {
        console.error(response.message);
        return;
      }
      const { fileIndexes } = response.data;
      fileIndexes.sort(getFileIndexCompareFunction('name'));
      this.setState({
        sortBy: this.state.sortBy,
        fileIndexes,
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
