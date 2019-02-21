import React from 'react';
import { FileItemProps } from './browseInterfaces';
import { Link } from 'react-router-dom'
import './FileItem.css';

export default class FileItem extends React.Component<FileItemProps, any> {
  props: FileItemProps;

  constructor(props: FileItemProps) {
    super(props);
    this.props = props;
  }

  render() {
    const url = this.props.fileIndex.type === 'directory'
    ? `/explore/browse${this.props.fileIndex.path}`
    : '.';

    return (
      <div className='file-item'>
        <Link 
          to={url} 
          onClick={() => this.props.renewFileIndexesState(this.props.fileIndex.path)}
        >
          {this.props.fileIndex.name}, {this.props.fileIndex.size}, {this.props.fileIndex.type}
        </Link>
      </div>
    );
  }
}