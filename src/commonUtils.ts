import { FileIndex } from './commonInterfaces';

export type FetchRestAPIOption = {
  url: string,
  body?: object,
  method?: 'POST' | 'GET',
}

export async function readBlobAsTextAsync(blob: Blob): Promise<string> {
  const arrayBuffer = await readBlobAsArrayBufferAsync(blob);
  const encoding = await getTextEncodingFromArrayBuffer(arrayBuffer);
  const decoder = new TextDecoder(encoding);
  const text = decoder.decode(arrayBuffer);
  return text;
}

export async function getTextEncodingFromArrayBuffer(arrayBuffer: ArrayBuffer) {
  const encodingList = [
    'utf8',
    'euc-kr',
  ]
  
  const promisesTestingEncoding: Promise<{ 
      encoding: string,
      errorCount: number,
    }>[] = [];

  encodingList.forEach(encoding => {
    promisesTestingEncoding.push(
      testEncoding(arrayBuffer, encoding)
    );
  });

  const result =  await Promise.all(promisesTestingEncoding);
  result.sort((a, b) => a.errorCount - b.errorCount);

  return result[0].encoding
}

export async function testEncoding(arrayBuffer: ArrayBuffer, encoding: string): Promise<{
  encoding: string,
  errorCount: number,
}> {
  const decoder = new TextDecoder(encoding);
  const text = decoder.decode(arrayBuffer);
  
  return {
    encoding: encoding,
    errorCount: (text.match(/�/g) || []).length 
  }
}

export function readBlobAsArrayBufferAsync(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing file index json blob."));
    };

    reader.onload = () => {
      const result = reader.result;

      if (result instanceof ArrayBuffer) resolve(result);
      reject(new DOMException("Problem parsing file index json blob. type of result is not string."));
    };

    reader.readAsArrayBuffer(blob);
  });
}

export function getFileIndexCompareFunction(sortBy: string) {
  switch (sortBy) {
    case 'type':
      return (a:FileIndex, b:FileIndex) => {
        return a.type - b.type;
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
  const secondString = (`0${Math.floor(second)}`).slice(-2);
  const minuteString = (`0${Math.floor(minute)}`).slice(-2);
  const hourString = (`0${Math.floor(hour)}`).slice(-2);

  return hour < 1
    ? `${minuteString}:${secondString}`
    : `${hourString}:${minuteString}:${secondString}`
}

export async function fetchRestAPI(option: FetchRestAPIOption) {
  const {
    url,
    body,
    method,
  } = option;
  const Authorization = sessionStorage.getItem('AuthorizationToken');
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(Authorization ? { Authorization } : undefined),
    },
    method: method || 'POST',
    body: JSON.stringify(body || {}),
  });
  return response;
}
