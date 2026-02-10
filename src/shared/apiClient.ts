const API_BASE_URL = "/api";

async function handleResponse<T>(response: Response): Promise<{ success: boolean; data?: T; error?: string }> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
    return { success: false, error: errorData.error || "An unknown error occurred" };
  }
  const data = await response.json();
  return data;
}

export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  return handleResponse<any[]>(response);
}

export async function createProject(projectData: { name: string; description?: string; theme?: string; project_type?: string; }) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });
  return handleResponse<any>(response);
}

export async function getContentItems(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content`);
  return handleResponse<any[]>(response);
}

export async function createContentItem(projectId: string, contentData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contentData),
  });
  return handleResponse<any>(response);
}

export async function generateContent(themes: string[], reference_image: string | null) {
  const response = await fetch(`${API_BASE_URL}/generate/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        themes,
        content_types: ['post', 'video', 'landing_page'],
        platforms: ['instagram', 'facebook', 'twitter', 'youtube', 'linkedin'],
        reference_image
      }),
  });
  return handleResponse<any>(response);
}

export async function uploadImage(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });
      return handleResponse<any>(response);
}

export async function generatePostSuggestions(topic: string, style: string, platform: string) {
    const response = await fetch(`${API_BASE_URL}/generate/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          style,
          platform,
          count: 10
        }),
      });
      return handleResponse<any[]>(response);
}

export async function getBrandKit() {
    const response = await fetch(`${API_BASE_URL}/brand-kit`);
    return handleResponse<any>(response);
}

export async function saveBrandKit(brandKitData: any) {
    const response = await fetch(`${API_BASE_URL}/brand-kit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandKitData),
    });
    return handleResponse<any>(response);
}
