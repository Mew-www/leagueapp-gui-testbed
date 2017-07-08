import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinrateGraphComponent } from './winrate-graph.component';

describe('WinrateGraphComponent', () => {
  let component: WinrateGraphComponent;
  let fixture: ComponentFixture<WinrateGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinrateGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinrateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
