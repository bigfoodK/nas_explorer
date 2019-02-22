import React from 'react';
import Path from 'path';
import { FileItemProps, FileIndex } from './browseInterfaces';
import { Link } from 'react-router-dom'
import './FileItem.css';

export default class FileItem extends React.Component<FileItemProps, any> {
  constructor(props: FileItemProps) {
    super(props);
  }

  render() {
    const fileIndex = this.props.fileIndex;
    const url = getProperUrl(fileIndex);

    return (
      <div className='file-item'>
        <Link 
          to={url} 
        >
          {fileIndex.name}, {fileIndex.size}, {fileIndex.type}
        </Link>
      </div>
    );
  }
}

function getProperUrl(fileIndex: FileIndex) {
  const filePath = fileIndex.path;

  switch(fileIndex.type) {
    case 'directory':
      return Path.join('/explore/browse', filePath);

    case 'text':
      return Path.join('/explore/text', filePath);

    case 'image':
      return Path.join('/explore/image', filePath);

    case 'audio':
      return Path.join('/explore/audio', filePath);

    case 'video':
      return Path.join('/explore/video', filePath);

    default:
      return Path.join('/explore/download', filePath);
  }
}