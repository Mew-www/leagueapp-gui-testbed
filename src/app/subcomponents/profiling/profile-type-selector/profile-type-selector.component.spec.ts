import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTypeSelectorComponent } from './profile-type-selector.component';

describe('ProfileTypeSelectorComponent', () => {
  let component: ProfileTypeSelectorComponent;
  let fixture: ComponentFixture<ProfileTypeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTypeSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
