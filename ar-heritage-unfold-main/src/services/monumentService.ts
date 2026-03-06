// Monument Service for API calls
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

export interface MonumentData {
  name: string;
  description: string;
  location?: string;
  historical_era?: string;
  condition_status?: string;
  model_url?: string;
}

export interface CreateMonumentPayload extends MonumentData {
  thumbnail?: Blob;
  model?: Blob;
  timestamp: string;
}

export class MonumentService {
  static async createMonument(data: CreateMonumentPayload): Promise<any> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('timestamp', data.timestamp);
    
    if (data.location) formData.append('location', data.location);
    if (data.historical_era) formData.append('historical_era', data.historical_era);
    if (data.condition_status) formData.append('condition_status', data.condition_status);
    if (data.model_url) formData.append('model_url', data.model_url);
    
    // Add files
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail, 'thumbnail.jpg');
    }
    
    if (data.model) {
      formData.append('model', data.model, 'model.glb');
    }

    try {
      const response = await fetch(API_ENDPOINTS.monuments.create, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create monument' }));
        throw new Error(error.error || 'Failed to create monument');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating monument:', error);
      throw error;
    }
  }

  static async getMonuments(params?: {
    era?: string;
    condition?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (params?.era) queryParams.append('era', params.era);
    if (params?.condition) queryParams.append('condition', params.condition);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${API_ENDPOINTS.monuments.list}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch monuments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching monuments:', error);
      throw error;
    }
  }

  static async uploadThumbnail(file: Blob): Promise<string> {
    // For now, create a local URL
    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    return URL.createObjectURL(file);
  }

  static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
