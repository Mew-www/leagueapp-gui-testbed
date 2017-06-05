import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayedChampionDetailsComponent } from './played-champion-details.component';

describe('PlayedChampionDetailsComponent', () => {
  let component: PlayedChampionDetailsComponent;
  let fixture: ComponentFixture<PlayedChampionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayedChampionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayedChampionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
