import React from 'react';
import Path from 'path';
import { RouteProps } from 'react-router-dom';
import { VideoProps, VideoStates } from './videoInterfaces';
import { getFileIndexesAsync, getFileIndexCompareFunction } from '../../commonUtils';
import VideoPlayer from './VideoPlayer';
import Menu from './Menu';
import './Video.css';
import config from '../../config';
import { FileType } from '../../commonInterfaces';

export default class Video extends React.Component<RouteProps & VideoProps, VideoStates> {
  constructor(props: RouteProps & VideoProps) {
    super(props);

    this.state = {
      sortBy: 'name',
      videos: [],
      nextVideo: null,
      currentVideo: null,
      previousVideo: null,
      currentVideoUrl: null,
      currentSubtitle: null,
    };

    this.renewVideoState = this.renewVideoState.bind(this);
    this.renewVideoState(this.props.match.params.path);
  }

  componentWillReceiveProps(nextProps: RouteProps & VideoProps) {
    this.renewVideoState(nextProps.match.params.path);
  }

  renewVideoState(rawVideoPath: string) {
    const videoPath = Path.join('/', rawVideoPath);
    const directoryPath = Path.join(videoPath, '..');
    const videoUrl = config.debugHost + Path.join(config.dataUrlPrefix, videoPath);
    const directoryUrl = config.debugHost + Path.join(config.indexUrlPrefix, directoryPath);

    getFileIndexesAsync(directoryUrl)
    .then(response => {
      if (!response.isSuccessful) {
        console.error(response.message);
        return;
      }

      const { fileIndexes } = response.data;

      const videos = fileIndexes.filter(fileIndex => fileIndex.type === FileType.video);
      videos.sort(getFileIndexCompareFunction('name'));
      
      const currentVideoIndex = videos.findIndex(fileIndex => fileIndex.path === videoPath);
      if(currentVideoIndex === -1) throw Error('Video not found');

      const previousVideo = currentVideoIndex - 1 >= 0
        ? videos[currentVideoIndex - 1]
        : null;
      const currentVideo = videos[currentVideoIndex];
      const nextVideo = currentVideoIndex + 1 < videos.length
        ? videos[currentVideoIndex + 1]
        : null;
      
      // TODO Path.parse가 함수가 아니래요. 아셨어요? 전 몰랐는데...
      const currentVideoName = Path.basename(currentVideo.name, Path.extname(currentVideo.name));

      const currentSubtitle = fileIndexes.find(fileIndex => {
        const extName = Path.extname(fileIndex.name);
        if(extName !== ('.smi' || '.SMI')) return false;
        if(Path.basename(fileIndex.name, extName) !== currentVideoName) return false;
        return true;
      }) || null;

      this.setState({
        sortBy: this.state.sortBy,
        videos: videos,
        nextVideo: nextVideo,
        currentVideo: currentVideo,
        previousVideo: previousVideo,
        currentVideoUrl: videoUrl,
        currentSubtitle: currentSubtitle,
      })
    });
  }

  render() {
    return (
      <div className = 'video'>
        <VideoPlayer
          subtitle = { this.state.currentSubtitle }
          videoUrl = { this.state.currentVideoUrl }
        />
        <div className='dvider' />
        <Menu 
          nextVideo = {this.state.nextVideo}
          previousVideo = {this.state.previousVideo}
        />
      </div>
    );
  }
}
