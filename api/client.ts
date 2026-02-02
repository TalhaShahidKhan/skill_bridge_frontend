export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data: T | null; error: string | null }> {
  try {
    const baseUrl =
      typeof window !== "undefined"
        ? "/api"
        : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api`;
    const url = `${baseUrl}${endpoint}`;

    // Properly handle Headers - merge incoming headers with defaults
    const incomingHeaders = options.headers;
    const headers = new Headers();

    // Set default Content-Type
    headers.set("Content-Type", "application/json");

    // Merge incoming headers
    if (incomingHeaders) {
      if (incomingHeaders instanceof Headers) {
        incomingHeaders.forEach((value, key) => {
          headers.set(key, value);
        });
      } else if (Array.isArray(incomingHeaders)) {
        incomingHeaders.forEach(([key, value]) => {
          headers.set(key, value);
        });
      } else {
        // Plain object
        Object.entries(incomingHeaders).forEach(([key, value]) => {
          if (value) headers.set(key, value);
        });
      }
    }

    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const contentType = res.headers.get("content-type");
    let result: unknown;

    if (contentType && contentType.includes("application/json")) {
      result = await res.json();
    } else {
      // Handle non-JSON responses (like 500 HTML pages or empty success)
      const text = await res.text();
      if (!res.ok) {
        return {
          data: null,
          error: `Server error: ${res.status} ${res.statusText}`,
        };
      }
      return { data: text as unknown as T, error: null };
    }

    const jsonResult = result as {
      success?: boolean;
      data?: T;
      error?: string | { message?: string };
      message?: string;
    };

    if (!res.ok) {
      // Better error extraction from backend response
      const errorMessage =
        (typeof jsonResult.error === "object"
          ? jsonResult.error?.message
          : jsonResult.error) ||
        jsonResult.message ||
        (typeof result === "string" ? result : "An error occurred");

      return {
        data: null,
        error: errorMessage,
      };
    }

    return { data: (jsonResult.data ?? result) as T, error: null };
  } catch (error: unknown) {
    console.error("Fetch error:", error);
    let message = "An network error occurred. Please check your connection.";

    if (error instanceof Error) {
      if (error.name === "AbortError") message = "Request timeout";
      else message = error.message;
    }

    return { data: null, error: message };
  }
}
