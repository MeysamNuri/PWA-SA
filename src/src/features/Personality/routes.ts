import type { RouteObject } from "react-router";
import { PersonalitySelectionView } from './Views';
import ProtectedLayout from "@/core/layouts/ProtectedLayout";

export const personalityRoutes: RouteObject[] = [
  {
    path: "/personality",
    Component: ProtectedLayout,
    children: [
      {
        path: "",
        Component: PersonalitySelectionView,
      },
    ],
  },
];