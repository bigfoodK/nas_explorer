import React from 'react';
import { VideoPlayerProps } from './videoInterfaces';
import './VideoPlayer.css';

export default class VideoPlayer extends React.Component<VideoPlayerProps, any> {
  render() {
    return (
      <div className = 'video-player'>
        <video 
          src={this.props.videoObjectUrl || ''} 
          autoPlay
          controls
        />
      </div>
    );
  }
}