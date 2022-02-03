import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"

import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

interface IAuthenticateRequest {
  email:string;
  password:string;
}

class AuthenticateUserService {

  async execute({email, password}: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories) 

    //Verificar se o email existe
    const user = await usersRepositories.findOne({email})

    if(!user) {
      throw new Error("Email/Password incorrect")
    }

    //verificar se senha está correta
    const passwordMatch = await compare(password, user.password)

    if(!passwordMatch) {
      throw new Error("Email/Password incorrect")
    }

    // Gerar o token se estiver certa
    const token = sign({ email: user.email}, "af211c0849d8dc787335aebcd5197288", {
      subject: user.id,
      expiresIn: "1d"
    } )

    return token

  }

}

export { AuthenticateUserService }