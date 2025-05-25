import { createContext, useContext, useEffect, useState } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { app } from '../firebase/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);
    const [loading, setLoading] = useState(true); // для корректной загрузки

    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsGoogleAuth(
                currentUser?.providerData?.some((p) => p.providerId === 'google.com') || false
            );
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsGoogleAuth(false);
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Ошибка входа через Google:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                logout,
                loginWithGoogle,
                isGoogleAuth,
                loading // на случай, если ты хочешь показать спиннер
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
