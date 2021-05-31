import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectcategoryPage } from './selectcategory.page';

describe('SelectcategoryPage', () => {
  let component: SelectcategoryPage;
  let fixture: ComponentFixture<SelectcategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectcategoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectcategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
