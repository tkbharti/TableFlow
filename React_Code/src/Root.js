import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter(
  [
    { path: "/", element: <App /> },
  ],
  {
    future: {
      v7_startTransition: true, // ✅ This enables the flag and hides the warning
    },
  }
);

function Root() {
  return <RouterProvider router={router} />;
}

export default Root;
