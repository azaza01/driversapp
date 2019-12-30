import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewmapPage } from './viewmap.page';

describe('ViewmapPage', () => {
  let component: ViewmapPage;
  let fixture: ComponentFixture<ViewmapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewmapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewmapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
