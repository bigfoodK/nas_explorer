declare module 'sami-parser' {
  
  interface SamiParseResult {
    result: SubtitleFragment[];
    // TO DO 뭐지이게 여기서 뭐가 나올지 궁금한걸?
    error: Error[];
  }

  interface SubtitleFragment {
    startTime: number;
    endTime: number;
    languages: {
      [key: string]: string;
    };
  }

  interface SamiParseOptions {
    duration?: number;
    definedLangs?: {
      [key: string]: {
        lang: string;
        reClassName: RegExp;
      }
    };
  }

  function parse(str: string, options?: SamiParseOptions): SamiParseResult;
  function parseFile(file, options: SamiParseOptions): SamiParseResult;
}


// interface SamiParseResult {
//   result: SubtitleFragment[];
//   // TO DO 뭐지이게 여기서 뭐가 나올지 궁금한걸?
//   error: Error[];
// }

// interface SubtitleFragment {
//   startTime: number;
//   endTime: number;
//   languages: {
//     [key: string]: string;
//   };
// }

// interface SamiParseOptions {
//   duration?: number;
//   definedLangs?: SamiParseDefinedLangsOption;
// }

// interface SamiParseDefinedLangsOption {
//   [key: string]: {
//     lang: string;
//     reClassName: RegExp;
//   }
// }