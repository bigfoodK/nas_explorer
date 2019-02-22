import React from 'react';
import Path from 'path';
import { MenuProps, FileIndex } from './videoInterfaces';
import { Link } from 'react-router-dom';
import './Menu.css';

export default class Menu extends React.Component<MenuProps, any> {
  constructor(props: MenuProps) {
    super(props);
  }

  generateMenuItem(video: FileIndex | null) {
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

  render() {
    const previousLink = this.generateMenuItem(this.props.previousVideo);
    const nextLink = this.generateMenuItem(this.props.nextVideo);

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
  return Path.join('/explore/video', filePath);
}