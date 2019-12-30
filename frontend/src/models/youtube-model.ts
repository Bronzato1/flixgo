export class Youtube {
  static fromSearch(src) {
    var tmpObj = Object.assign(new Youtube(), src);
    return tmpObj;
  }
  static fromStatistics(src) {
    var tmpObj = Object.assign(new Youtube(), src);
    return tmpObj;
  }

  public snippet: Snippet;
  public contentDetails: ContentDetails;
  public statistics: Statistics;
}

class Snippet {
  public channelId: string;
  public channelTitle: string;
  public description: string;
  public playlistId: string;
  public position: number;
  public title: string;
  public categoryId: string;
  public liveBroadcastContent: string;
  public defaultAudioLanguage: string;
  public publishedAt: Date;
  public resourceId: ResourceId;
  public thumbnails: Thumbnail[];
}

class ContentDetails {
  public videoId: string;
  public videoPublishedAt: Date;
  public duration: string;
  public dimension: string;
  public definition: string;
  public caption: string;
  public licensedContent: boolean;
  public projection: string;
}

class ResourceId {
  public kind: string;
  public videoId: string;
}

class Thumbnail {
  public url: string;
  public width: number;
  public height: number;
}

class Statistics {
  public commentCount: number;
  public dislikeCount: number;
  public likeCount: number;
  public viewCount: number;
}
