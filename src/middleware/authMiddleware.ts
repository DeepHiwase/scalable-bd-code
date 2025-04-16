import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import { NextFunction, Response } from "express"
import { ProtectedRequest } from "../types/app-request"
import { AccessTokenError, TokenExpiredError } from "../core/CustomError"

const protect = asyncHandler(async (req: ProtectedRequest, res: Response, next: NextFunction) => {
  let token

  token = req.cookies.jwt

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }

      req.user = await User.findById(decoded.userId).select("-password")

      next()
    } catch (error) {
      console.error(error)
      throw new TokenExpiredError("Not authorized, token failed")
    }
  } else {
    throw new AccessTokenError("Not authorized, no token")
  }
})

export { protect }
