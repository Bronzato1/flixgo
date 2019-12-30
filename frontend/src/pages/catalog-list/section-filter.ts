import { IFilter } from './../../interfaces/filter-interface';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { bindable, observable, autoinject } from 'aurelia-framework';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';

@autoinject()
export class SectionFilter {
  constructor(eventAgregator: EventAggregator) {
    this.ea = eventAgregator;
  }
  private ea: EventAggregator;
  private subscription: Subscription;
  private filterSearchTerms: string;
  private observers: MutationObserver[] = [];
  @bindable
  private pageSize = '10 éléments';
  @bindable
  private sortOrder = 'Pertinence';
  @bindable
  private releaseYear = 'N\'importe quand';
  private attached() {
    this.filteringSubscription();
    this.prepareFilters();
    this.observeDOM('pageSize');
    this.observeDOM('sortOrder');
    this.observeDOM('releaseYear');
  }
  private detach() {
    // L'observation peut être arrêtée par la suite
    this.observers.forEach(x => x.disconnect());
  }
  private prepareFilters() {
    // Scrollbars sur les listes de filtres
    (<any>$('.scrollbar-dropdown')).mCustomScrollbar({
      axis: "y",
      scrollbarPosition: "outside",
      theme: "custom-bar"
    });
    // Conversion en minuscule sur les textes des listes de filtres
    $('.filter__item-menu li').each(function () {
      $(this).attr('data-value', $(this).text().toLowerCase());
    });
    // Affichage du filtre sélectionné au clic
    $('.filter__item-menu li').on('click', function () {
      var text = $(this).text();
      var item = $(this);
      var id = item.closest('.filter__item').attr('id');
      $('#' + id).find('.filter__item-btn input').val(text);
    });
  }
  private resetFilters() {
    //debugger;
    this.pageSize = '10 éléments';
    this.sortOrder = 'Pertinence';
    this.releaseYear = 'N\'importe quand';
  }
  private filteringSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      if (response.searchTerms != null)
        this.filterSearchTerms = response.searchTerms;
    });
  }
  private resetSearchTerms() {
    //debugger;
    this.filterSearchTerms = '';
    this.ea.publish('filtering', { searchTerms: this.filterSearchTerms });
  }
  private observeDOM(elm) {
    //debugger;
    // Selectionne le noeud dont les mutations seront observées
    var targetNode = document.getElementById(elm);
    // Options de l'observateur (quelles sont les mutations à observer)
    var config = { attributes: true, childList: true };
    // Créé une instance de l'observateur lié à la fonction de callback
    var mutationObserver = new MutationObserver(callback);
    this.observers.push(mutationObserver);
    // Commence à observer le noeud cible pour les mutations précédemment configurées
    mutationObserver.observe(targetNode, config);
    var self = this;
    // Fonction callback à éxécuter quand une mutation est observée
    function callback() {
      self[elm] = $('#' + elm).val();
    }
  }
  private get showResetFiltersButton() {
    return true;
  }
  private pageSizeChanged() {
    //debugger;
    var nbr: number = +this.pageSize.substr(0, 2);
    var data: IFilter = { pageSize: nbr };
    if (this.ea) this.ea.publish('filtering', data);
  }
  private sortOrderChanged() {
    var data: IFilter = {};
    switch (this.sortOrder) {
      case 'Pertinence':
        data.sortOrder = '';
        break;
      case 'Titre du film':
        data.sortOrder = 'title'
        break;
      case 'Mise en ligne':
        data.sortOrder = 'videoPublishedAt';
        break;
      case 'Nombre de com':
        data.sortOrder = 'commentCount';
        break;
      case 'Nombre de likes':
        data.sortOrder = 'likeCount';
        break;
    }

    if (this.ea) this.ea.publish('filtering', data);
  }
  private releaseYearChanged() {
    //debugger;
    var data: IFilter = {};
    switch (this.releaseYear) {
      case '':
        data.releaseYear = null;
        break;
      case 'Cette année':
        data.releaseYear = new Date().getFullYear()
                break;
      case 'Il y a 1 an':
        data.releaseYear = new Date().getFullYear() - 1;
        break;
      case 'Il y a 2 ans':
        data.releaseYear = new Date().getFullYear() - 2;
        break;
      case 'Il y a 3 ans':
        data.releaseYear = new Date().getFullYear() - 3;
        break;
    }

    if (this.ea) this.ea.publish('filtering', data);
  }
}
