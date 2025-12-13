export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      return text ? JSON.parse(text) : ({} as T);
    }

    return {} as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0,
      error
    );
  }
}

export const api = {
  get: <T>(url: string) => apiRequest<T>(url, { method: 'GET' }),
  
  post: <T>(url: string, data: unknown) =>
    apiRequest<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(url: string, data: unknown) =>
    apiRequest<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(url: string, data: unknown) =>
    apiRequest<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(url: string) =>
    apiRequest<T>(url, { method: 'DELETE' }),
};

