import 'dotenv/config';

import { createServer } from 'http';
import app from './app.js';
import { SERVER_PORT } from './constants/env.js';

const server = createServer(app);

const port = SERVER_PORT || 5000;
server.listen(port);
console.log(`Server started at port: ${port}`);
