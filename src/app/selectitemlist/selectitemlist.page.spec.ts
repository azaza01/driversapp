import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectitemlistPage } from './selectitemlist.page';

describe('SelectitemlistPage', () => {
  let component: SelectitemlistPage;
  let fixture: ComponentFixture<SelectitemlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectitemlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectitemlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
