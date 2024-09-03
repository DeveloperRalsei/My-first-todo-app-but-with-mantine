import React from "react";
import { createRoot } from "react-dom/client";
import { createTheme, MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import { App } from './App';
import { List, Todo } from './Pages';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { NavigationProgress } from "@mantine/nprogress";

const root = document.getElementById("root")!;

const theme = createTheme({
    primaryColor: "green",
    colors: {
        dark: [
            '#C1C2C5',
            '#A6A7AB',
            '#909296',
            '#5c5f66',
            '#373A40',
            '#2C2E33',
            '#25262b',
            '#1A1B1E',
            '#141517',
            '#101113',
        ]
    },
    components: {
        Button: {
            defaultProps: {
                variant: "light"
            }
        },
        ActionIcon: {
            defaultProps: {
                variant: "light",
                size: "lg"
            }
        },
    }
});

const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "todo/:id",
                element: <Todo />
            },
            {
                path: "",
                element: <List />
            },
            {
                path: "*",
                element: "No Page"
            }
        ]
    }
]);

createRoot(root).render(
    <MantineProvider defaultColorScheme="dark" theme={theme}>
        <ModalsProvider>
            <NavigationProgress />
            <Notifications />
            <RouterProvider router={router} />
        </ModalsProvider>
    </MantineProvider>
);