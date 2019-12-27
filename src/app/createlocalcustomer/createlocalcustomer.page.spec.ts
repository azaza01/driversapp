import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatelocalcustomerPage } from './createlocalcustomer.page';

describe('CreatelocalcustomerPage', () => {
  let component: CreatelocalcustomerPage;
  let fixture: ComponentFixture<CreatelocalcustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatelocalcustomerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatelocalcustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
