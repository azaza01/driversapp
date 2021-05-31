import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecustomitemPage } from './createcustomitem.page';

describe('CreatecustomitemPage', () => {
  let component: CreatecustomitemPage;
  let fixture: ComponentFixture<CreatecustomitemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatecustomitemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecustomitemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
