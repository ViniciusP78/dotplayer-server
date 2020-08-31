import { Request, Response } from 'express';
import fs from 'fs';

import { tracksDir } from '../server';

class TracksController {
  index( request: Request, response: Response) {
    let tracks = fs.readdirSync(tracksDir);
    tracks.pop(); // Remove o tracks_here da listagem
    response.json(tracks);
  }
}

export default TracksController;