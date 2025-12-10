import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Mark this route as dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, error: "Missing or invalid authorization header" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");

        // Initialize Supabase client with the user's token
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            // eslint-disable-next-line no-console
            console.error("Missing Supabase environment variables");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        // Create client with user's token to verify authentication
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });

        // Verify the user is authenticated
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            // eslint-disable-next-line no-console
            console.error("Authentication error:", authError);
            return NextResponse.json({ success: false, error: "Unauthorized: Invalid or expired token" }, { status: 401 });
        }

        // Now use admin client to delete the user
        const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

        if (!supabaseServiceKey) {
            // eslint-disable-next-line no-console
            console.error("Missing Supabase service role key");
            return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Delete the authenticated user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

        if (deleteError) {
            // eslint-disable-next-line no-console
            console.error("Error deleting user:", deleteError);
            return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
        }

        // eslint-disable-next-line no-console
        console.log(`[delete-user] User deleted successfully: ${user.id}`);

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
            userId: user.id,
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Unexpected error in delete-user:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
