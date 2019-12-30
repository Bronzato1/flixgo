import { Youtube } from './../../models/youtube-model';
import { autoinject, bindable } from 'aurelia-framework';
import { YoutubeGateway } from 'gateways/youtube-gateway';

@autoinject()
export class SectionDetail1 {
  constructor(youtubeGateway: YoutubeGateway) {
    this.youtubeGateway = youtubeGateway;
  }
  private youtubeGateway: YoutubeGateway;
  private videoId: string;
  private item: Youtube;
  private created(view) {
    this.videoId = view.container.viewModel.videoId;
  }
  private bind(bindingContext) {
    return this.youtubeGateway.searchMovieByVideoId(this.videoId).then(data => {
      this.item = data || null;
    });
  }
}
