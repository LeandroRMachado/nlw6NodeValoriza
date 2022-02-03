import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken"

interface IPayLoad {
  sub: string
}


export function ensureAuthenticated(request:Request,response:Response, next: NextFunction) {

  // Receber o token
  const Authtoken = request.headers.authorization


  // Validar se token está preenchido

  if(!Authtoken) {
    return response.status(401).json({
    message: "Unauthorized"})
  }

  const [,token] = Authtoken.split(' ')

  try {
    // Validar se token é válido
    const { sub } = verify( token ,"af211c0849d8dc787335aebcd5197288") as IPayLoad
    // Recuperar informações do usuário

    request.user_id = sub


    return next()
  } catch (err) {
    return response.status(401).json({message: "Unauthorized"})

  }



}