import { type FormEvent, useEffect, useState } from "react";
import { api } from "../lib/api";

export function Login() {
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    try {
      await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    }
  };

  return (
    <div className="studio-login">
      <form onSubmit={onSubmit}>
        <p className="studio-kicker">Salamnca Graphx</p>
        <h1>Night desk</h1>
        <p className="muted">
          Pipeline, customers, published work, and campaign drops.
        </p>
        <label>
          Password
          <input name="password" type="password" autoFocus required />
        </label>
        {error ? <p className="err">{error}</p> : null}
        <button className="btn btn--hot" type="submit">
          Enter
        </button>
      </form>
    </div>
  );
}

export function useSession() {
  const [state, setState] = useState<"loading" | "in" | "out">("loading");
  useEffect(() => {
    api<{ ok: boolean }>("/api/admin/session")
      .then((d) => setState(d.ok ? "in" : "out"))
      .catch(() => setState("out"));
  }, []);
  return state;
}
