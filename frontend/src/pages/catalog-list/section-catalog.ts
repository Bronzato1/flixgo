import { YoutubeGateway } from './../../gateways/youtube-gateway';
import { Youtube } from '../../models/youtube-model';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class SectionCatalog {
  constructor(youtubeGateway: YoutubeGateway) {
    this.youtubeGateway = youtubeGateway;
  }
  private youtubeGateway: YoutubeGateway;
  private videos: Youtube[];
  private created() {
    this.youtubeGateway.searchVideos().then(items => {
      this.videos = items || null;
    });
  }
  private attached() {
  }
}
