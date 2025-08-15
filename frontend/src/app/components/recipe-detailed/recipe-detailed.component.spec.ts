import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailedComponent } from './recipe-detailed.component';

describe('RecipeDetailedComponent', () => {
  let component: RecipeDetailedComponent;
  let fixture: ComponentFixture<RecipeDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetailedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
