import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingGameParticipantStatisticsComponent } from './ongoing-game-participant-statistics.component';

describe('OngoingGameParticipantStatisticsComponent', () => {
  let component: OngoingGameParticipantStatisticsComponent;
  let fixture: ComponentFixture<OngoingGameParticipantStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingGameParticipantStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingGameParticipantStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
