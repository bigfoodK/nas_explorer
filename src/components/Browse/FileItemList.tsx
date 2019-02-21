import React from 'react';
import { FileItemListProps } from './browseInterfaces';
import FileItem from './FileItem';
import './FileItemList.css';

export default class FileItemList extends React.Component<FileItemListProps, any> {
  props: FileItemListProps;

  constructor(props: FileItemListProps) {
    super(props);

    this.props = props;
  }

  render() {
    const fileItemList = this.props.fileIndexes.map(fileIndex => {
      return (<FileItem 
        fileIndex = {fileIndex}
        renewFileIndexesState = {this.props.renewFileIndexesState}
        key = {fileIndex.path} 
      />)
    });
    return (
      <div className='file-item-list'>
        {fileItemList}
      </div>
    );
  }
}
