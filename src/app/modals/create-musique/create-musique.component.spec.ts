import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMusiqueComponent } from './create-musique.component';

describe('CreateMusiqueComponent', () => {
  let component: CreateMusiqueComponent;
  let fixture: ComponentFixture<CreateMusiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMusiqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMusiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
