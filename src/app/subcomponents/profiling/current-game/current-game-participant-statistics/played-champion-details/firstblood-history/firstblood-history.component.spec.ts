import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstbloodHistoryComponent } from './firstblood-history.component';

describe('FirstbloodHistoryComponent', () => {
  let component: FirstbloodHistoryComponent;
  let fixture: ComponentFixture<FirstbloodHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstbloodHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstbloodHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
