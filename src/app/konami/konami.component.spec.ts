/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KonamiComponent } from './konami.component';

describe('KonamiComponent', () => {
  let component: KonamiComponent;
  let fixture: ComponentFixture<KonamiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KonamiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KonamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
