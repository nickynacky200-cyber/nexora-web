import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Welcome from "./pages/Welcome";
import BottomNav from "./components/BottomNav";

// Everything except Welcome is lazy-loaded: the first screen a visitor
// sees shouldn't have to wait for every other page's JS to download first.
const Login = lazy(() => import("./pages/Login"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Home = lazy(() => import("./pages/Home"));
const Learn = lazy(() => import("./pages/Learn"));
const LearnCategory = lazy(() => import("./pages/LearnCategory"));
const Test = lazy(() => import("./pages/Test"));
const Ideas = lazy(() => import("./pages/Ideas"));
const Connect = lazy(() => import("./pages/Connect"));
const Profile = lazy(() => import("./pages/Profile"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Simulation = lazy(() => import("./pages/Simulation"));
const SimulationLevel2 = lazy(() => import("./pages/SimulationLevel2"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Certificates = lazy(() => import("./pages/Certificates"));
const CertificateView = lazy(() => import("./pages/CertificateView"));
const AdminBookUpload = lazy(() => import("./pages/AdminBookUpload"));
const BookView = lazy(() => import("./pages/BookView"));
const AdminConnectAdd = lazy(() => import("./pages/AdminConnectAdd"));
const AdminPostAnnouncement = lazy(() => import("./pages/AdminPostAnnouncement"));
const IdeaForm = lazy(() => import("./pages/IdeaForm"));
const IdeaView = lazy(() => import("./pages/IdeaView"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyView = lazy(() => import("./pages/CaseStudyView"));
const Challenges = lazy(() => import("./pages/Challenges"));
const Calculators = lazy(() => import("./pages/Calculators"));
const AIMentor = lazy(() => import("./pages/AIMentor"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const AccountSettings = lazy(() => import("./pages/AccountSettings"));

const TAB_PATHS = ["/home", "/learn", "/test", "/ideas", "/connect", "/profile"];

function RouteLoading() {
  return (
    <div className="screen">
      <p style={{ color: "var(--text-secondary)", marginTop: 40 }}>Loading…</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const showNav = TAB_PATHS.includes(location.pathname);

  return (
    <div className="app-shell">
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:categoryId" element={<LearnCategory />} />
          <Route path="/test" element={<Test />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/test/quiz/:id" element={<Quiz />} />
          <Route path="/test/simulation" element={<Simulation />} />
          <Route path="/test/simulation-2" element={<SimulationLevel2 />} />
          <Route path="/profile/achievements" element={<Achievements />} />
          <Route path="/profile/certificates" element={<Certificates />} />
          <Route path="/profile/certificates/:key" element={<CertificateView />} />
          <Route path="/admin/books/upload" element={<AdminBookUpload />} />
          <Route path="/learn/books/:id" element={<BookView />} />
          <Route path="/admin/connect/add" element={<AdminConnectAdd />} />
          <Route path="/admin/announcements" element={<AdminPostAnnouncement />} />
          <Route path="/ideas/new" element={<IdeaForm />} />
          <Route path="/ideas/:id" element={<IdeaView />} />
          <Route path="/ideas/:id/edit" element={<IdeaForm />} />
          <Route path="/test/case-studies" element={<CaseStudies />} />
          <Route path="/test/case-studies/:id" element={<CaseStudyView />} />
          <Route path="/test/challenges" element={<Challenges />} />
          <Route path="/test/calculators" element={<Calculators />} />
          <Route path="/ai-mentor" element={<AIMentor />} />
          <Route path="/profile/portfolio" element={<PortfolioPage />} />
          <Route path="/profile/settings" element={<AccountSettings />} />
        </Routes>
      </Suspense>
      {showNav && <BottomNav />}
    </div>
  );
}
