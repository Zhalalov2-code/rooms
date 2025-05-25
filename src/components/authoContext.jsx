import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsGoogleAuth(currentUser?.providerData?.some(p => p.providerId === 'google.com') || false);
            if (currentUser) {
                localStorage.setItem('user', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('user');
            }
        });

        return () => unsubscribe();
    }, [auth]);
    
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsGoogleAuth(false);
            localStorage.removeItem('user');
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            setIsGoogleAuth(true);
            localStorage.setItem('user', JSON.stringify(result.user));
        } catch (error) {
            console.error("Ошибка входа через Google:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loginWithGoogle, isGoogleAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
