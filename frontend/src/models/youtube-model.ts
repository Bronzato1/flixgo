export class Youtube {
  static fromSearch(src) {
    var tmpObj = Object.assign(new Youtube(), src.id, src.snippet);
    return tmpObj;
  }
  static fromStatistics(src) {
    var tmpObj = Object.assign(new Youtube(), src);
    return tmpObj;
  }
  public videoId: string;
  public publishedAt: Date;
  public channelId: string;
  public channelTitle: string;
  public title: string;
  public description: string;
  public thumbnails: Thumbnail[];
  public statistics: Statistics;
}

class Thumbnail {
  public url: string;
  public width: number;
  public height: number;
}

class Statistics {
  public commentCount: number;
  public dislikeCount: number;
  public favoriteCount: number;
  public likeCount: number;
  public viewCount: number;
}
