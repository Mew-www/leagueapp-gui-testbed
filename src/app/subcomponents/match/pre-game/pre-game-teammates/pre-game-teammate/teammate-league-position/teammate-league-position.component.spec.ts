import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeammateLeaguePositionComponent } from './teammate-league-position.component';

describe('TeammateLeaguePositionComponent', () => {
  let component: TeammateLeaguePositionComponent;
  let fixture: ComponentFixture<TeammateLeaguePositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeammateLeaguePositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeammateLeaguePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
