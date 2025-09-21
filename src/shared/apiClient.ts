// A client for communicating with the backend worker API.

const API_BASE_URL = "/api";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<{ success: boolean; data?: T; error?: string }> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
    return { success: false, error: errorData.error || "An unknown error occurred" };
  }
  const data = await response.json();
  return data;
}

// Get all projects
export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);
  return handleResponse<any[]>(response);
}

// Create a new project
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

// Get content items for a project
export async function getContentItems(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/content`);
  return handleResponse<any[]>(response);
}

// Create a new content item
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

// Generate content with AI
export async function generateContent(themes: string[], reference_image: string | null) {
  const response = await fetch(`${API_BASE_URL}/generate/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        themes: themes,
        content_types: ['post', 'video', 'landing_page'],
        platforms: ['instagram', 'facebook', 'twitter', 'youtube', 'linkedin'],
        reference_image: reference_image
      }),
  });
  return handleResponse<any>(response);
}

// Upload an image
export async function uploadImage(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData,
      });
      return handleResponse<any>(response);
}

// Generate post suggestions
export async function generatePostSuggestions(topic: string, style: string, platform: string) {
    const response = await fetch(`${API_BASE_URL}/generate/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          style: style,
          platform: platform,
          count: 10
        }),
      });
      return handleResponse<any[]>(response);
}

// Get the current brand kit
export async function getBrandKit() {
    const response = await fetch(`${API_BASE_URL}/brand-kit`);
    return handleResponse<any>(response);
}

// Save the brand kit
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
