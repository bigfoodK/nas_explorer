import React from 'react';
import { VideoPlayerProps, VideoPlayerStates } from './videoInterfaces';
import { getStringFromSecond } from '../../commonUtils';
import Control from './Control';
import Subtitle from './Subtitle';
import './VideoPlayer.css';

export default class VideoPlayer extends React.Component<VideoPlayerProps, VideoPlayerStates> {
  video: React.RefObject<HTMLVideoElement>;
  self: React.RefObject<HTMLDivElement>;
  mouseStopTimer: NodeJS.Timeout;
  volumeBeforeMute: number;
  videoDurationString: string;

  constructor(props: VideoPlayerProps) {
    super(props);
    this.video = React.createRef();
    this.self = React.createRef();
    this.mouseStopTimer = setTimeout(()=>{}, 0);
    this.volumeBeforeMute = 0;
    this.videoDurationString = '00:00';

    this.updateSubtitleLanguages = this.updateSubtitleLanguages.bind(this);
    this.setSubtitleLanguage = this.setSubtitleLanguage.bind(this);
    this.handleMouseStop = this.handleMouseStop.bind(this);
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.handleVolumeButtonClick = this.handleVolumeButtonClick.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);

    this.state = {
      isMouseOver: false,
      isMouseMove: false,
      isFullscreen: false,
      isPlaying: false,
      videoTime: 0,
      videoVolume: 0.5,
      videoDuration: 0,
      subtitleLanguage: '',
      subtitleLanguages: [],
    }

  }
  
  componentDidMount() {
    this.attachToSelf();
    this.attachToVideo(this.video.current);
  }
  
  attachToSelf() {
    const self = this.self.current;

    if(!self) return;

    self.onmouseenter = () => {
      this.setState({
        isMouseOver: true,
      })
    }

    self.onmouseleave = () => {
      this.setState({
        isMouseOver: false,
      })
    }
    
    self.onmousemove = () => {
      if(!this.state.isMouseMove) this.setState({ isMouseMove: true })
      clearTimeout(this.mouseStopTimer);
      this.mouseStopTimer = setTimeout(this.handleMouseStop, 1000);
    }

    self.ondblclick = () => {
      this.handleFullscreen();
    }

    self.onfullscreenchange = () => {
      this.setState({
        isFullscreen: document.fullscreen,
      })
    }

    this.setState({
      isFullscreen: document.fullscreen,
    })
  }

  attachToVideo(video: HTMLVideoElement | null) {
    if(!video) return;

    video.onplay = () => {
      this.setState({
        isPlaying: true,
      });
    }

    video.onpause = () => {
      this.setState({
        isPlaying: false,
      });
    }

    video.ontimeupdate = () => {
      this.setState({
        videoTime: video.currentTime,
      })
    }

    video.ondurationchange = () => {
      this.setState({
        videoDuration: video.duration,
      })
      this.videoDurationString = getStringFromSecond(video.duration);
    }

    this.setState({
      videoVolume: video.volume,
    })
  }

  updateSubtitleLanguages(languages: string[]) {
    languages.length
      ? this.setState({
        subtitleLanguage: languages[0],
        subtitleLanguages: languages,
        })
      : this.setState({
        subtitleLanguage: '',
        subtitleLanguages: [],
      });
  }

  setSubtitleLanguage(language: string) {
    this.setState({
      subtitleLanguage: language,
    })
  }

  handleMouseStop() {
    this.setState({
      isMouseMove: false,
    })
  }

  handleFullscreen() {
    const self = this.self.current;

    if(!self) return;

    document.fullscreen
    ? document.exitFullscreen()
      .catch(e => console.error(e))
    : self.requestFullscreen()
      .catch(e => console.error(e));
  }

  handlePlayButtonClick() {
    const video = this.video.current;
    if(!video) return;

    video.paused 
    ? video.play()
    : video.pause();
  }
  
  handleVolumeButtonClick() {
    const video = this.video.current;
    if(!video) return;
    
    const currentVolume = video.volume;

    if(!currentVolume) {
      this.setState({ videoVolume: this.volumeBeforeMute });
      video.volume = this.volumeBeforeMute;
      return;
    }
    
    this.volumeBeforeMute = currentVolume;
    this.setState({ videoVolume: 0 })
    video.volume = 0;
  }

  handleVolumeChange(event: React.FormEvent<HTMLInputElement>) {
    const volume = Number(event.currentTarget.value);

    this.setState({
      videoVolume: volume,
    })

    if(!this.video.current) return;
    this.video.current.volume = volume;
  }

  handleTimeChange(event: React.FormEvent<HTMLInputElement>) {
    const time = Number(event.currentTarget.value);

    this.setState({
      videoTime: time,
    })

    if(!this.video.current) return;
    this.video.current.currentTime = time;
  }

  render() {
    return (
      <div 
        className = 'video-player' 
        ref = {this.self}
      >
        <video 
          src = { this.props.videoUrl || '' } 
          ref = { this.video }
          autoPlay
        />
        <Subtitle 
          videoTime = { this.state.videoTime }
          subtitle = { this.props.subtitle }
          subtitleLanguage = { this.state.subtitleLanguage }
          updateSubtitleLanguages = { this.updateSubtitleLanguages }
        />
        <Control 
          isActive = {this.state.isMouseOver && this.state.isMouseMove}
          isFullscreen = { this.state.isFullscreen }
          isPlaying = { this.state.isPlaying }
          videoTime = { this.state.videoTime }
          videoVolume = { this.state.videoVolume }
          videoDuration = { this.state.videoDuration }
          videoTimeString = { getStringFromSecond(this.state.videoTime) }
          subtitleLanguage = { this.state.subtitleLanguage }
          subtitleLanguages = { this.state.subtitleLanguages }
          videoDurationString = { this.videoDurationString }
          setSubtitleLanguage = { this.setSubtitleLanguage }
          handleFullscreen = { this.handleFullscreen }
          handlePlayButtonClick = { this.handlePlayButtonClick }
          handleVolumeButtonClick = { this.handleVolumeButtonClick }
          handleVolumeChange = { this.handleVolumeChange }
          handleTimeChange = { this.handleTimeChange }
        />
      </div>
    );
  }
}
