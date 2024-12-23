import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";
import Secret from "../pages/Shared/Secret/Secret";
import Dashboard from "../Layout/Dashboard";
import AllUsers from "../pages/Dashboard/AllUsers/AllUsers";
import AdminRoute from "./AdminRoute";
import CreateSurvey from "../pages/task/CreateTask";
import SurveyDetails from "../pages/task/TaskDetails";
import ManageSurveys from "../pages/Dashboard/ManageTask/ManageTasks";
import DashBoardHome from "../pages/Dashboard/DashBoardHome/DashBoardHome";
import MySurveyList from "../pages/Dashboard/MySurveyList/MyTaskList";
import SurveyResponse from "../pages/Dashboard/MySurveyList/TaskActivity";
import ReportedSurvey from "../pages/Dashboard/UserDashboard/UserTask";
import EditSurvey from "../pages/task/EditTask";

import AllSurveyResponses from "../pages/Dashboard/AllSurveyResponses";
import ErrorPage from "../ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "signup",
        element: <SignUp></SignUp>,
      },
      {
        path: "secret",
        element: (
          <PrivateRoute>
            <Secret></Secret>
          </PrivateRoute>
        ),
      },
      
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        path: "home",
        element: <PrivateRoute><DashBoardHome></DashBoardHome></PrivateRoute>,
      },

      {
        path: "manageSurveys",
        element: (
          <AdminRoute>
            <ManageSurveys></ManageSurveys>
          </AdminRoute>
        ),
      },
    
     
      {
        path: "users",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "createSurvey",
        element:<AdminRoute><CreateSurvey></CreateSurvey></AdminRoute> ,
      },
      {
        path: "surveys/:surveyId",
        element: <AdminRoute><SurveyDetails></SurveyDetails></AdminRoute>,
      },
      {
        path: "mySurveyList",
        element: <AdminRoute><MySurveyList></MySurveyList></AdminRoute>,
      },
      {
        path: "tasks/:id",
        element: <SurveyDetails></SurveyDetails>,
      },
    
      ,
      {
        path: "user/createtask",
        element: <PrivateRoute><CreateSurvey></CreateSurvey></PrivateRoute>,
      },
      ,
      {
        path: "user/my-reports",
        element: <PrivateRoute><ReportedSurvey></ReportedSurvey></PrivateRoute>,
      },
      {
        path: "editTask/:taskId",
        element: <PrivateRoute><EditSurvey></EditSurvey></PrivateRoute>,
      },
      ,
      {
        path: "tasks/Activities/:id",
        element: <PrivateRoute><SurveyResponse></SurveyResponse></PrivateRoute>,
      },
    ],
  },
]);
