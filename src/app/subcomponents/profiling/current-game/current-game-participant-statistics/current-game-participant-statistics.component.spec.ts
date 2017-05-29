import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentGameParticipantStatisticsComponent } from './current-game-participant-statistics.component';

describe('CurrentGameParticipantStatisticsComponent', () => {
  let component: CurrentGameParticipantStatisticsComponent;
  let fixture: ComponentFixture<CurrentGameParticipantStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentGameParticipantStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGameParticipantStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
