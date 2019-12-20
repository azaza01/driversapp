import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsyncdataPage } from './unsyncdata.page';

describe('UnsyncdataPage', () => {
  let component: UnsyncdataPage;
  let fixture: ComponentFixture<UnsyncdataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsyncdataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsyncdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
