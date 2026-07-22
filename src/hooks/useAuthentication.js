import{getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    signOut} from 'firebase/auth';


import { useState, useEffect } from 'react';

//hook de autenticação
export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // cleanup
    // deal with memory leak
    const [cancelled, setCancelled] = useState(false);

    const auth = getAuth();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }    
    }
    // register
    const createUser = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(null);

        try {
            const {user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            await updateProfile(user, {
                displayName: data.displayName
            });
            setLoading(false);

            return user;

        }catch (error) {
            setError(error.message);
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage;

            if (error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter no mínimo 6 caracteres.";
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente novamente mais tarde.";
            }
           
            setError(systemErrorMessage);
            setLoading(false);

        }
    };
    // sign out - logout
    const logout = () => {
        checkIfIsCancelled();
        signOut(auth);
    };

    // login - sign in
    const login = async(data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(false);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            setLoading(false);
        } catch (error) {
            let systemErrorMessage;
            if (error.code === "auth/invalid-credential") {
                systemErrorMessage = "E-mail ou senha inválidos.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente novamente mais tarde.";
            }
            setError(systemErrorMessage);
            setLoading(false);
        }
    }


    useEffect(() => {
        return () => setCancelled(true);
    }, []);
    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login
    };

};