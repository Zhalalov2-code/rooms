import { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsGoogleAuth(false);
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
