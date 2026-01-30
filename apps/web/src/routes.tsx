import type { RouteObject } from "react-router-dom";
import { AboutPage } from "./routes/about";
import { ClientExamplePage } from "./routes/client-example";
import { DashboardPage } from "./routes/dashboard";
import HomePage, { userLoader } from "./routes/Home";
import { NavigationTestPage } from "./routes/navigation-test";
import RootLayout from "./routes/Root";
import { React19DemoPage } from "./routes/react-19-demo";
import { ServerActionsPage } from "./routes/server-actions";
import { SSRExamplePage, ssrExampleLoader } from "./routes/ssr-example";

/**
 * React Router v6 route configuration (library mode)
 *
 * This is a manual route configuration. We're not using the
 * framework mode plugin, so we define routes explicitly.
 *
 * Later we can create a script to auto-generate this from files.
 */
export const routes: RouteObject[] = [
	{
		path: "/",
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
				loader: userLoader,
			},
			{
				path: "about",
				element: <AboutPage />,
			},
			{
				path: "ssr-example",
				element: <SSRExamplePage />,
				loader: ssrExampleLoader,
			},
			{
				path: "client-example",
				element: <ClientExamplePage />,
			},
			{
				path: "server-actions",
				element: <ServerActionsPage />,
			},
			{
				path: "react-19-demo",
				element: <React19DemoPage />,
			},
			{
				path: "navigation-test",
				element: <NavigationTestPage />,
			},
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
		],
	},
];
