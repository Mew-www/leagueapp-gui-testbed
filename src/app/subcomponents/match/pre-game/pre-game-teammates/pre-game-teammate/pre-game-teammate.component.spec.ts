import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameTeammateComponent } from './pre-game-teammate.component';

describe('PreGameTeammateComponent', () => {
  let component: PreGameTeammateComponent;
  let fixture: ComponentFixture<PreGameTeammateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGameTeammateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGameTeammateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
