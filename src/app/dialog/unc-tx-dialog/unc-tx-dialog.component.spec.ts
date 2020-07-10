import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncTxDialogComponent } from './unc-tx-dialog.component';

describe('UncTxDialogComponent', () => {
  let component: UncTxDialogComponent;
  let fixture: ComponentFixture<UncTxDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncTxDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncTxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
