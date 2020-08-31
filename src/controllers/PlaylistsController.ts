import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

import { playlistsDir, tracksDir, IPlaylist } from '../server';

class PlaylistsController {
  index( request: Request, response: Response ) {
    fs.readdir(playlistsDir, function (err, data) {
      if (err) {
        console.log(err);
        return response.sendStatus(500);
      }
  
      let playlists: IPlaylist[] = [];
  
      data.map((value) => {
        let tracks;
  
        try {
          tracks = fs.readFileSync(path.resolve(playlistsDir, value), 'utf-8');
        } catch (error) {
          return response.sendStatus(500);
        }
        
        if(tracks == "") { // Caso não haja playlists criadas
          return;
        }
  
        tracks = JSON.parse(tracks);
  
        playlists.push({
          name: value.substring(0, value.length - 5), // remove o .json
          tracks // Não tirei o .mp3 por motivos estéticos
        });
  
      });
  
      return response.send(playlists);
    });
  }

  create( request: Request, response: Response ) {
    let data = request.body;

    if (data.name == undefined) { // O nome da playlist não pode ser nulo
      return response.sendStatus(400);
    }

    if (data.tracks == undefined) { // Permite a criação de uma Playlist vazia
      data.tracks = [];
    }

    let playlist = {
      name: data.name,
      tracks: data.tracks
    }

    fs.writeFileSync(path.resolve(playlistsDir, `${playlist.name}.json`), JSON.stringify(playlist.tracks, null, 2));

    return response.json(playlist);
  }

  show( request: Request, response: Response ) {
    let { name } = request.params;

    let tracks: string;

    try {
      tracks = fs.readFileSync(path.resolve(playlistsDir, `${name}.json`), 'utf-8');
    } catch (error) {
      console.log(error);
      return response.sendStatus(404);
    };

    let playlist: IPlaylist = {
      name,
      tracks: JSON.parse(tracks)
    };

    response.json(playlist);
  }

  update( request: Request, response: Response ) {
    
  }

  delete( request: Request, response: Response ) {
    let { name } = request.params;

    let exists = false;
  
    fs.readdirSync(playlistsDir).map((file) => {
      if (file == `${name}.json`){
        exists = true;
      }
    });
  
    if (exists) {
      fs.unlinkSync(path.resolve(playlistsDir, `${name}.json`));
      return response.sendStatus(200);
    }
  
    return response.sendStatus(404);
  }
}

export default PlaylistsController