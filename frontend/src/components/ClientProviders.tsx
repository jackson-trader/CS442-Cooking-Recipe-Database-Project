"use client";

import React from "react";
import { SessionProvider } from "@/src/context/CsrfContext";


export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
