import { Users } from '../models/user.model'
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from '../config/config';

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET_KEY,
  };
  
  export default new Strategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      done(err);
    }
  });