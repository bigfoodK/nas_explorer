import React from 'react';
import { ControlProps } from './videoInterfaces';
import './Control.css'

export default class Control extends React.Component<ControlProps, {}> {


  componentWillReceiveProps(nextProps: ControlProps) {
  }

  render() {
    const playButton = () => {
      const icon = this.props.isPlaying
        ? <i className = "fas fa-pause" />
        : <i className = "fas fa-play" />

      return (
        <li className = 'play-button-container'>
          <a onClick = { this.props.handlePlayButtonClick }>
            { icon }
          </a>
        </li>
      )
    }

    const progrresString = () => {
      return (
        <li className = 'progrres-string-container'>
          { this.props.videoTimeString } / { this.props.videoDurationString }
        </li>
      )
    }

    const subtitleButton = () => {
      const languages = this.props.subtitleLanguages
      
      const dropdownItems = languages.map(language => {
        return (
          <div 
            className = 'subtitle-dropdown-item'
            onClick = { () => this.props.setSubtitleLanguage(language) }
            key = { language }>
            { language }
          </div>
        )
      });
      
      return (
        <div className = 'subtitle-button-container'>
          <i className = "fas fa-closed-captioning" />
          <div className = 'subtitle-dropdown-container'>
            <div 
              className = 'subtitle-dropdown-item'
              onClick = { () => this.props.setSubtitleLanguage('') }>
              no sub
            </div>
            { dropdownItems }
          </div>
        </div>
      )
    }

    const volumeButton = () => {
      const icon = this.props.videoVolume
        ? <i className = "fas fa-volume-up" />
        : <i className = "fas fa-volume-mute" />

      return (
        <li className = 'volume-button-container'>
          <a onClick = { this.props.handleVolumeButtonClick }>
            { icon }
          </a>
        </li>
      )
    }

    const volumeSlide = () => {
      return (
        <li className = 'volume-slide-container'>
          <input
            className = "slide" 
            type = "range" 
            min = "0" 
            max = "1" 
            step = '0.000001'
            value = { this.props.videoVolume }
            onChange = { this.props.handleVolumeChange }
          />
        </li>
      )
    }

    const progressSlide = () => {
      return (
        <li className = 'progress-slide-container'>
          <input
            className = "slide" 
            type = "range" 
            min = "0" 
            max = { this.props.videoDuration }
            step = '0.01'
            value = { this.props.videoTime } 
            onChange = { this.props.handleTimeChange }
          />
        </li>
      )
    }

    return (
      <ul 
        className = 'control-container'
        style = {{opacity: this.props.isActive ? 1 : 0}}
      >
        {playButton()}
        {progrresString()}
        {volumeSlide()}
        {volumeButton()}
        {subtitleButton()}
        <br />
        {progressSlide()}
      </ul>
    )
  }
}
