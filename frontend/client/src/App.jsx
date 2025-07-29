import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import HomeIndex from "./pages/Home/HomeIndex";
import Hero from "./pages/Home/Hero";

//Authentication Section

import NewUser from "./pages/Auth/Join/NewUser";
import Login from "./pages/Auth/logins/Login";
import ForgotPass from "./pages/Auth/logins/ForgotPass";
import VerifyAcct from "./pages/Auth/logins/VerifyAcct";

// Dashboard
import Dashboard from "./pages/dashboards/Dashboard";
import VideoStream from "./components/VideoStream";
import { StreamProvider } from "./components/StreamContext";

const StreamLayout = () => (
  <StreamProvider>
    <Outlet />
  </StreamProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeIndex />,
    children: [{ index: true, element: <Hero /> }],
  },

  { path: "signup", element: <NewUser /> },
  { path: "login", element: <Login /> },
  { path: "forgotPass", element: <ForgotPass /> },
  { path: "verifyAcct", element: <VerifyAcct /> },

  {
    element: <StreamLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "videoCall", element: <VideoStream /> },
    ],
  },
]);

function App() {
  return (
    <div className=" w-full min-w-[100vw] min-h-[100vh]">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;