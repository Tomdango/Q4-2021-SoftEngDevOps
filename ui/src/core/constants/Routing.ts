import { createElement } from "react";
import { RouteObject } from "react-router-dom";
import AdminView from "../../presentation/views/AdminView";
import HomeView from "../../presentation/views/HomeView";
import LoginView from "../../presentation/views/LoginView";
import RoomsView from "../../presentation/views/RoomsView";
import SingleRoomView from "../../presentation/views/SingleRoomView";

export const AppRoutes = {
  LOGIN: "/",
  HOME: "/app/",
  ADMIN: "/app/admin",
  ROOMS: "/app/rooms",
  SINGLE_ROOM: "/app/rooms/:roomID",
} as const;

export const AppViews: RouteObject[] = [
  { path: AppRoutes.HOME, element: createElement(HomeView) },
  { path: AppRoutes.LOGIN, element: createElement(LoginView) },
  { path: AppRoutes.ADMIN, element: createElement(AdminView) },
  { path: AppRoutes.SINGLE_ROOM, element: createElement(SingleRoomView) },
  { path: AppRoutes.ROOMS, element: createElement(RoomsView) },
];
