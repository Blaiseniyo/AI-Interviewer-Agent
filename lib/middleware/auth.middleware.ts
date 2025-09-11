import { verificationUserSession } from "@/lib/actions/auth.action";
// import { User } from "@/public/types";
import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to verify user authentication
 * @param request The incoming request
 * @returns User object if authenticated or throws a response error
 */
export async function withAuth(request: Request | NextRequest) {
    // Try to get bearer token from Authorization header
    const authHeader = request.headers.get("Authorization");
    let token = authHeader?.split(" ")[1];

    console.log("Auth Header token:", token);
    const cookieHeader = request.headers.get('Cookie');

    const cookieToken = cookieHeader?.split('; ').find(row => row.startsWith('session='));

    if (cookieToken && !token) {
        token = cookieToken.split('=')[1];
        console.log("Cookie token:", token);
    }

    // If still no token, return unauthorized
    if (!token) {
        return NextResponse.json({
            success: false,
            error: "Unauthorized. Please sign in first."
        }, { status: 401 });
    }

    const user = await verificationUserSession(token);

    if (!user) {
        return NextResponse.json({
            success: false,
            error: "Unauthorized. Please sign in first."
        }, { status: 401 });
    }

    return user;
}

/**
 * Middleware to verify admin role
 * @param request The incoming request
 * @returns User object if authenticated as admin or throws a response error
 */
export async function withAdminAuth(request: Request | NextRequest) {
    const user = await withAuth(request);

    // If withAuth returned a Response (error), return it
    if (user instanceof Response) {
        return user;
    }

    if (user.role !== "admin") {
        return NextResponse.json({
            success: false,
            error: "Unauthorized. Admin access required."
        }, { status: 403 });
    }

    return user;
}

/**
 * Helper function to wrap a handler with authentication middleware
 * @param handler The API route handler function
 * @returns A wrapped handler function with auth checks
 */
export function withAuthHandler(handler: (request: Request, user: User) => Promise<Response>) {
    return async (request: Request) => {
        const user = await withAuth(request);

        if (user instanceof Response) {
            return user;
        }

        return handler(request, user);
    };
}

/**
 * Helper function to wrap a handler with admin authentication middleware
 * @param handler The API route handler function
 * @returns A wrapped handler function with admin auth checks
 */
export function withAdminAuthHandler(handler: (request: Request, user: User) => Promise<Response>) {
    return async (request: Request) => {
        const user = await withAdminAuth(request);

        if (user instanceof Response) {
            return user;
        }

        return handler(request, user);
    };
}
