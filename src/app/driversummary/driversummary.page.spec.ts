import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversummaryPage } from './driversummary.page';

describe('DriversummaryPage', () => {
  let component: DriversummaryPage;
  let fixture: ComponentFixture<DriversummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversummaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
