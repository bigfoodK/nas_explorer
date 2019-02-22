import React from 'react';
import Path from 'path';
import { RouteProps } from 'react-router-dom';
import { VideoProps, VideoStates, FileIndex } from './videoInterfaces';
import VideoPlayer from './VideoPlayer';
import './Video.css';

export default class Video extends React.Component<RouteProps & VideoProps, VideoStates> {
  constructor(props: RouteProps & VideoProps) {
    super(props);

    this.state = {
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
      
      const currentVideoIndex = videos.findIndex(fileIndex => fileIndex.path === videoPath);
      if(!currentVideoIndex) throw Error('Video not found');

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
