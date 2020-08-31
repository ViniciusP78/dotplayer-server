import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

import { playlistsDir, tracksDir, IPlaylist } from '../server';

class PlaylistsController {
  index( request: Request, response: Response ) {
    let playlistsList = fs.readdirSync(playlistsDir);

    playlistsList.pop(); // Remove o playlists_here

    let playlists: IPlaylist[] = [];

    playlistsList.map((item) => {
      let playlistItem = fs.readFileSync(path.resolve(playlistsDir, item), 'utf-8');
    
      playlists.push(JSON.parse(playlistItem));
    })

    response.json(playlists);
  }

  create( request: Request, response: Response ) {
    let { name, tracks } = request.body;

    if (name == undefined) { // O nome da playlist não pode ser nulo
      return response.sendStatus(400);
    }

    if (tracks == undefined) { // Permite a criação de uma Playlist vazia
      tracks = [];
    }

    let playlist: IPlaylist = {
      id: uniqid(),
      name,
      tracks
    }

    fs.writeFileSync(path.resolve(playlistsDir, `${playlist.id}.json`), JSON.stringify(playlist, null, 2));

    return response.status(201).json(playlist);
  }

  show( request: Request, response: Response ) {
    let { id } = request.params;

    let playlist: IPlaylist;

    try {
      let playlistJson = fs.readFileSync(path.resolve(playlistsDir, `${id}.json`), 'utf-8');
      playlist = JSON.parse(playlistJson);
    } catch (error) {
      return response.sendStatus(404);
    };


    response.json(playlist);
  }

  update( request: Request, response: Response ) {
    let { id } = request.params;

    let { name, tracks } = request.body;

    let playlist: IPlaylist = {
      id,
      name,
      tracks
    }

    let exists = false;

    fs.readdirSync(playlistsDir).map((file) => {
      if (file == `${id}.json`){
        exists = true;
      }
    });
  
    if (exists) {
      fs.writeFileSync(path.resolve(playlistsDir, `${id}.json`), JSON.stringify(playlist, null, 2));
      return response.sendStatus(200);
    }

    return response.sendStatus(404);
  }

  delete( request: Request, response: Response ) {
    let { id } = request.params;

    let exists = false;
  
    fs.readdirSync(playlistsDir).map((file) => {
      if (file == `${id}.json`){
        exists = true;
      }
    });
  
    if (exists) {
      fs.unlinkSync(path.resolve(playlistsDir, `${id}.json`));
      return response.sendStatus(200);
    }
  
    return response.sendStatus(404);
  }
}

export default PlaylistsController