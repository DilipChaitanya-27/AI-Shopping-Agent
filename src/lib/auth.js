import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export async function login() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Logged in:", result.user);
  } catch (err) {
    console.error("Login error:", err);
    alert(err.message);
  }
}

export { auth, provider };

