import { Request, Response } from 'express';
import { createConnection } from "typeorm";
import { User } from '../database/entity/User';

class UserController {
  create( request: Request, response: Response) {

    createConnection().then( async connection => {
      
      let user = new User();
      user.username = "Abner";
      user.pass = "0X763372hd";

      let userRepository = connection.getRepository(User);
      await userRepository.save(user);

      response.json("Usuário criado (provavelmente)");

    }).catch(error => response.json(error))
    
  }
}

export default UserController