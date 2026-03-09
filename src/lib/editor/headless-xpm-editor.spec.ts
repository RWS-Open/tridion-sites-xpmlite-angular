import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadlessXpmEditor } from './headless-xpm-editor';

describe('HeadlessXpmAngularEditor', () => {
  let component: HeadlessXpmEditor;
  let fixture: ComponentFixture<HeadlessXpmEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadlessXpmEditor]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeadlessXpmEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
