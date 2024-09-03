import express, { Request, Response } from 'express';
import cors from 'cors';
import todoModel from './todoModel';
import { readFile } from 'fs/promises';
import path from 'path';
import { ObjectId } from 'mongoose';

type ToDo = {
    id: ObjectId | string;
    title: string;
    description: string;
    isComplated: boolean;
};

const app = express();

const clientDir = path.join(__dirname, "../../dist");

app.use(express.static(path.join(clientDir)));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.ip, req.path, req.method);
    next();
});

app.get("/api/todos/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await todoModel.findById(id);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get("/api/todos", async (req: Request, res: Response) => {

    try {
        const result = await todoModel.find();
        res.send(result);
        return;
    } catch (error) {
        console.error(error);
        return;
    }


});

app.post("/api/todos", async (req: Request, res: Response) => {
    const { title, description, isComplated }: Partial<ToDo> = req.body;

    if (!title && !description) {
        res.send("title and description required: " + JSON.stringify(req.body));
        return;
    }

    try {
        const result = await todoModel.create({ title, description, isComplated });
        res.send(true);
    } catch (error) {
        console.error(error);
    }
});

app.delete("/api/todos/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await todoModel.findByIdAndDelete(id);
        result ? res.send(true) : res.sendStatus(404);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete("/api/todos", async (req: Request, res: Response) => {
    try {
        await todoModel.deleteMany({});
        res.send(true);
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
});

app.patch("/api/todos/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await todoModel.findByIdAndUpdate(id, { ...req.body });
        result ? res.send(true) : res.sendStatus(404);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get("/", async (req: Request, res: Response) => {


    try {
        const file = await readFile(path.join(clientDir, "index.html"), "utf-8");

        res.send(file);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});

export default app;