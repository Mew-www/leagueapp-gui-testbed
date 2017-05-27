import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerChampionMasteryScrollerComponent } from './summoner-champion-mastery-scroller.component';

describe('SummonerChampionMasteryScrollerComponent', () => {
  let component: SummonerChampionMasteryScrollerComponent;
  let fixture: ComponentFixture<SummonerChampionMasteryScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummonerChampionMasteryScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerChampionMasteryScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
