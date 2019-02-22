import React from 'react';
import Path from 'path';
import { RouteProps } from 'react-router-dom';
import { VideoProps, VideoStates, FileIndex } from './videoInterfaces';
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

    getVideoIndexes(directoryUrl)
    .then(fileIndexes => {
      const videos = fileIndexes.filter(fileIndex => fileIndex.type === 'video');
      videos.sort(sortCompareFunctions('name'));
      
      const currentVideoIndex = videos.findIndex(fileIndex => fileIndex.path === videoPath);
      if(currentVideoIndex === -1) throw Error('Video not found');

      const nextVideo = currentVideoIndex - 1 >= 0
        ? videos[currentVideoIndex - 1]
        : null;
      const currentVideo = videos[currentVideoIndex];
      const previousVideo = currentVideoIndex + 1 < videos.length
        ? videos[currentVideoIndex + 1]
        : null;
      
      getVideoObjectUrlAsync(videoUrl)
      .then(videoObjectUrl => {
        const currentVideoObjectUrl = videoObjectUrl;

        this.setState({
          sortBy: this.state.sortBy,
          videos: videos,
          nextVideo: nextVideo,
          currentVideo: currentVideo,
          previousVideo: previousVideo,
          currentVideoObjectUrl: currentVideoObjectUrl,
        });
      });
    });
  }

  render() {
    return (
      <div className = 'video'>
        <VideoPlayer
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

async function getVideoObjectUrlAsync(videoUrl: string): Promise<string> {
  const response = await fetch(videoUrl);
  const videoBlob = await response.blob();
  const videoObjectUrl = URL.createObjectURL(videoBlob);
  return videoObjectUrl;
}

async function getVideoIndexes(directoryUrl: string): Promise<FileIndex[]> {
  const response = await fetch(directoryUrl);
  const jsonBlob = await response.blob();
  const jsonText = await readFileAsTextAsync(jsonBlob);
  const json = JSON.parse(jsonText) as FileIndex[];
  return json;
}

function readFileAsTextAsync(blob: Blob): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing file index json blob."));
    };

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === 'string') resolve(result);
      reject(new DOMException("Problem parsing file index json blob. type of result is not string."));
    };

    reader.readAsText(blob);
  });
}

function sortCompareFunctions(sortBy: string) {
  const typeOrder = {
    directory: 0,
    text: 1,
    image: 2,
    audio: 3,
    video: 4,
    binary: 5,
  };

  switch (sortBy) {
    case 'type':
      return (a:FileIndex, b:FileIndex) => {
        return typeOrder[a.type] - typeOrder[b.type];
      }

    case 'size':
      return (a:FileIndex, b:FileIndex) => {
        return a.size - b.size;
      }

    case 'createdAt':
      return (a:FileIndex, b:FileIndex) => {
        return a.createdAtMs - b.createdAtMs;
      }
    
    case 'modifiedAt':
      return (a:FileIndex, b:FileIndex) => {
        return a.modifiedAtMs - b.modifiedAtMs;
      }

    default:
      return (a:FileIndex, b:FileIndex) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      }
  }
}
