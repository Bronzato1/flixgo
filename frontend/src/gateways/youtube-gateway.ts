import { Youtube } from './../models/youtube-model';
import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from "aurelia-framework";
import environment from 'environment';
import secret from '../secret';

@autoinject()
export class YoutubeGateway {
  constructor() {
    this.httpClient = new HttpClient();
  }
  private httpClient: HttpClient;
  public searchVideos(searchTerms: string, pageToken: string = null) {
    debugger;
    var url = `${environment.youtubeUrl}search?part=snippet&type=video&videoType=movie&maxResults=50&q=${searchTerms}&key=${secret.youtubeKey}`;

    if (pageToken)
      url += `&pageToken=${pageToken}`;

    return this.httpClient
      .fetch(url)
      .then(response => response.json())
      .then(data => {
        var result1: Youtube[] = data.items.map(Youtube.fromSearch);
        var ids = data.items.map(x => x.id.videoId);

        return this.videoStatistics(ids).then(items => {
          var result2: Youtube[] = items.map(Youtube.fromStatistics);
          var merged: Youtube[] = [];

          for (var i = 0; i < result1.length; i++) {
            var obj = { ...result1[i], ...result2[i] };
            merged.push(obj);
          }

          return {
            nextPageToken: data.nextPageToken,
            totalItems: data.nextPageToken ? 999 : merged.length,
            items: merged
          };
        });
      })
      .catch(error => console.log(error));
  }
  public searchMoviesByPlaylist(playlistId: string, pageToken: string = null): Promise<any> {

    var url = `${environment.youtubeUrl}playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistId}&key=${secret.youtubeKey}`;

    if (pageToken)
      url += `&pageToken=${pageToken}`;

    return this.httpClient
      .fetch(url)
      .then(response => response.json())
      .then(data => {
        var result1: Youtube[] = data.items.map(Youtube.fromSearch);
        var ids = result1.map(x => x.contentDetails.videoId);

        return this.videoStatistics(ids).then(items => {
          var result2: Youtube[] = items.map(Youtube.fromStatistics);
          var merged: Youtube[] = [];

          for (var i = 0; i < result1.length; i++) {
            var obj = { ...result1[i], ...result2[i] };
            merged.push(obj);
          }

          return {
            nextPageToken: data.nextPageToken,
            totalItems: data.nextPageToken ? 999 : merged.length,
            items: merged
          };
        });
      })
      .catch(error => console.log(error));
  }
  public videoStatistics(ids): Promise<any> {
    return this.httpClient
      .fetch(`${environment.youtubeUrl}videos?part=statistics&id=${ids}&key=${secret.youtubeKey}`)
      .then(response => response.json())
      .then(data => data.items)
      .catch(error => console.log(error));
  }
  public searchMovieByVideoId(videoId: string): Promise<void | Youtube> {

    var url = `${environment.youtubeUrl}videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${secret.youtubeKey}`;

    return this.httpClient
      .fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.items.length == 1) {
          var result: Youtube = Youtube.fromSearch(data.items[0]);
          result.contentDetails.videoId = videoId;
          return Promise.resolve(result);
        }
      })
      .catch(error => console.log(error));
  }
  public searchAllMoviesByPlaylist(playlistId: string, pageToken: string): Promise<any> {

    var self = this;
    var allItems: Array<Youtube> = [];

    function getData(pageToken) {
      return self.searchMoviesByPlaylist(playlistId, pageToken).then(data => {
        allItems = allItems.concat(data.items);
        if (data.nextPageToken)
          return getData(data.nextPageToken);
        else {
          debugger;
          return Promise.resolve(allItems);
        }
      }).catch(error => {
        debugger;
      });
    }

    return getData(pageToken);
  }
}
