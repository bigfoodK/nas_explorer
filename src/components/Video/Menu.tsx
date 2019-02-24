import React from 'react';
import Path from 'path';
import { MenuProps } from './videoInterfaces';
import { FileIndex } from '../../commonInterfaces';
import { Link } from 'react-router-dom';
import './Menu.css';
import config from '../../config';

export default class Menu extends React.Component<MenuProps, any> {
  render() {
    const previousLink = generateMenuItem(this.props.previousVideo);
    const nextLink = generateMenuItem(this.props.nextVideo);

    return(
      <ul className='menu'>
        <li className='menu-item-container-left'>
          {previousLink}
        </li>
        <li className='menu-item-container-right'>
          {nextLink}
        </li>
      </ul>
    )
  }
}

function getUrl(filePath: string) {
  return Path.join(config.videoUrlPrefix, filePath);
}

function generateMenuItem(video: FileIndex | null) {
  if(!video) {
    return (
      <div className = 'menu-item unavailable'>
        영상이 없다요
      </div>
    )
  }
  return (
    <Link 
      title = {video.name}
      className = 'menu-item available'
      to = {getUrl(video.path)}
    >
      {video.name}
    </Link>
  )
}