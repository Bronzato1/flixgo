import { YoutubeGateway } from './../../gateways/youtube-gateway';
import { Youtube } from '../../models/youtube-model';
import { IFilter, IPager } from '../../interfaces/filter-interface';
import { autoinject, bindable, computedFrom } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import moment = require('moment');

const PLAYLIST_BOX_OFFICE = 'PLHPTxTxtC0iZaTf4DEe-eQ2_sTWuyVFs_';
const PLAYLIST_MOST_POPULAR = 'PLHPTxTxtC0iY65VCtQssLFRTQwV1ScueG';
const PLAYLIST_NEW_TO_RENT = 'PLHPTxTxtC0iY91P_GT7TzcLY_bF-2VOuy';
const PLAYLIST_TOP_RATED = 'PLHPTxTxtC0iY7Q9hbREwkLOxkFpaKnhc6';
const PLAYLIST_NEW_RELEASES = 'PLHPTxTxtC0iYAzVsEjJG3_qXPQ12YcTI1';
const PLAYLIST_TOPSELLING = 'PLHPTxTxtC0iZUGnexGOfXIIN_tCQrOU67';

@autoinject()
export class SectionCatalog {
  constructor(router: Router, eventAgregator: EventAggregator, youtubeGateway: YoutubeGateway) {
    this.router = router;
    this.ea = eventAgregator;
    this.youtubeGateway = youtubeGateway;
  }
  private router: Router;
  private ea: EventAggregator;
  private subscription: Subscription;
  private youtubeGateway: YoutubeGateway;
  private searchTerms: string;
  private items: Youtube[];
  private allItems: Youtube[];


  private pageSize: number = 10;
  private sortOrder: string;
  private releaseYear: number;
  
  
  private pager: IPager;
  private nextPageToken: string = '';
  private filterSearchTerms: string
  private created() {
  }
  private bind(bindingContext) {

    this.searchTerms = bindingContext.searchTerms;
    this.allItems = JSON.parse(localStorage.getItem('allItems'));
    this.items = JSON.parse(sessionStorage.getItem('items'));
    this.pager = JSON.parse(sessionStorage.getItem('pager'));

    sessionStorage.removeItem('items');
    sessionStorage.removeItem('pager');

    if (!this.allItems)
      this.fetchFirstMovies();
    else
      if (!this.pager)
        this.setPage(1);
  }
  private attached() {
    this.filteringSubscription();
    this.fetchAllMovies();
  }
  private detached() {
    this.subscription.dispose();
  }
  private filteringSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      //debugger;
      if (response.searchTerms != null)
        this.filterSearchTerms = response.searchTerms;

      if (response.pageSize != null)
        this.pageSize = response.pageSize;

      if (response.releaseYear != null)
        this.releaseYear = response.releaseYear;

      if (response.sortOrder != null)
        this.sortOrder = response.sortOrder;

      this.setPage(1);
    });
  }
  private fetchFirstMovies() {
    return this.youtubeGateway.searchMoviesByPlaylist(PLAYLIST_NEW_TO_RENT).then(data => {
      this.nextPageToken = data.nextPageToken;
      this.allItems = data.items || null;
      this.setPage(1);
    });
  }
  private fetchAllMovies() {
    if (localStorage.getItem('allItems')) return;
    return this.youtubeGateway.searchAllMoviesByPlaylist(PLAYLIST_NEW_TO_RENT, this.nextPageToken).then(data => {
      this.nextPageToken = null;
      this.allItems = data;
      localStorage.setItem('allItems', JSON.stringify(this.allItems));
    }).catch(error => {
      debugger;
    });
  }
  private nFormatter(num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }
  private range(start, end) {
    return Array.from(new Array(end - start), (x, i) => i + start)
  }
  private setPage(page) {

    var self = this;

    if (page < 1 || (this.pager && (page > this.pager.totalPages))) {
      return;
    }

    // get pager object from service
    this.pager = this.getPager(this.filteredItems.length, page, this.pageSize);

    // get current page of items
    this.items = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);

    wait(300, scrollToTop);
  }
  private getPager(totalItems, currentPage, pageSize): IPager {
    // default to first page
    currentPage = currentPage || 1;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = this.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
  private showMovie(videoId) {
    sessionStorage.setItem('items', JSON.stringify(this.items));
    sessionStorage.setItem('pager', JSON.stringify(this.pager));
    this.router.navigateToRoute('detail1', { videoId: videoId });
  }
  private get filteredItems() {
    var filteredItems: Youtube[] = this.allItems.slice();

    if (this.filterSearchTerms)
      filteredItems = filteredItems.filter(x => x.snippet.title.toLocaleLowerCase().includes(this.filterSearchTerms.toLocaleLowerCase()));

    if (this.releaseYear) {
      debugger;
      filteredItems = filteredItems.filter(x => moment(x.contentDetails.videoPublishedAt).year() == this.releaseYear);
    }

    if (this.sortOrder == 'title') {
      filteredItems = filteredItems.sort((n1, n2) => {
        if (n1.snippet.title > n2.snippet.title) {
          return 1;
        }

        if (n1.snippet.title < n2.snippet.title) {
          return -1;
        }
      });
    }

    if (this.sortOrder == 'videoPublishedAt') {
      filteredItems = filteredItems.sort((n1, n2) => {
        if (n1.contentDetails.videoPublishedAt < n2.contentDetails.videoPublishedAt) {
          return 1;
        }

        if (n1.contentDetails.videoPublishedAt > n2.contentDetails.videoPublishedAt) {
          return -1;
        }
      });
    }

    if (this.sortOrder == 'commentCount') {
      filteredItems = filteredItems.sort((n1, n2) => {
        if (+n1.statistics.commentCount < +n2.statistics.commentCount) {
          return 1;
        }

        if (+n1.statistics.commentCount > +n2.statistics.commentCount) {
          return -1;
        }
      });
    }

    if (this.sortOrder == 'likeCount') {
      filteredItems = filteredItems.sort((n1, n2) => {
        if (+n1.statistics.likeCount < +n2.statistics.likeCount) {
          return 1;
        }

        if (+n1.statistics.likeCount > +n2.statistics.likeCount) {
          return -1;
        }
      });
    }

    return filteredItems;
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const wait = (delay, fct) => {
  window.setTimeout(fct, delay);
};

