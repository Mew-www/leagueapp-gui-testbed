import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonerSpellIconComponent } from './summoner-spell-icon.component';

describe('SummonerSpellIconComponent', () => {
  let component: SummonerSpellIconComponent;
  let fixture: ComponentFixture<SummonerSpellIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummonerSpellIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerSpellIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
