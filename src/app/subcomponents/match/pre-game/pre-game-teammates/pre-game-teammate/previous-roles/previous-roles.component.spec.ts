import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousRolesComponent } from './previous-roles.component';

describe('PreviousRolesComponent', () => {
  let component: PreviousRolesComponent;
  let fixture: ComponentFixture<PreviousRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
