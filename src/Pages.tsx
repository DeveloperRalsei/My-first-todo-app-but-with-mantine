import { Accordion, ActionIcon, Button, ButtonGroup, DefaultMantineColor, Group, Loader, LoadingOverlay, Stack, Table, Textarea, TextInput } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { createRef, useEffect, useState } from "react";
import { AddToDo, getAll, getOne, RemoveAllToDo, RemoveToDo, UpdateToDo } from "./routes";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "@mantine/form";
import { closeAllModals, modals, openConfirmModal } from "@mantine/modals";
import { nprogress } from "@mantine/nprogress";

export type ToDo = {
    _id?: any,
    title: string,
    description: string;
};

function notifcation(type: "error" | "default", message: string, color?: DefaultMantineColor) {
    return showNotification({
        title: type === 'default' ? "Yayy! :3" : "Error!",
        color: color || type === 'default' ? "green" : "red",
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
        loadTodos();
    }, []);

    async function loadTodos() {
        nprogress.start()
        try {
            const res = await getAll();
            if(!res){
                setTodos([])
                notifcation("error", "Server side error")
                nprogress.complete()
                setTimeout(() => {
                   loadTodos() 
                }, 4000);
                return
            }

            if(!res.data.length) {
                notifcation("error", "No ToDo found! Retrying")
                nprogress.complete()
                setTimeout(() => {
                    loadTodos()
                }, 4000);
                setTodos([])
                return
            }
            setTodos(res.data);
            notifcation("default", "To-Do's Loaded");
            nprogress.complete()
        } catch (error) {
            console.error(error);
            notifcation("error", "Failed to load to-do's! Retrying! Please check your internet connection");
            setTimeout(() => {
                loadTodos()
            }, 4000);
            setTodos([]);
            nprogress.complete()
        }
    }

    const filteredTodos = searchValue
        ? todos.filter((t) =>
            [t.title, t.description]
                .filter((x) => x)
                .join(" ")
                .toLowerCase()
                .includes(searchValue.toLowerCase())
        )
        : todos;

    return <Stack>
        <TextInput
            value={searchValue}
            placeholder="Search..."
            onChange={e => setSearchValue(e.currentTarget.value)}
        />

        <ButtonGroup display={"flex"}>
            <Button
                rightSection={<IconTrash />}
                children="Delete All"
                color="red"
                onClick={() => openConfirmModal({
                    title: "Are you sure you want to delete them all?",
                    labels: { confirm: "Yes", cancel: "Nuh uh!" },
                    confirmProps: { color: "red" },
                    onConfirm: async () => {
                        try {
                            const response = await RemoveAllToDo()
                            if(!response.data) {
                                notifcation("error", "Operation Failed!")
                                loadTodos()
                                return
                            }

                            notifcation("default" ,"Deleted All", "red")
                            loadTodos()
                        } catch (error) {
                            console.error(error)
                            notifcation("error", "Operation failed! Check your internet connection!")
                        }
                    }
                })}

            />
            <Button
                rightSection={<IconPlus />}
                children="New"
                onClick={() => {
                    const formRef = createRef<HTMLFormElement>();

                    modals.open({
                        title: "New Todo",
                        children: (
                            <form
                                ref={formRef}
                                onSubmit={e => {
                                    e.preventDefault();
                                    const formData = new FormData(formRef.current!);
                                    const title = formData.get("title");
                                    const description = formData.get("description");

                                    if (!title || !description) return notifcation("error", "All fields are required!");

                                    if (typeof title === 'string' && typeof description === 'string') {
                                        const newTodo: ToDo = { title, description };
                                        AddToDo(newTodo).then(res => {
                                            if(!res.data){
                                                notifcation("error", "Something went wrong! Check your internet connection!")
                                                return
                                            }

                                            notifcation("default" ,"Added new ToDo!")
                                            loadTodos()
                                            closeAllModals();
                                        }).catch(error => {
                                            console.error(error)
                                            notifcation("error", "Something went wrong! Check your internet connection!")
                                        });
                                    } else {
                                        return notifcation("error", "Something went wrong! Check your internet connection!");
                                    }
                                }}>
                                <Stack>
                                    <TextInput name="title" label="Todo Title:" withAsterisk />
                                    <Textarea name="description" label="Todo Description:" withAsterisk />
                                    <Button type="submit" fullWidth children="Add" />
                                </Stack>
                            </form>
                        )
                    });
                }}
            />

        </ButtonGroup>

        <Table withRowBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th />
                    <Table.Th>Title</Table.Th>
                    <Table.Th hiddenFrom="xl" w={120}>Edit</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {!todos && <Table.Tr>
                    <Table.Td rowSpan={999} colSpan={999} ta={"center"}>
                        <Loader />
                    </Table.Td>
                </Table.Tr>}
                {filteredTodos.length !== 0 ? filteredTodos.map((t, i) => (
                    <Table.Tr key={i}>
                        <Table.Td w={0}>{i + 1}</Table.Td>
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
                                        const response: any = await RemoveToDo(t._id);
                                        response.data ? notifcation("default", "Deleted!") : notifcation("error", "Not Found!");
                                        loadTodos();
                                    } catch (error) {
                                        console.error(error);
                                        notifcation("error", "Server side error!");
                                    }
                                }}>
                                    <IconTrash />
                                </ActionIcon>
                            </Group>
                        </Table.Td>
                    </Table.Tr>

                )) : <Table.Tr>
                    <Table.Td colSpan={99} ta={"center"}>There's no ToDo's. Let's add one</Table.Td>
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
    const [visible, setVisible] = useState<boolean>(true)

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
                setVisible(false)
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

        <LoadingOverlay 
            visible={visible}
            zIndex={1000}
        />

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