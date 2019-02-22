import React from 'react';
import { FileItemProps } from './browseInterfaces';
import { Link } from 'react-router-dom'
import './FileItem.css';

export default class FileItem extends React.Component<FileItemProps, any> {
  constructor(props: FileItemProps) {
    super(props);
  }

  render() {
    const fileIndex = this.props.fileIndex;
    const url = fileIndex.type === 'directory'
    ? `/explore/browse${fileIndex.path}`
    : '.';

    return (
      <div className='file-item'>
        <Link 
          to={url} 
          onClick={() => this.props.renewFileIndexesState(fileIndex.path)}
        >
          {fileIndex.name}, {fileIndex.size}, {fileIndex.type}
        </Link>
      </div>
    );
  }
}