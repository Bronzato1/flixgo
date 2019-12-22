import { YoutubeGateway } from './../../gateways/youtube-gateway';
import { Youtube } from '../../models/youtube-model';
import { autoinject, bindable } from 'aurelia-framework';
import { debug } from 'util';

@autoinject()
export class SectionCatalog {
  constructor(youtubeGateway: YoutubeGateway) {
    this.youtubeGateway = youtubeGateway;
  }
  private youtubeGateway: YoutubeGateway;
  private searchTerms: string;
  private items: Youtube[];
  private allItems: Youtube[];
  private pager: ObjPager;
  private nextPageToken: string = '';
  private created() {
  }
  private bind(bindingContext) {
    this.searchTerms = bindingContext.searchTerms;
    this.youtubeGateway.searchVideos(this.searchTerms).then(data => {
      this.nextPageToken = (<any>data).nextPageToken;
      this.allItems = (<any>data).items || null;
      this.setPage(1);
    });
  }
  private attached() {
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

    if (page < 1 || (this.pager && page > this.pager.totalPages)) {
      return;
    }

    // get pager object from service
    this.pager = this.getPager(999, page, 6);

    // fetch if required pages are not yet present
    if (this.pager.endIndex > this.allItems.length) {
      this.youtubeGateway.searchVideos(this.searchTerms, this.nextPageToken).then(data => {
        // append new data in array
        self.allItems = self.allItems.concat((<any>data).items);
        // get current page of items
        self.items = self.allItems.slice(self.pager.startIndex, self.pager.endIndex + 1);
      });
    } else {
      // get current page of items
      this.items = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }
  private getPager(totalItems, currentPage, pageSize): ObjPager {
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
        startPage = totalPages - 3;
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
}

interface ObjPager {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: Array<number>;
}
