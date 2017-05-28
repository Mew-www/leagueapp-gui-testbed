import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentGameComponent } from './current-game.component';

describe('CurrentGameComponent', () => {
  let component: CurrentGameComponent;
  let fixture: ComponentFixture<CurrentGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
