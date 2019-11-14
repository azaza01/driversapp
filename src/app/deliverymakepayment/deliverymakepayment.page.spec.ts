import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverymakepaymentPage } from './deliverymakepayment.page';

describe('DeliverymakepaymentPage', () => {
  let component: DeliverymakepaymentPage;
  let fixture: ComponentFixture<DeliverymakepaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverymakepaymentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverymakepaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
