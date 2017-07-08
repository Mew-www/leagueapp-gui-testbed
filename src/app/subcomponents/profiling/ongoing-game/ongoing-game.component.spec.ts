import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingGameComponent } from './ongoing-game.component';

describe('OngoingGameComponent', () => {
  let component: OngoingGameComponent;
  let fixture: ComponentFixture<OngoingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
