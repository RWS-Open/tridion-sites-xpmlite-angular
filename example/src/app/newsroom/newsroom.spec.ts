import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newsroom } from './newsroom';

describe('Newsroom', () => {
  let component: Newsroom;
  let fixture: ComponentFixture<Newsroom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Newsroom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Newsroom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
