import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdevPage } from './coldev.page';

describe('ColdevPage', () => {
  let component: ColdevPage;
  let fixture: ComponentFixture<ColdevPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColdevPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
