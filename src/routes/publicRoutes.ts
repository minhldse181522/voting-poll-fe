import { lazy } from "react";

// Sử dụng lazy loading để tối ưu performance
const HomePage = lazy(() => import("../pages/HomePage.tsx"));
const ConfigPage = lazy(() => import("../pages/ConfigPage.tsx"));
const VotePage = lazy(() => import("../pages/VotePage.tsx"));

const publicRoutes = [
  { path: "/", component: HomePage, private: false },
  { path: "/config", component: ConfigPage, private: true },
  { path: "/vote", component: VotePage, private: true },
];

export default publicRoutes;
