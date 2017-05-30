import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPlayedChampionsComponent } from './participant-played-champions.component';

describe('ParticipantPlayedChampionsComponent', () => {
  let component: ParticipantPlayedChampionsComponent;
  let fixture: ComponentFixture<ParticipantPlayedChampionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantPlayedChampionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantPlayedChampionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
