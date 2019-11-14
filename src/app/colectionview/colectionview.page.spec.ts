import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColectionviewPage } from './colectionview.page';

describe('ColectionviewPage', () => {
  let component: ColectionviewPage;
  let fixture: ComponentFixture<ColectionviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColectionviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColectionviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
