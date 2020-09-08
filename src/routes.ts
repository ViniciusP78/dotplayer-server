import express, { response } from 'express';

import { tracksDir } from './server';

import PlaylistsController from './controllers/PlaylistsController';
import TracksController from './controllers/TracksController';
import UserController from './controllers/UserController';

const routes = express.Router(); // desacopla as rotas do arquivo principal para um outro arquivo
const playlistsController = new PlaylistsController();
const tracksController = new TracksController();
const userController = new UserController();

routes.get('/', ( request, response ) => {
  response.send('Hello Dotplayer');
});

routes.get('/playlists', playlistsController.index);
routes.post('/playlists', playlistsController.create);
routes.get('/playlists/:id', playlistsController.show);
routes.put('/playlists/:id', playlistsController.update);
routes.delete('/playlists/:id', playlistsController.delete);

routes.get('/tracks', tracksController.index);
routes.use('/tracks', express.static('tracks')); // Por algum motivo no routes ele quer o caminho a partir da root, o que invalida a var tracksDir 

routes.post('/user', userController.create);

// index, show, create, update, delete

export default routes;