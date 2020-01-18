import { Preferences } from 'preferences';

export class YoutubeChannel {

  static fromSearch(src) {
    var tmpObj = Object.assign(new YoutubeChannel(), src);
    return tmpObj;
  }

  id: string;
  snippet: Snippet;
  statistics: Statistics;
}

class Snippet {
  title: string;
  description: string;
  publishedAt: Date;
  thumbnails: Thumbnail[];
  country: string;
}

class Thumbnail {
  url: string;
  width: number;
  height: number;
}

class Statistics {
  commentCount: number;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}