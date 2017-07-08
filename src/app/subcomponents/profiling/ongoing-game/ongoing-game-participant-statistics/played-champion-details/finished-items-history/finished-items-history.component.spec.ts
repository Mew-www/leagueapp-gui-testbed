import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedItemsHistoryComponent } from './finished-items-history.component';

describe('FinishedItemsHistoryComponent', () => {
  let component: FinishedItemsHistoryComponent;
  let fixture: ComponentFixture<FinishedItemsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedItemsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedItemsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
