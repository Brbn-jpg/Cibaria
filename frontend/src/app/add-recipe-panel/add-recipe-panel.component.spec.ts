import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipePanelComponent } from './add-recipe-panel.component';

describe('AddRecipePanelComponent', () => {
  let component: AddRecipePanelComponent;
  let fixture: ComponentFixture<AddRecipePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecipePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
