import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiwaComponent } from './siwa.component';

describe('SiwaComponent', () => {
  let component: SiwaComponent;
  let fixture: ComponentFixture<SiwaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiwaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
