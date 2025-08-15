import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeFiltersComponent } from './recipe-filters.component';

describe('RecipeFiltersComponent', () => {
  let component: RecipeFiltersComponent;
  let fixture: ComponentFixture<RecipeFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
