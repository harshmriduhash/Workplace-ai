import React, { useContext } from 'react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { AppContext } from '../App';
import LandingPage from '../pages/LandingPage';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isDemo } = useContext(AppContext);

    // If in demo mode, everything is open for preview
    if (isDemo) {
        return <>{children}</>;
    }

    // Otherwise, strictly enforce Clerk auth
    return (
        <>
            <SignedIn>
                {children}
            </SignedIn>
            <SignedOut>
                <LandingPage forceAuthOverlay={true} />
            </SignedOut>
        </>
    );
};
