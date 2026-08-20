import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Login, useSession } from "./Login";
import "./admin.css";

const links = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/funnel", label: "Funnel" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/work", label: "Work" },
  { to: "/admin/marketing", label: "Marketing" },
];

export function AdminApp() {
  const session = useSession();
  const navigate = useNavigate();

  if (session === "loading") {
    return <div className="studio-login">Opening studio…</div>;
  }
  if (session === "out") return <Login />;

  return (
    <div className="studio">
      <div className="studio-shell">
        <aside className="studio-side">
          <strong>Jacob Salamanca</strong>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "is-on" : "")}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="spacer" />
          <a href="/">View site</a>
          <button
            type="button"
            onClick={async () => {
              await api("/api/admin/logout", { method: "POST" });
              navigate("/admin");
              window.location.reload();
            }}
          >
            Log out
          </button>
        </aside>
        <div className="studio-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
