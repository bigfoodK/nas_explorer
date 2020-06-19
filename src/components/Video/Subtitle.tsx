import React from 'react';
import Path from 'path';
import { SubtitleProps, SubtitleStates } from './videoInterfaces';
import { FileIndex } from '../../commonInterfaces';
import { readBlobAsTextAsync } from '../../commonUtils';
import './Subtitle.css';
import config from '../../config';
import { subTitleType, parse } from 'subtitle';

export default class Subtitle extends React.Component<SubtitleProps, SubtitleStates> {
  subtitle: subTitleType[];
  subtitleIndex: FileIndex | null;
  currentText: string;
  currentIndex: number;
  
  constructor(props: SubtitleProps) {
    super(props);

    this.subtitle = [];
    this.subtitleIndex = null;
    this.currentText = '';
    this.currentIndex = 0;

    this.state = {
      subtitleText: [],
    }

    if(this.props.subtitle) this.getSubtitle(this.props.subtitle);
  }

  componentWillReceiveProps(nextProps: SubtitleProps) {
    const subtitleIndex = nextProps.subtitle;

    this.updateSubtitleText(nextProps.videoTime, this.subtitle);
    
    if(this.subtitleIndex === subtitleIndex) return;
    if(!subtitleIndex) return this.subtitle = [];
    this.subtitleIndex = subtitleIndex;
    this.getSubtitle(subtitleIndex);
  }

  async getSubtitle(subtitle: FileIndex | null) {
    if(!subtitle) return;

    const subtitleUrl = config.debugHost + Path.join(config.dataUrlPrefix , subtitle.path);
    const samiParseResult = await getSubtitleAsync(subtitleUrl);
    this.subtitle = samiParseResult || [];
  }

  setSubtitleText(text: string) {
    if(this.currentText === text) return;
    
    this.currentText = text;

    const jsxElement = text.split('\n').map(line => (
      <div key = {line}>
        {line}
      </div>
    ));

    this.setState({
      subtitleText: jsxElement,
    });
  }

  updateSubtitleText(timeSecond: number, subtitle: subTitleType[]) {
    if(!subtitle) return this.setSubtitleText('');

    const time = timeSecond * 1000;

    const now = subtitle[this.currentIndex];
    
    if(now) {
      const next = subtitle[this.currentIndex + 1];

      const nowStart = now.start;
      const nowEnd = now.end;
      const nowText = now.text || '';
      const nextStart = next ? next.start : Infinity;
      const nextEnd = next ? next.end : Infinity;
      const nextText = next ? next.text || '' : '';

      const isOnNow = (nowStart <= time) && (time <= nowEnd);
      if(isOnNow) return this.setSubtitleText(nowText);
  
      const isBetweenNowAndNext = (nowEnd < time) && (time < nextStart);
      if(isBetweenNowAndNext) return this.setSubtitleText('');
      
      const isOnNext = (nextStart <= time) && (time <= nextEnd);
      if(isOnNext) {
        this.currentIndex += 1;
        this.setSubtitleText(nextText);
        return;
      }
    }

    const foundIndex = searchSubtitle(time, subtitle);
    if(foundIndex === -1) return this.setSubtitleText('');
    
    const text = subtitle[foundIndex].text || '';
    this.setSubtitleText(text);
    this.currentIndex = foundIndex;
  }

  render() {
    return (
      <div className = 'subtitle'>
        {this.state.subtitleText}
      </div>
    )
  }
}

async function getSubtitleAsync(subtitleUrl: string): Promise<subTitleType[]> {
  const response = await fetch(subtitleUrl);
  const subtitleBlob = await response.blob();
  const subtitleText = await readBlobAsTextAsync(subtitleBlob);
  const subtitle: subTitleType[] = parse(subtitleText);
  return subtitle;
}

function searchSubtitle(time: number, subtitle: subTitleType[]) {
  if(subtitle.length === 0) return -1;

  let head = 0;
  let body;
  let tail = subtitle.length;
  let start;
  let end;

  while(head <= tail) {
    body = Math.floor((head + tail) / 2);
    start = subtitle[body].start;
    end = subtitle[body + 1]
    ? subtitle[body + 1].start
    : Infinity;

    if(time < start) tail = body - 1;
    else if (end < time) head = body + 1;
    else return body;
  }
  return -1;
}
