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
      currentVideo: null,
      currentVideoObjectUrl: null,
    };

    this.renewVideoState = this.renewVideoState.bind(this);

    this.renewVideoState();
  }

  renewVideoState() {
    const videoPath = Path.join('/', this.props.match.params.path);
    const directoryPath = Path.join('/', videoPath, '..');
    // URL for debug client, If you found it, Remove it
    const videoUrl = `http://localhost:3000/data${videoPath}`;
    const directoryUrl = `http://localhost:3000/index${directoryPath}`;

    getVideoIndexes(directoryUrl)
    .then(fileIndexes => {
      const videos = fileIndexes.filter(fileIndex => fileIndex.type === 'video');
      
      const foundtVideo = videos.find(fileIndex => fileIndex.path === videoPath);
      if(!foundtVideo) throw Error('Video not found');
      const currentVideo = foundtVideo;
      
      getVideoObjectUrlAsync(videoUrl)
      .then(videoObjectUrl => {
        const currentVideoObjectUrl = videoObjectUrl;

        this.setState({
          videos: videos,
          currentVideo: currentVideo,
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
