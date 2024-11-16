import jwt from "jsonwebtoken"

export const generateToken = (user) => jwt.sign({ email: user.email }, "!!$#$##$#@#$@#$!%@$%SecretToken%@#$%@#%**%%^")