import { HttpClient } from 'aurelia-fetch-client';
import { autoinject } from "aurelia-framework";
import { Youtube } from '../models/youtube-model';
import environment from 'environment';
import secret from '../secret';

@autoinject()
export class YoutubeGateway {
  constructor() {
    this.httpClient = new HttpClient();
  }
  private httpClient: HttpClient;
  public searchVideos(searchTerms: string, pageToken: string = null) {

    var url = `${environment.youtubeUrl}search?part=snippet&type=video&maxResults=50&q=${searchTerms}&key=${secret.youtubeKey}`;

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
            items: merged
          };
        });
      })
      .catch(error => console.log(error));
  }
  public videoStatistics(ids) {
    return this.httpClient
      .fetch(`${environment.youtubeUrl}videos?part=statistics&id=${ids}&key=${secret.youtubeKey}`)
      .then(response => response.json())
      .then(data => data.items)
      .catch(error => console.log(error));
  }
}
