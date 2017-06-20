import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferredLanesComponent } from './preferred-lanes.component';

describe('PreferredLanesComponent', () => {
  let component: PreferredLanesComponent;
  let fixture: ComponentFixture<PreferredLanesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferredLanesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferredLanesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
