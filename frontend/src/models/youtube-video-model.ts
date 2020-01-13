export class YoutubeVideo {

  static fromSearch(src) {
    var tmpObj = Object.assign(new YoutubeVideo(), src);
    return tmpObj;
  }
  static fromStatistics(src) {
    var tmpObj = Object.assign(new YoutubeVideo(), src);
    return tmpObj;
  }

  snippet: Snippet;
  contentDetails: ContentDetails;
  statistics: Statistics;
  status: Status;
}

class Snippet {
  channelId: string;
  channelTitle: string;
  description: string;
  playlistId: string;
  position: number;
  title: string;
  categoryId: string;
  liveBroadcastContent: string;
  defaultAudioLanguage: string;
  publishedAt: Date;
  resourceId: ResourceId;
  thumbnails: Thumbnail[];
}

class ContentDetails {
  videoId: string;
  videoPublishedAt: Date;
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  projection: string;
}

class ResourceId {
  kind: string;
  videoId: string;
}

class Thumbnail {
  url: string;
  width: number;
  height: number;
}

class Statistics {
  commentCount: number;
  dislikeCount: number;
  likeCount: number;
  viewCount: number;
}

class Status {
  uploadStatus: string;
  privacyStatus: string;
  license: string;
  embeddable: string;
  publicStatsViewable: string;
}