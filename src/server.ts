import express, { response } from 'express';
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

  const playlist = {
    name: data.name,
    tracks: data.tracks
  }

  fs.writeFileSync(path.resolve(__dirname, '..', 'playlists', `${playlist.name}.json`), JSON.stringify(playlist.tracks, null, 2));

  return response.json(playlist)
});

// app.get('/playlists', ( request, response ) => { // Lista todas as playlists e seu conteúdo
//   fs.readdir(path.resolve(__dirname, '..', 'playlists'), function (err, data) {
//     if (err) {
//       console.log(err);
//       return response.sendStatus(500);
//     }
//     let playlists: IPlaylists[] = [];

//     data.map((value) => {
//       fs.readFile(path.resolve(__dirname, '..', 'playlists', value), 'utf8' , (err, data) => {
//         if (err) {
//           console.log(err);
//           return response.sendStatus(500);
//         };
//         playlists.push({
//           name: value,
//           tracks: data
//         });
//       });

//       return playlists;

//     })
//   });
// });


// fs.readFile(path.resolve(__dirname, '..', 'playlists', 'file.m3u'), 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// });

// fs.writeFile('helloworld.txt', 'Hello World!', function (err) {
//   if (err) return console.log(err);
//   console.log('Hello World > helloworld.txt');
// });

// fs.readdir(path.resolve(__dirname, '..', 'music'), function (err, data) {
//   if (err) {
//     return console.log(err);
//   }
//   console.log(data);
// })


app.listen(3333);