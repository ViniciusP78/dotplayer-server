import express, { response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(express.json()); // Use é utilizado para colocar um plugin no express // Express não entende o formato json por padrão

interface IPlaylist {
  name: string,
  tracks: string[]
};

app.get('/', ( request, response ) => {
  response.send('Hello Dotplayer');
});

app.get('/musics', ( request, response ) => { // Lista todas as músicas
  fs.readdir(path.resolve(__dirname, '..', 'music'), function (err, data) { // usando path.resolve para suportar diferentes plataformas
    if (err) {
      console.log(err);
      return response.sendStatus(500);
    };
    return response.send(data);
  })
});

app.use('/music', express.static(path.resolve(__dirname, '..', 'music'))); // permite o acesso a arquivos estáticos do server, ou seja, todas as músicas individuais

app.get('/playlists', ( request, response ) => { // Lista todas as playlists e seu conteúdo
  fs.readdir(path.resolve(__dirname, '..', 'playlists'), function (err, data) {
    if (err) {
      console.log(err);
      return response.sendStatus(500);
    }

    let playlists: IPlaylist[] = [];


    data.map((value) => {

      let tracks;

      try {
        tracks = fs.readFileSync(path.resolve(__dirname, '..', 'playlists', value), 'utf-8');
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
});

app.post('/playlists', ( request, response ) => { // Cria uma playlist

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

  fs.writeFileSync(path.resolve(__dirname, '..', 'playlists', `${playlist.name}.json`), JSON.stringify(playlist.tracks, null, 2));

  return response.json(playlist);
});

app.delete('/playlist/:name', ( request, response ) => {
  let { name } = request.params;

  let exists = false;

  fs.readdirSync(path.resolve(__dirname, '..', 'playlists')).map((file) => {
    if (file == `${name}.json`){
      exists = true;
    }
  });

  if (exists) {
    fs.unlinkSync(path.resolve(__dirname, '..', 'playlists', `${name}.json`));
    return response.sendStatus(200);
  }

  return response.sendStatus(404);
});

app.get('/playlist/:name', ( request, response ) => {
  let { name } = request.params;

  let tracks: string;

  try {
    tracks = fs.readFileSync(path.resolve(__dirname, '..', 'playlists', `${name}.json`), 'utf-8');
  } catch (error) {
    console.log(error);
    return response.sendStatus(404);
  };

  let playlist: IPlaylist = {
    name,
    tracks: JSON.parse(tracks)
  };

  response.json(playlist);
})

app.use(cors()); // Importante

app.listen(3333);