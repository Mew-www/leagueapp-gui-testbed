import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquarebraceTitledContainerComponent } from './squarebrace-titled-container.component';

describe('SquarebraceTitledContainerComponent', () => {
  let component: SquarebraceTitledContainerComponent;
  let fixture: ComponentFixture<SquarebraceTitledContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquarebraceTitledContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquarebraceTitledContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
