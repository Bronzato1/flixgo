export class YoutubePlaylist {

  static fromSearch(src) {
    var tmpObj = Object.assign(new YoutubePlaylist(), src);
    return tmpObj;
  }

  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
}

class Snippet {
  channelId: string;
  channelTitle: string;
  description: string;
  title: string;
  liveBroadcastContent: string;
  publishedAt: Date;
  thumbnails: Thumbnail[];
}

class ContentDetails {
  itemCount: number;
}

class Thumbnail {
  url: string;
  width: number;
  height: number;
}
