import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

export interface UserProfile {
  id: number;
  username: string;
  description: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent {
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
    this.loadUserData();
  }

  saveUsername() {
    const usernameTextarea = document.getElementById(
      'username-id'
    ) as HTMLInputElement;

    if (
      !usernameTextarea ||
      !usernameTextarea.value ||
      usernameTextarea.value.trim() === ''
    ) {
      alert('Username cannot be empty');
      return;
    }

    const newUsername = usernameTextarea.value.trim();

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
      },
    });
  }

  saveDescription() {
    const descriptionTextarea = document.getElementById(
      'description-id'
    ) as HTMLTextAreaElement;

    const newDescription = descriptionTextarea
      ? descriptionTextarea.value.trim()
      : '';
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
        setTimeout(() => {
          this.saveDescriptionIcon = false;
        }, 5000);
      },
      error: (error) => {
        alert('Failed to update description. Please try again.');
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
    if (this.username != '') {
      this.saveUsername();
    }
    if (this.description != '') {
      this.saveDescription();
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
