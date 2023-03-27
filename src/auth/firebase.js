// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, logut } from "firebase/auth";
import { addDoc, getDocs, getFirestore, collection, query, where } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD21Qy9ekd7uYdGjpBaALFDyxXIM5KREcQ",
  authDomain: "country-lesson-jd.firebaseapp.com",
  projectId: "country-lesson-jd",
  storageBucket: "country-lesson-jd.appspot.com",
  messagingSenderId: "624100118526",
  appId: "1:624100118526:web:2b52915cbaad32f787baaf",
  measurementId: "G-J6GZX11N2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const loginWithEmail = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.log(error);
        alert(error);
    }
}

const registerWithEmail = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        // const g = query(collection(db, "user"), where("uid", "==", user.id));
        await addDoc(collection(db, "users"), {
            uid: user.id,
            name,
            authProvider: "local",
            email,
        })
    } catch (error) {
        console.log(error);
        alert(error);
    }   
}

const logout = () => {
    logout(auth);
}

export { auth, db, loginWithEmail, registerWithEmail, logout}
