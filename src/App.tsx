import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminApp } from "./admin/AdminApp";
import { Customers } from "./admin/Customers";
import { Funnel } from "./admin/Funnel";
import { Marketing } from "./admin/Marketing";
import { Overview } from "./admin/Overview";
import { WorkManager } from "./admin/WorkManager";
import { PublicSite } from "./PublicSite";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminApp />}>
          <Route index element={<Overview />} />
          <Route path="funnel" element={<Funnel />} />
          <Route path="customers" element={<Customers />} />
          <Route path="work" element={<WorkManager />} />
          <Route path="marketing" element={<Marketing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
