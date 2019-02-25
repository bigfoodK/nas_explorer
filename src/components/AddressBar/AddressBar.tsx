import React from 'react';
import Path from 'path';
import { RouteProps, Link } from 'react-router-dom';
import { AddressBarProps } from './addressBarInterfaces';
import './AddressBar.css';
import config from '../../config';
// TODO 오늘따라 코드가 더럽다. 푹 자고 다시하자
export default class AddressBar extends React.Component<RouteProps & AddressBarProps, any> {  
  render() {
    const viewer = this.props.match.params.viewer;
    let currentPath = this.props.match.params.path || '';

    if (viewer !== 'browse') {
      currentPath = Path.join(currentPath, '../');
    }

    const currentDirectory = currentPath;
    const upperPath = Path.join(currentDirectory, '../');
    const upperDirectoryUrl = (upperPath.startsWith('../') || upperPath.startsWith('..\\'))
      ? config.browseUrlPrefix
      : Path.join(config.browseUrlPrefix, upperPath)

    return (
      <div className = 'address-bar'>
        <Link 
          to = { upperDirectoryUrl }
          className = 'up-directory'>
          <i className = "fas fa-arrow-up" />
        </Link>
        <div className = 'address-directory-bar'>
          <ul className = 'address-directory-list'>
            { directories(currentDirectory) }
          </ul>
        </div>
      </div>
    )
  }
}

function directories(directoryPath: string) {
  let currentPath = directoryPath;

  const directories = [];

  while(!(currentPath.startsWith('..\\') || currentPath.startsWith('../'))) {
    directories.push(
      <li 
        className = 'address-directory'
        key = { currentPath }>
        <Link
          className = 'link'
          to = { Path.join(config.browseUrlPrefix, currentPath) }>
          { `/${ Path.basename(currentPath) }` }
        </Link>
      </li>
    );
    
    currentPath = Path.join(currentPath, '../');
  }

  return directories;
}