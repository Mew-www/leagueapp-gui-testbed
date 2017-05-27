import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList,
  ViewChildren
} from '@angular/core';
import {Championmastery} from "../../../../models/dto/championmastery";
import {TranslatorService} from "../../../../services/translator.service";

@Component({
  selector: 'summoner-champion-mastery-scroller',
  templateUrl: './summoner-champion-mastery-scroller.component.html',
  styleUrls: ['./summoner-champion-mastery-scroller.component.scss']
})
export class SummonerChampionMasteryScrollerComponent implements OnInit, AfterViewInit {

  @Input() masterypoints: Array<Championmastery>;

  @ViewChildren('lazy_mastery_scroller') lazy_scroller_query: QueryList<any>;
  private masteryscroller: ElementRef;
  private scrolling_masteries = false;
  private scrolling_masteries_timeout;
  private scrolling_masteries_right_available = false;
  private scrolling_masteries_left_available = false;

  private gettext: Function;

  constructor(private translator: TranslatorService,
              private changeDetector: ChangeDetectorRef) {
    this.gettext = this.translator.getTranslation;
  }

  private onMasteriesScrolled(e) {
    let scroller = e.target;

    if (this.scrolling_masteries) {
      // Refresh (=[if exists] clear old and [anyway] set new) timeout
      if (this.scrolling_masteries_timeout) {
        window.clearTimeout(this.scrolling_masteries_timeout);
      }
      this.scrolling_masteries_timeout = window.setTimeout(() => {
        this.scrolling_masteries = false;
        this.onMasteriesScrollingEnd(scroller);
      }, 1000);
    } else {
      console.log("Starting to scroll.");
      this.scrolling_masteries = true;
      this.scrolling_masteries_timeout = window.setTimeout(() => {
        this.scrolling_masteries = false;
        this.onMasteriesScrollingEnd(scroller);
      }, 1000);
    }

  }
  private onMasteriesScrollingEnd(scroller) {
    let masteries = <Array<Element>>Array.from(scroller.children);

    // Check right
    let scrollerRightmostPoint = scroller.getBoundingClientRect().right;
    let nonVisibleMasteriesToRight = masteries
    // "mastery's right edge is before (smaller px position than) scroller's rightmost edge" * (NOT)
      .filter(m => !(m.getBoundingClientRect().right <= scrollerRightmostPoint));
    this.scrolling_masteries_right_available = nonVisibleMasteriesToRight.length > 0;
    console.log(nonVisibleMasteriesToRight.length + " non-visible Masteries to the RIGHT");

    // Check left
    let scrollerLeftmostPoint = scroller.getBoundingClientRect().left;
    let nonVisibleMasteriesToLeft = masteries
    // "mastery's left edge is after (bigger px position [more to right] than) scroller's leftmost edge" * (NOT)
      .filter(m => !(m.getBoundingClientRect().left >= scrollerLeftmostPoint));
    this.scrolling_masteries_left_available = nonVisibleMasteriesToLeft.length > 0;
    console.log(nonVisibleMasteriesToLeft.length + " non-visible Masteries to the LEFT");
  }

  private onClickMasteriesGotoRight(scroller) {
    // If the 1s scrolling timeout still exists, cancel scrolling immediately
    if (this.scrolling_masteries) {
      if (this.scrolling_masteries_timeout) {
        window.clearTimeout(this.scrolling_masteries_timeout);
      }
      this.scrolling_masteries = false;
      this.onMasteriesScrollingEnd(scroller);
    }
    // Find how many non-visible masteries (if any) are there to scroll
    let masteries = <Array<Element>>Array.from(scroller.children);
    let scrollOffset = scroller.scrollLeft;
    let scrollerLeftMargin = scroller.getBoundingClientRect().left;
    let temporaryArrowMargin = 121;
    let scrollerWidth = scroller.getBoundingClientRect().right - scrollerLeftMargin;
    let scrollerRightmostPoint = scroller.getBoundingClientRect().right;
    let nonVisibleMasteriesToRight = masteries
    // "mastery's right edge is before (smaller px position than) scroller's rightmost edge" * (NOT)
      .filter(m => !(m.getBoundingClientRect().right <= scrollerRightmostPoint));
    if (nonVisibleMasteriesToRight.length === 0) {
      // No scrollable content
      return;
    }
    // Get the leftmost non-visible mastery and set el.scrollLeft there
    let toScrollLeft = scrollOffset + nonVisibleMasteriesToRight[0].getBoundingClientRect().left - scrollerLeftMargin - temporaryArrowMargin;
    if (toScrollLeft > (scroller.scrollWidth-scrollerWidth)) {
      console.log("This would go beyond max scrollWidth, resetting to scrollWidth.");
      toScrollLeft = scroller.scrollWidth-scrollerWidth;
    }
    scroller.scrollLeft = toScrollLeft; // This'll trigger onMasteriesScrolled and so forth (ScrollingEnd after 1s)
  }
  private onClickMasteriesGotoLeft(scroller) {
    // If the 1s scrolling timeout still exists, cancel scrolling immediately
    if (this.scrolling_masteries) {
      if (this.scrolling_masteries_timeout) {
        window.clearTimeout(this.scrolling_masteries_timeout);
      }
      this.scrolling_masteries = false;
      this.onMasteriesScrollingEnd(scroller);
    }
    // Find how many non-visible masteries (if any) are there to scroll
    let masteries = <Array<Element>>Array.from(scroller.children);
    let scrollOffset = scroller.scrollLeft;
    let scrollerLeftMargin = scroller.getBoundingClientRect().left;
    let temporaryArrowMargin = 121;
    let scrollerWidth = scroller.getBoundingClientRect().right - scrollerLeftMargin;
    let scrollerLeftmostPoint = scrollerLeftMargin;
    let nonVisibleMasteriesToLeft = masteries
    // "mastery's left edge is after (bigger px position [more to right] than) scroller's leftmost edge" * (NOT)
      .filter(m => !(m.getBoundingClientRect().left >= scrollerLeftmostPoint));
    this.scrolling_masteries_left_available = nonVisibleMasteriesToLeft.length > 0;
    console.log(nonVisibleMasteriesToLeft.length + " non-visible Masteries to the LEFT");
    if (nonVisibleMasteriesToLeft.length === 0) {
      // No scrollable content
      return;
    }
    // Get the rightmost non-visible mastery and how many pixels is it hidden => reverse to how many pixels OF IT are visible
    let firstToTheLeftBoundingClient = nonVisibleMasteriesToLeft[nonVisibleMasteriesToLeft.length-1].getBoundingClientRect();
    let howManyPixelsHidden = (firstToTheLeftBoundingClient.left * -1) + scrollerLeftMargin;
    // Width - hidden
    let visibleAmount = (firstToTheLeftBoundingClient.right - firstToTheLeftBoundingClient.left) - howManyPixelsHidden;
    let amountToReduce = scrollerWidth - visibleAmount;
    let toScrollLeft = scrollOffset - amountToReduce + temporaryArrowMargin;
    if (toScrollLeft < 0) {
      console.log("This would go below scrollLeft: 0, resetting to 0.");
      toScrollLeft = 0;
    }
    scroller.scrollLeft = toScrollLeft; // This'll trigger onMasteriesScrolled and so forth (ScrollingEnd after 1s)
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.lazy_scroller_query.changes
      .subscribe((matching_queried_components: QueryList<ElementRef>) => {
        if (matching_queried_components.length > 0) {
          // Initialize new scroller here as it was successfully queried
          this.masteryscroller = matching_queried_components.first;
          let scroller = this.masteryscroller.nativeElement;
          let masteries = <Array<Element>>Array.from(scroller.children);

          // Check right
          let scrollerRightmostPoint = scroller.getBoundingClientRect().right;
          let nonVisibleMasteriesToRight = masteries
          // "mastery's right edge is before (smaller px position than) scroller's rightmost edge" * (NOT)
            .filter(m => !(m.getBoundingClientRect().right < scrollerRightmostPoint));
          this.scrolling_masteries_right_available = nonVisibleMasteriesToRight.length > 0;

          // Check left
          let scrollerLeftmostPoint = scroller.getBoundingClientRect().left;
          let nonVisibleMasteriesToLeft = masteries
          // "mastery's left edge is after (bigger px position [more to right] than) scroller's leftmost edge" * (NOT)
            .filter(m => !(m.getBoundingClientRect().left > scrollerLeftmostPoint));
          this.scrolling_masteries_left_available = nonVisibleMasteriesToLeft.length > 0;

          // WE UPDATED UI COMPONENT STATES RIGHT >AFTER CHANGE( DETECTION)<
          // => UPDATE STATE BY MANUALLY DETECTING ANY NEW CHANGES
          // ^p.i.t.a. to debug if gotten wrong in production mode... it alerts only in dev mode
          this.changeDetector.detectChanges();
        }
      });
  }

}
