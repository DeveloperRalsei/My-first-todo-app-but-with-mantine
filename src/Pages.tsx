import { Accordion, ActionIcon, Button, Checkbox, Group, Loader, Stack, Table, Textarea, TextInput, useMantineTheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getAll, getOne, RemoveToDo, UpdateToDo } from "./routes";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";

export type ToDo = {
    _id: any,
    title: string,
    description: string;
};

function notifcation(type: "error" | "default", message: string) {
    return showNotification({
        title: type === 'default' ? "Yayy! :3" : "Error!",
        color: type === 'default' ? "green" : "red",
        message: message,
        position: "bottom-center",
        autoClose: 1500
    });
}

export const List = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [todos, setTodos] = useState<ToDo[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadTodos() {
            try {
                const res = await getAll();
                setTodos(res.data);
                notifcation("default", "To-Do's Loaded");
            } catch (error) {
                console.error(error);
                notifcation("error", "Failed to load to-do's");
                setTodos([]);
            }
        }

        loadTodos();
    }, []);

    const filteredTodos = searchValue
        ? todos.filter((t) =>
            [t.title, t.description]
                .filter((x) => x)
                .join(" ")
                .toLowerCase()
                .includes(searchValue.toLowerCase())
        )
        : todos;

    if (!todos) return <Loader type="dots" />;


    return <Stack>
        <Group justify="space-between">
            <TextInput
                value={searchValue}
                placeholder="Search..."
                w={"50vw"}
                onChange={e => setSearchValue(e.currentTarget.value)}
            />
            <Button
                rightSection={<IconPlus />}
                children="New"
            />
        </Group>
        <Table withRowBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th/>
                    <Table.Th>Title</Table.Th>
                    <Table.Th hiddenFrom="xl" w={120}>Edit</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {!todos && <Loader />}
                    {filteredTodos.length !== 0 ? filteredTodos.map((t, i) => (
                    <Table.Tr key={i}>
                        <Table.Td w={0}>{i+1}</Table.Td>
                        <Table.Td>
                            <Accordion variant="filled">
                                <Accordion.Item value={t.title}>
                                    <Accordion.Control>{t.title}</Accordion.Control>
                                    <Accordion.Panel>{t.description}</Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Table.Td>
                        <Table.Td>
                            <Group>
                                <ActionIcon onClick={() => navigate("/todo/" + t._id)}>
                                    <IconPencil />
                                </ActionIcon>
                                <ActionIcon color="red" onClick={async () => {
                                    try {
                                        const response = await RemoveToDo(t._id);
                                        if (response) {notifcation("default", "Deleted!"); console.log(response)}
                                        else notifcation("error", "Nuh uh!");
                                    } catch (error) {
                                        console.error(error);
                                        notifcation("error", "Nuh uh!");
                                    }
                                }}>
                                    <IconTrash />
                                </ActionIcon>
                            </Group>
                        </Table.Td>
                    </Table.Tr>
                    
                )) : <Table.Tr>
                        <Table.Td colSpan={99} ta={"center"}>Couldn't find</Table.Td>
                    </Table.Tr>}
            </Table.Tbody>
        </Table>
    </Stack>;
};

export const Todo = () => {
    const [todo, setTodo] = useState<ToDo>({
        _id: undefined,
        title: "",
        description: "",
    });

    const { id } = useParams();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: todo.title || "",
            description: todo.description || "",
        }
    });
    const navigate = useNavigate();

    useHotkeys([
        ["esc", () => navigate("/")]
    ]);

    useEffect(() => {
        async function loadBlog() {
            try {
                const response = await getOne(id);
                setTodo(response.data);

            } catch (error) {
                console.error(error);
                setTodo(v => ({ ...v }));
            }
        }

        form.setValues(todo);

        loadBlog();
    }, []);

    useEffect(() => {
        if (todo._id) {
            form.setValues(todo);
        }
    }, [todo]);

    return <Stack>
        <form onSubmit={form.onSubmit(async v => {
            try {
                const values = form.getValues();
                const response = await UpdateToDo({ _id: id, ...values });
                if (response) { notifcation("default", "Updated! Yippi!"); navigate("/"); }
                else {
                    notifcation("error", "Couldn't update 3:");
                }
            } catch (error) {

            }
        })}>
            <TextInput
                label="Title"
                {...form.getInputProps("title")}
            />
            <Textarea
                label="Description"
                {...form.getInputProps("description")}
            />
            <Button type="submit" mt={20}>Save</Button>
        </form>
    </Stack>;
};