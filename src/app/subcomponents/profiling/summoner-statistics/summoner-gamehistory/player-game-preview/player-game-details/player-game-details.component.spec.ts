import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGameDetailsComponent } from './player-game-details.component';

describe('PlayerGameDetailsComponent', () => {
  let component: PlayerGameDetailsComponent;
  let fixture: ComponentFixture<PlayerGameDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerGameDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerGameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
