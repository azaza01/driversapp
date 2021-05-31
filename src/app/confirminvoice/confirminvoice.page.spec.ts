import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirminvoicePage } from './confirminvoice.page';

describe('ConfirminvoicePage', () => {
  let component: ConfirminvoicePage;
  let fixture: ComponentFixture<ConfirminvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirminvoicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirminvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
