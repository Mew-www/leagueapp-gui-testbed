import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameTeammatesComponent } from './pre-game-teammates.component';

describe('PreGameTeammatesComponent', () => {
  let component: PreGameTeammatesComponent;
  let fixture: ComponentFixture<PreGameTeammatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGameTeammatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGameTeammatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
