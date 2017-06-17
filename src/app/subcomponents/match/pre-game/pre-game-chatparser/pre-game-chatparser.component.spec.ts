import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGameChatparserComponent } from './pre-game-chatparser.component';

describe('PreGameChatparserComponent', () => {
  let component: PreGameChatparserComponent;
  let fixture: ComponentFixture<PreGameChatparserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreGameChatparserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGameChatparserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
