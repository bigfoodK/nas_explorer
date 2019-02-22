import React from 'react';
import Path from 'path';
import { RouteProps } from 'react-router-dom';
import { FileIndex, BrowseProps, BrowseStates } from './browseInterfaces';
import FileItemList from './FileItemList';

export default class Browse extends React.Component<BrowseProps & RouteProps, BrowseStates> {
  constructor(props: BrowseProps & RouteProps) {
    super(props);

    this.state = {
      fileIndexes: [],
    };
    
    this.renewFileIndexesState = this.renewFileIndexesState.bind(this);
    this.renewFileIndexesState(this.props.match.params.path);
  }

  componentWillReceiveProps(nextProps: BrowseProps & RouteProps) {
    this.renewFileIndexesState(nextProps.match.params.path);
  }

  renewFileIndexesState(directoryPath: string) {
    // URL for debug client, If you found it, Remove it
    const directoryUrl = 'http://localhost:3000' + Path.join('/index', directoryPath || '');

    getFileIndexes(directoryUrl)
    .then(result => {
      this.setState({
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

async function getFileIndexes(directoryUrl: string): Promise<FileIndex[]> {
  const response = await fetch(directoryUrl);
  const jsonBlob = await response.blob();
  const jsonText = await readFileAsTextAsync(jsonBlob);
  const json = JSON.parse(jsonText) as FileIndex[];
  return json;
}

function readFileAsTextAsync(blob: Blob): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing file index json blob."));
    };

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') resolve(result);
      reject(new DOMException("Problem parsing file index json blob. type of result is not string."));
    };

    reader.readAsText(blob);
  });
}
