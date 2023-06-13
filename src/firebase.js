import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    where,
    addDoc,
    collection,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBrq5L_4p38l1gQxaDR-sE8syViXJV4fcM",
    authDomain: "fir-auth-project-ace60.firebaseapp.com",
    projectId: "fir-auth-project-ace60",
    storageBucket: "fir-auth-project-ace60.appspot.com",
    messagingSenderId: "953724967983",
    appId: "1:953724967983:web:c7855e68173a0f13bcfada",
    measurementId: "G-GPJM55TP0D",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "user"), where("uid", "==", user.id));
        const docs = await getDocs(q);

        if (docs.docs.length === 0) {
            await addDoc(collection(db, "user"), {
                uid: user.id,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const registerWithEmailAndPassWord = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(
            collection(db, "users", {
                uid: user.uid,
                name,
                authProvider: "local",
                email,
            })
        );
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
        await sendPasswordReset(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassWord,
    sendPasswordReset,
    logout,
};
