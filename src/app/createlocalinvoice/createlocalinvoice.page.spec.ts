import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatelocalinvoicePage } from './createlocalinvoice.page';

describe('CreatelocalinvoicePage', () => {
  let component: CreatelocalinvoicePage;
  let fixture: ComponentFixture<CreatelocalinvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatelocalinvoicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatelocalinvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
