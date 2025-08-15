import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification.service';

export interface UserProfileResponse {
  id: number;
}

@Component({
  selector: 'app-settings-profile',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './settings-profile.component.html',
  styleUrl: './settings-profile.component.css',
})
export class SettingsProfileComponent implements OnInit {
  userId!: number;
  email: string = '';
  newPasswordInput: string = '';
  saveEmailIcon: boolean = false;
  savePasswordIcon: boolean = false;
  settings: boolean = true;

  constructor(
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  saveEmail() {
    const passwordInput = document.getElementById(
      'password-id'
    ) as HTMLInputElement;

    // Validate new email using Angular binding
    if (!this.email || this.email.trim() === '') {
      this.notificationService.warning('Email cannot be empty');
      return;
    }

    // Validate password from DOM element
    if (
      !passwordInput ||
      !passwordInput.value ||
      passwordInput.value.trim() === ''
    ) {
      this.notificationService.warning('Password is required to change email');
      return;
    }

    const newEmail = this.email.trim().toLowerCase();
    const password = passwordInput.value.trim();

    // Validate email format
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!emailRegex.test(newEmail)) {
      this.notificationService.error('Invalid email format');
      return;
    }

    console.log('Updating email...');

    const updateEmailDto = {
      newEmail: newEmail,
      password: password,
    };

    this.profileService.updateUserEmail(this.userId, updateEmailDto).subscribe({
      next: () => {
        this.saveEmailIcon = true;
        // Clear fields
        this.email = '';
        passwordInput.value = '';
        this.loadUserData();

        // Show success notification
        this.notificationService.success('Email updated successfully!');

        setTimeout(() => {
          this.saveEmailIcon = false;
        }, 5000);
      },
      error: (error) => {
        console.error('Failed to update Email:', error);
        this.handleApiError(error, 'Failed to update Email. Please try again.');
      },
    });
  }
  savePassword() {
    const currentPasswordInput = document.getElementById(
      'current-password-id'
    ) as HTMLInputElement;

    // Validate current password from DOM element
    if (
      !currentPasswordInput ||
      !currentPasswordInput.value ||
      currentPasswordInput.value.trim() === ''
    ) {
      alert('Current password cannot be empty');
      return;
    }

    // Validate new password using Angular binding
    if (!this.newPasswordInput || this.newPasswordInput.trim() === '') {
      alert('New password cannot be empty');
      return;
    }

    const currentPassword = currentPasswordInput.value.trim();
    const newPassword = this.newPasswordInput.trim();

    // Validate password length (zgodnie z backendem)
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (newPassword.length > 64) {
      alert('Password cannot be longer than 64 characters');
      return;
    }

    // Validate password complexity (digit and uppercase letter)
    if (!/.*\d.*/.test(newPassword)) {
      alert('Password must contain at least one digit');
      return;
    }

    if (!/.*[A-Z].*/.test(newPassword)) {
      alert('Password must contain at least one uppercase letter');
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      alert('New password must be different from the current password');
      return;
    }

    console.log('Updating password...');

    const updatePasswordDto = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    this.profileService
      .updateUserPassword(this.userId, updatePasswordDto)
      .subscribe({
        next: () => {
          this.savePasswordIcon = true;
          // Clear all password fields
          currentPasswordInput.value = '';
          this.newPasswordInput = '';
          this.loadUserData(); // Reload user data to reflect changes

          // Show success notification
          this.notificationService.success('Password updated successfully!');

          setTimeout(() => {
            this.savePasswordIcon = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Failed to update password:', error);
          this.handleApiError(
            error,
            'Failed to update password. Please try again.'
          );
        },
      });
  }

  loadUserData() {
    this.profileService.getUserProfile().subscribe({
      next: (response: UserProfileResponse) => {
        if (response) {
          this.userId = response.id;
        }
      },
    });
  }

  save() {
    if (this.email != '') {
      this.saveEmail();
    }
    if (this.newPasswordInput != '') {
      this.savePassword();
    }
  }
  cancelSettings() {
    this.profileService.setSettingsMode(false);
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
      errorMessage = 'Unauthorized - one of the passwords is not matching';
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
