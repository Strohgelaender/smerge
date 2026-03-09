import httpService from './HttpService';

export interface TutorialProjectResponse {
  project_id: string;
  pin: string;
  file_id: number;
  success: boolean;
  error?: string;
}

/**
 * Neues Tutorial-Projekt erstellen
 */
export async function createTutorialProject(): Promise<TutorialProjectResponse | null> {
  try {
    const response = await httpService.postAsync<TutorialProjectResponse>(
      '/api/tutorial/create',
      {},
      'POST',
      true,  // suppressNotificationSuccess
      false  // suppressNotificationFail
    );

    if (response.success) {
      return response;
    } else {
      console.error('Tutorial project creation failed:', response.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating tutorial project:', error);
    return null;
  }
}

// TODO Tutorial-Projekt beim beenden löschen


