import { YoutubeChannels } from 'youtube-channels';

export class YoutubeChannel {

  static fromSearch(src) {
    var tmpObj = Object.assign(new YoutubeChannel(), src);
    return tmpObj;
  }

  id: string;
  snippet: Snippet;
  statistics: Statistics;

  get hashtags() { 
    return YoutubeChannels.Items.find(x => x.id == this.id).hashtags;
  }
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