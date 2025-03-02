import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCF8oEYup-Z0i_qkHt17Rk6mGfrrMZ0nY",
  authDomain: "vclass-e0dae.firebaseapp.com",
  projectId: "vclass-e0dae",
  storageBucket: "vclass-e0dae.firebasestorage.app",
  messagingSenderId: "20330763439",
  appId: "1:20330763439:web:29ef83eded9f8a3c95f05a",
  measurementId: "G-MGKH7WGW3V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result.user)
      return result.user; // Return user data
    })
    .catch((error) => {
      throw error; // Propagate error
    });
};
export { auth, signInWithGoogle };

