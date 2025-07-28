import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UpdateEmailDto {
  newEmail: string;
  password: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  private baseUrl = 'http://localhost:8080/api';

  private getAuthHeaders(): HttpHeaders | undefined {
    const token = localStorage.getItem('token');
    return token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>('http://localhost:8080/api/users/aboutme', {
      headers,
    });
  }

  // Username and description only
  updateUserProfile(userId: number, userData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `http://localhost:8080/api/users/${userId}/profile`,
      userData,
      {
        headers,
      }
    );
  }

  updateUserEmail(userId: number, userData: UpdateEmailDto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.baseUrl}/users/${userId}/email`,
      userData,
      { headers }
    );
  }

  updateUserPassword(
    userId: number,
    userData: UpdatePasswordDto
  ): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(
      `${this.baseUrl}/users/${userId}/password`,
      userData,
      { headers }
    );
  }

  private setImageSafely(selector: string, imageUrl: string): void {
    const imageElement = document.querySelector(selector) as HTMLImageElement;
    if (imageElement) {
      imageElement.crossOrigin = 'anonymous';
      imageElement.src = imageUrl;
    }
  }

  editProfilePicture(userId: number, event: Event): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5 MB limit.');
          return;
        }
        this.uploadProfilePicture(userId, file).subscribe({
          next: (imageUrl) => {
            this.setImageSafely('.profile-picture', imageUrl);
          },
          error: (error) => {
            console.error('Error uploading profile picture:', error);
            alert('Failed to upload profile picture.');
          },
        });
      }
    };
    fileInput.click();
  }

  editBackgroundPicture(userId: number, event: Event): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
          alert('File size exceeds 5 MB limit.');
          return;
        }
        this.uploadBackgroundPicture(userId, file).subscribe({
          next: (imageUrl) => {
            this.setImageSafely('.background-image', imageUrl);
          },
          error: (error) => {
            console.error('Error uploading background picture:', error);
            alert('Failed to upload background picture.');
          },
        });
      }
    };
    fileInput.click();
  }

  private uploadProfilePicture(userId: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = this.getAuthHeaders();
    return this.http.put(
      `http://localhost:8080/api/users/${userId}/profile-picture`,
      formData,
      {
        headers,
        responseType: 'text',
      }
    );
  }

  private uploadBackgroundPicture(
    userId: number,
    file: File
  ): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = this.getAuthHeaders();
    return this.http.put(
      `http://localhost:8080/api/users/${userId}/background-picture`,
      formData,
      {
        headers,
        responseType: 'text',
      }
    );
  }
}
