"use client";

import LoginForm from "@/components/auth/login-form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const { auth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (auth.user) {
            router.push("/dashboard");
        }
    }, [auth.user, router]);

    if (auth.user) {
        return <div>Redirecting...</div>;
    }

    return <LoginForm />;
}
