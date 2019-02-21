import React from 'react';
import { RouteProps, match } from 'react-router-dom';

type BrowseProps = {
  match: match & {
    params: {
      path: string;
    }
  };
}

type BrowseStates = {
  fileIndexes: FileIndex[];
}

interface FileIndex {
  type: ('directory' | 'text' | 'image' | 'audio' | 'video' | 'binary');
  name: string;
  path: string;
  size: number;
  createdAtMs: Date;
  modifiedAtMs: Date;
}

export default class Browse extends React.Component<BrowseProps & RouteProps, BrowseStates> {
  constructor(props: BrowseProps & RouteProps) {
    super(props);

    this.state = {
      fileIndexes: [],
    };

    const directoryPath = props.match.params.path || '';
    const directoryUrl = `http://localhost:3000/index/${directoryPath}`;

    getFileIndexes(directoryUrl)
    .then(result => {
      this.setState({
        fileIndexes: result,
      });
      console.log(result);
    });
  }

  render() {
    return (
      <div className="Browse">
        <h1></h1>
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
