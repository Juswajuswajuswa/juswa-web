import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RequiredAuth, RooutLayout } from "./layout/RooutLayout.jsx";
import HomePage from "./components/HomePage.jsx";
import SignIn from "./routes/SignIn.jsx";
import SignUp from "./routes/SignUp.jsx";
import { store, persistor } from "../redux/store.js";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Profile from "./routes/Profile.jsx";
import AddPost from "./routes/AddPost.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import MyListPost from "./routes/MyListPost.jsx";
import SinglePage from "./routes/SinglePage.jsx";
import EditPost from "./routes/EditPost.jsx";
import ValidationModal from "./components/ValidationModal.jsx";

const router = createBrowserRouter([
  {
    element: <RooutLayout />,
    children: [
      {
        path: `/sign-in`,
        element: <PublicRoute element={<SignIn />} />,
         // made a PublicRoute component where if user has already logged in then 
        // tried to access /sign-in || /sign-out they will be redirected to home
      },
      {
        path: `/sign-up`,
        element: <PublicRoute element={<SignUp />} />, 
        // made a PublicRoute component where if user has already logged in then 
        // tried to access /sign-in || /sign-out they will be redirected to home
      },
    ],
  },
  {
    path: `/`,
    element: <RequiredAuth />,
    children: [
      {
        path: `/`,
        element: <HomePage />,
      },
      {
        path: `/`,
        element: <HomePage />,
      },
      {
        path: `/profile`,
        element: <Profile />,
      },
      {
        path: `/add-post`,
        element: <AddPost />,
      },
      {
        path: `/my-list`,
        element: <MyListPost/>
      },
      {
        path: `/:postListingId`,
        element: <SinglePage/>
      },
      {
        path: `/edit/:editPostId`,
        element: <EditPost/>
      },
      {
        path: `/validation`,
        element: <ValidationModal/>
      },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
