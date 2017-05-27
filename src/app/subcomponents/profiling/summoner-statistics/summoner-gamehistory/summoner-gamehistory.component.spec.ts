import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerGamehistoryComponent } from './summoner-gamehistory.component';

describe('SummonerGamehistoryComponent', () => {
  let component: SummonerGamehistoryComponent;
  let fixture: ComponentFixture<SummonerGamehistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummonerGamehistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerGamehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
