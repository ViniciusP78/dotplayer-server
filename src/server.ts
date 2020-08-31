import express, { response } from 'express';
import cors from 'cors';
import path from 'path';

import routes from './routes';

const app = express();

app.use(express.json()); // Use é utilizado para colocar um plugin no express // Express não entende o formato json por padrão

export const tracksDir = path.resolve(__dirname, '..', 'tracks');
export const playlistsDir = path.resolve(__dirname, '..', 'playlists');

export interface IPlaylist {
  name: string,
  tracks: string[]
};

app.use(cors()); // Importante

app.use(routes);


app.listen(3333);