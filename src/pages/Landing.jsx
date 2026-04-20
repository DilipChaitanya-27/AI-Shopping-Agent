import { login } from "../lib/auth";

export default function Landing() {
  return (
    <div style={{ padding: 40 }}>
      <h1>AI Shopping Agent</h1>

      <button onClick={login}>Login with Google</button>

      <br /><br />

      <button onClick={() => window.location.href = "/chat"}>
        Continue as Guest →
      </button>
    </div>
  );
}