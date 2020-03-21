import Path from 'path';
import { JSONResponse, ServeIndexResponseMessage, ServeIndexResponseData } from '../../responseTypes';
import config from '../../config';

export default async function getFileIndexesAsync(directoryPath: string): Promise<JSONResponse<ServeIndexResponseMessage, ServeIndexResponseData>> {
  const directoryUrl = config.debugHost + Path.join(config.indexUrlPrefix, directoryPath || '');

  const response = await fetch(directoryUrl);
  const json = await response.json() as JSONResponse<ServeIndexResponseMessage, ServeIndexResponseData>;
  return json;
}
