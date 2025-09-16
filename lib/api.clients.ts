// Client-side version of the API utility

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface ApiRequestOptions<TBody = unknown> {
    method?: HttpMethod
    body?: TBody
    headers?: Record<string, string>
}

const getBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_BASE_URL || ""
}

const buildUrl = (endpoint: string): string => {
    if (/^https?:\/\//i.test(endpoint)) return endpoint
    const base = getBaseUrl().replace(/\/$/, "")
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    return `${base}${path}`
}

export async function apiFetch<TResponse = unknown, TBody = unknown>(
    endpoint: string,
    options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
    const { method = "GET", body, headers: userHeaders = {} } = options
    const url = buildUrl(endpoint)
    const hasJsonBody = body !== undefined && body !== null && method !== "GET"

    const baseHeaders: Record<string, string> = {
        ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    }

    const response = await fetch(url, {
        method,
        headers: { ...baseHeaders, ...userHeaders },
        // Only stringify if we have a non-GET with a provided body
        ...(hasJsonBody ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
        // Ensure cookies are sent with the request
        credentials: "include",
    })

    // Throw an error for non-2xx responses to make callers handle failures explicitly
    if (!response.ok) {
        const text = await response.text().catch(() => "")
        throw new Error(`API ${method} ${url} failed: ${response.status} ${response.statusText} ${text}`)
    }

    // Attempt JSON by default; fallback to text if not JSON
    const contentType = response.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        return (await response.json()) as TResponse
    }
    return (await response.text()) as unknown as TResponse
}

export const apiGet = async <TResponse = unknown>(endpoint: string, headers?: Record<string, string>) =>
    apiFetch<TResponse>(endpoint, { method: "GET", headers })

export const apiPost = async <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>
) => apiFetch<TResponse, TBody>(endpoint, { method: "POST", body, headers })

export const apiPut = async <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>
) => apiFetch<TResponse, TBody>(endpoint, { method: "PUT", body, headers })

export const apiPatch = async <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>
) => apiFetch<TResponse, TBody>(endpoint, { method: "PATCH", body, headers })

export const apiDelete = async <TResponse = unknown, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    headers?: Record<string, string>
) => apiFetch<TResponse, TBody>(endpoint, { method: "DELETE", body, headers })
