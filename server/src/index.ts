import mongoose from 'mongoose';
import server from './app';
import { config } from 'dotenv'; config();

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server running | http://localhost:" + port);
});

mongoose.connect(process.env.MONG_CONNECTION as string)
    .then(() => console.log("MongoDb Connected"))
    .catch(err => console.error(err))