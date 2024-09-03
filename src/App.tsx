import { ActionIcon, Anchor, AppShell, Container, Group, Space, Text, Title, Tooltip } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { author } from '../package.json';

export type Page = "list" | "todo";

export const App = () => {
    const location = useLocation();

    return <AppShell
        header={{
            height: 60
        }}
        footer={{
            height: 20
        }}

    >
        <AppShell.Header withBorder={false}>

            <Group h={"100%"} w={"100%"} align="center" justify="center">

                <Title order={2}>To-Do</Title>
            </Group>
        </AppShell.Header>

        <AppShell.Main>
            <Container size={"md"}>
                {location.pathname !== '/' && <ActionIcon
                    component={Link}
                    to={"/"}
                >
                    <IconChevronLeft />
                </ActionIcon>}
                <Space h={30} />
                <Outlet />
            </Container>
        </AppShell.Main>
    </AppShell>;
};