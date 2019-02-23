import { FileIndex } from './commonInterfaces';

export async function getFileIndexesAsync(directoryUrl: string): Promise<FileIndex[]> {
  const response = await fetch(directoryUrl);
  const jsonBlob = await response.blob();
  const jsonText = await readFileAsTextAsync(jsonBlob);
  const json = JSON.parse(jsonText) as FileIndex[];
  return json;
}

export function readFileAsTextAsync(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

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

export function getFileIndexCompareFunction(sortBy: string) {
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

export function getReadableStringFromByteSize(byte: number) {
  const unitTable = [
    'B',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  let unit = 0;
  let value = byte;

  while (value > 1024) {
    if(unit >= 8) return;
    unit += 1;
    value /= 1024;
  }

  return `${value.toFixed(1)} ${unitTable[unit]}`
}

export function getLocaleStringFromMs(ms: number) {
  const date = new Date(ms);
  return date.toLocaleString();
}

export function getStringFromSecond(rawSecond: number) {
  let second = rawSecond;
  let minute = 0;
  let hour = 0;

  minute = second / 60;
  hour = minute / 60;
  second %= 60;
  minute %= 60;
  
  // Padding left with 0
  const secondString = (`0${second.toFixed(0)}`).slice(-2);
  const minuteString = (`0${minute.toFixed(0)}`).slice(-2);
  const hourString = (`0${hour.toFixed(0)}`).slice(-2);

  return hour < 1
    ? `${minuteString}:${secondString}`
    : `${hourString}:${minuteString}:${secondString}`
}