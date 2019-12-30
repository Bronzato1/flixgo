import { IFilter } from './../../interfaces/filter-interface';
import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine, bindable, observable, autoinject } from 'aurelia-framework';
import 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css';
import 'malihu-custom-scrollbar-plugin';
import 'jquery.mousewheel';

@autoinject()
export class SectionFilter {
  constructor(bindingEngine: BindingEngine, eventAgregator: EventAggregator) {
    this.be = bindingEngine;
    this.ea = eventAgregator;
  }
  private be: BindingEngine;
  private ea: EventAggregator;
  private subscription: Subscription;
  private observers: MutationObserver[] = [];

  @bindable
  private filters: IFilter = { 
    pageSizeText: '10 éléments', 
    pageSizeValue: 10, 
    sortOrderText: 'Pertinence', 
    sortOrderValue: null,
    releaseYearText: 'N\'importe quand',
    releaseYearValue: null
  };
  private bind() {
    this.be.propertyObserver(this.filters, 'searchTerms').subscribe(() => { this.searchTermsChanged(); });
    this.be.propertyObserver(this.filters, 'pageSizeText').subscribe(() => { this.pageSizeTextChanged(); });
    this.be.propertyObserver(this.filters, 'sortOrderText').subscribe(() => { this.sortOrderTextChanged(); });
    this.be.propertyObserver(this.filters, 'releaseYearText').subscribe(() => { this.releaseYearTextChanged(); });
  } 
  private attached() {
    this.filteringSubscription();
    this.prepareFilters();
    this.observeDOM('pageSizeText');
    this.observeDOM('sortOrderText');
    this.observeDOM('releaseYearText');
    this.resetFilters();
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
    this.filters.searchTerms = null;

    this.filters.pageSizeText = '10 éléments';
    this.filters.pageSizeValue = 10;

    this.filters.sortOrderText = 'Pertinence';
    this.filters.sortOrderValue = null;

    this.filters.releaseYearText = 'N\'importe quand';
    this.filters.releaseYearValue = null;
  }
  private filteringSubscription() {
    this.subscription = this.ea.subscribe('filtering', (response: IFilter) => {
      this.filters = response;
    });
  }
  private resetSearchTerms() {
    this.filters.searchTerms = null;
  }
  private observeDOM(elm) {
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
      if (self.filters[elm])
        self.filters[elm] = $('#' + elm).val();
      else
        self[elm] = $('#' + elm).val();
    }
  }
  private get showResetFiltersButton() {
    return true;
  }
  private searchTermsChanged() {
    this.filtersChanged();
  }
  private pageSizeTextChanged() {
    var nbr: number = +this.filters.pageSizeText.substr(0, 2);
    this.filters.pageSizeValue = nbr;
    this.filtersChanged();
  }
  private sortOrderTextChanged() {
    switch (this.filters.sortOrderText) {
      case 'Pertinence':
        this.filters.sortOrderValue = '';
        break;
      case 'Titre du film':
        this.filters.sortOrderValue = 'title'
        break;
      case 'Mise en ligne':
        this.filters.sortOrderValue = 'videoPublishedAt';
        break;
      case 'Nombre de com':
        this.filters.sortOrderValue = 'commentCount';
        break;
      case 'Nombre de likes':
        this.filters.sortOrderValue = 'likeCount';
        break;
    }

    this.filtersChanged();
    //if (this.ea) this.ea.publish('filtering', data);
  }
  private releaseYearTextChanged() {

    var data: IFilter = {};
    switch (this.filters.releaseYearText) {
      case 'N\'importe quand':
        this.filters.releaseYearValue = null;
        break;
      case 'Cette année':
        this.filters.releaseYearValue = new Date().getFullYear()
        break;
      case 'Il y a 1 an':
        this.filters.releaseYearValue = new Date().getFullYear() - 1;
        break;
      case 'Il y a 2 ans':
        this.filters.releaseYearValue = new Date().getFullYear() - 2;
        break;
      case 'Il y a 3 ans':
        this.filters.releaseYearValue = new Date().getFullYear() - 3;
        break;
    }
    this.filtersChanged();
  }
  private filtersChanged() {
    if (this.ea) this.ea.publish('filtering', this.filters);
  }
}
