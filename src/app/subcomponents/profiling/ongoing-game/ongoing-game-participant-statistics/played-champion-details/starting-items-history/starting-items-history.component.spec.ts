import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartingItemsHistoryComponent } from './starting-items-history.component';

describe('StartingItemsHistoryComponent', () => {
  let component: StartingItemsHistoryComponent;
  let fixture: ComponentFixture<StartingItemsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartingItemsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartingItemsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
