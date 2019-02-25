import React from 'react';
import Path from 'path';
import SamiParser, { SamiParseResult, SubtitleFragment } from 'sami-parser';
import { SubtitleProps, SubtitleStates } from './videoInterfaces';
import { FileIndex } from '../../commonInterfaces';
import { readBlobAsTextAsync } from '../../commonUtils';
import './Subtitle.css';
import config from '../../config';

export default class Subtitle extends React.Component<SubtitleProps, SubtitleStates> {
  subtitle: SubtitleFragment[];
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
    this.subtitle = samiParseResult.result || [];

    const languages = this.subtitle[0]
      ? Object.keys(this.subtitle[0].languages).length
        ? Object.keys(this.subtitle[0].languages)
        : []
      : [];
      
    this.props.updateSubtitleLanguages(languages);
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

  updateSubtitleText(timeSecond: number, subtitle: SubtitleFragment[]) {
    if(!subtitle) return this.setSubtitleText('');

    const time = timeSecond * 1000;

    const now = subtitle[this.currentIndex];

    const subtitleLanguage = this.props.subtitleLanguage;
    
    if(now) {
      const next = subtitle[this.currentIndex + 1];

      const nowStart = now.startTime;
      const nowEnd = now.endTime;
      const nowText = now.languages[subtitleLanguage] || '';
      const nextStart = next ? next.startTime : Infinity;
      const nextEnd = next ? next.endTime : Infinity;
      const nextText = next ? next.languages[subtitleLanguage] || '' : '';

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
    
    const text = subtitle[foundIndex].languages[subtitleLanguage] || '';
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

async function getSubtitleAsync(subtitleUrl: string): Promise<SamiParseResult> {
  const response = await fetch(subtitleUrl);
  const subtitleBlob = await response.blob();
  const subtitleText = await readBlobAsTextAsync(subtitleBlob);
  const subtitle: SamiParseResult = SamiParser.parse(subtitleText);
  return subtitle;
}

function searchSubtitle(time: number, subtitle: SubtitleFragment[]) {
  if(subtitle.length === 0) return -1;

  let head = 0;
  let body;
  let tail = subtitle.length;
  let start;
  let end;

  while(head <= tail) {
    body = Math.floor((head + tail) / 2);
    start = subtitle[body].startTime;
    end = subtitle[body + 1]
    ? subtitle[body + 1].startTime
    : Infinity;

    if(time < start) tail = body - 1;
    else if (end < time) head = body + 1;
    else return body;
  }
  return -1;
}
