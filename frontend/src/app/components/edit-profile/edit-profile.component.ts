import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';
import { Subject, takeUntil, debounceTime } from 'rxjs';

export interface UserProfile {
  id: number;
  username: string;
  description: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private usernameUpdateAttempts$ = new Subject<void>();
  private descriptionUpdateAttempts$ = new Subject<void>();
  
  isUpdatingUsername = false;
  isUpdatingDescription = false;
  private lastUsernameUpdate = 0;
  private lastDescriptionUpdate = 0;
  private readonly minTimeBetweenUpdates = 2000; // 2 seconds
  userId: number = 0;
  saveUsernameIcon: boolean = false;
  saveDescriptionIcon: boolean = false;
  saveEmailIcon: boolean = false;
  savePasswordIcon: boolean = false;
  newUsername: string = '';
  newDescription: string = '';
  username: string = '';
  description: string = '';

  constructor(
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {
    // Setup debounced username update attempts
    this.usernameUpdateAttempts$
      .pipe(
        debounceTime(800),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.executeUsernameUpdate();
      });
    
    // Setup debounced description update attempts
    this.descriptionUpdateAttempts$
      .pipe(
        debounceTime(800),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.executeDescriptionUpdate();
      });
  }
  
  ngOnInit(): void {
    this.loadUserData();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveUsername() {
    if (this.isUpdatingUsername) {
      this.notificationService.warning('Please wait, updating username...');
      return;
    }
    
    const now = Date.now();
    if (now - this.lastUsernameUpdate < this.minTimeBetweenUpdates) {
      this.notificationService.warning('Please wait before updating again');
      return;
    }
    
    this.usernameUpdateAttempts$.next();
  }
  
  private executeUsernameUpdate() {
    if (this.isUpdatingUsername) {
      return;
    }
    
    const usernameTextarea = document.getElementById(
      'username-id'
    ) as HTMLInputElement;

    if (
      !usernameTextarea ||
      !usernameTextarea.value ||
      usernameTextarea.value.trim() === ''
    ) {
      this.notificationService.error('Username cannot be empty');
      return;
    }

    const newUsername = usernameTextarea.value.trim();
    
    if (newUsername === this.username) {
      this.notificationService.info('Username is already up to date');
      return;
    }
    
    this.isUpdatingUsername = true;
    this.lastUsernameUpdate = Date.now();

    const profileData = {
      username: newUsername,
      description: this.description,
    };
    console.log('New username:', newUsername);

    this.profileService.updateUserProfile(this.userId, profileData).subscribe({
      next: () => {
        this.saveUsernameIcon = true;
        this.username = newUsername;
        this.newUsername = newUsername;
        this.loadUserData(); // Reload user data to reflect changes
        this.notificationService.success('Username updated successfully');
        this.notificationService.info('Refresh site to update changes');
        this.isUpdatingUsername = false;
        setTimeout(() => {
          this.saveUsernameIcon = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Failed to update username:', error);
        this.handleApiError(
          error,
          'Failed to update username. Please try again.'
        );
        this.isUpdatingUsername = false;
      },
    });
  }

  saveDescription() {
    if (this.isUpdatingDescription) {
      this.notificationService.warning('Please wait, updating description...');
      return;
    }
    
    const now = Date.now();
    if (now - this.lastDescriptionUpdate < this.minTimeBetweenUpdates) {
      this.notificationService.warning('Please wait before updating again');
      return;
    }
    
    this.descriptionUpdateAttempts$.next();
  }
  
  private executeDescriptionUpdate() {
    if (this.isUpdatingDescription) {
      return;
    }
    
    const descriptionTextarea = document.getElementById(
      'description-id'
    ) as HTMLTextAreaElement;

    const newDescription = descriptionTextarea
      ? descriptionTextarea.value.trim()
      : '';
      
    if (newDescription === this.description) {
      this.notificationService.info('Description is already up to date');
      return;
    }
    
    this.isUpdatingDescription = true;
    this.lastDescriptionUpdate = Date.now();
    
    console.log('New description:', newDescription);
    const profileData = {
      username: this.username,
      description: newDescription,
    };

    this.profileService.updateUserProfile(this.userId, profileData).subscribe({
      next: () => {
        this.saveDescriptionIcon = true;
        this.description = newDescription;
        this.newDescription = newDescription;
        this.loadUserData(); // Reload user data to reflect changes
        this.notificationService.success('Description updated successfully');
        this.isUpdatingDescription = false;
        setTimeout(() => {
          this.saveDescriptionIcon = false;
        }, 5000);
      },
      error: (error) => {
        this.handleApiError(
          error,
          'Failed to update description. Please try again.'
        );
        this.isUpdatingDescription = false;
      },
    });
  }

  loadUserData() {
    this.profileService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        this.userId = profile.id;
        this.username = profile.username;
        this.description = profile.description;
        this.newUsername = profile.username;
        this.newDescription = profile.description;
      },
      error: (error) => {
        console.error('Failed to update description:', error);
        this.handleApiError(
          error,
          'Failed to update description. Please try again.'
        );
      },
    });
  }

  cancelEdit() {
    this.profileService.setEditMode(false);
    this.newUsername = this.username;
    this.newDescription = this.description || '';
  }

  save() {
    if (this.isUpdatingUsername || this.isUpdatingDescription) {
      this.notificationService.warning('Please wait, update in progress...');
      return;
    }
    
    const usernameTextarea = document.getElementById('username-id') as HTMLInputElement;
    const descriptionTextarea = document.getElementById('description-id') as HTMLTextAreaElement;
    
    let hasChanges = false;
    
    if (usernameTextarea && usernameTextarea.value.trim() !== this.username) {
      this.saveUsername();
      hasChanges = true;
    }
    
    if (descriptionTextarea && descriptionTextarea.value.trim() !== this.description) {
      this.saveDescription();
      hasChanges = true;
    }
    
    if (!hasChanges) {
      this.notificationService.info('No changes to save');
    }
  }

  private handleApiError(
    error: any,
    defaultMessage: string = 'An error occurred'
  ) {
    let errorMessage = defaultMessage;

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 400) {
      errorMessage = 'Bad request - please check your input';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized - please login again';
    } else if (error.status === 403) {
      errorMessage = 'Access forbidden';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found';
    } else if (error.status === 500) {
      errorMessage = 'Server error - please try again later';
    }

    this.notificationService.error(errorMessage);
  }
}
