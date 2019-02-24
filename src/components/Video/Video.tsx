import React from 'react';
import Path from 'path';
import { RouteProps } from 'react-router-dom';
import { VideoProps, VideoStates } from './videoInterfaces';
import { getFileIndexesAsync, getFileIndexCompareFunction } from '../../commonUtils';
import VideoPlayer from './VideoPlayer';
import Menu from './Menu';
import './Video.css';

export default class Video extends React.Component<RouteProps & VideoProps, VideoStates> {
  constructor(props: RouteProps & VideoProps) {
    super(props);

    this.state = {
      sortBy: 'name',
      videos: [],
      nextVideo: null,
      currentVideo: null,
      previousVideo: null,
      currentSubtitle: null,
      currentVideoObjectUrl: null,
      
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
    // URL for debug client, If you found it, Remove it
    const videoUrl = 'http://localhost:3000' + Path.join('/data', videoPath);
    const directoryUrl = 'http://localhost:3000' + Path.join('/index', directoryPath);

    getFileIndexesAsync(directoryUrl)
    .then(fileIndexes => {
      const videos = fileIndexes.filter(fileIndex => fileIndex.type === 'video');
      videos.sort(getFileIndexCompareFunction('name'));
      
      const currentVideoIndex = videos.findIndex(fileIndex => fileIndex.path === videoPath);
      if(currentVideoIndex === -1) throw Error('Video not found');

      const nextVideo = currentVideoIndex - 1 >= 0
        ? videos[currentVideoIndex - 1]
        : null;
      const currentVideo = videos[currentVideoIndex];
      const previousVideo = currentVideoIndex + 1 < videos.length
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

      getObjectUrlAsync(videoUrl)
        .then(currentVideoObjectUrl => {
          this.setState({
            sortBy: this.state.sortBy,
            videos: videos,
            nextVideo: nextVideo,
            currentVideo: currentVideo,
            previousVideo: previousVideo,
            currentSubtitle: currentSubtitle,
            currentVideoObjectUrl: currentVideoObjectUrl,
          })
        })
    });
  }

  render() {
    return (
      <div className = 'video'>
        <VideoPlayer
          subtitle = { this.state.currentSubtitle }
          videoObjectUrl = { this.state.currentVideoObjectUrl }
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

async function getObjectUrlAsync(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  return objectUrl;
}
