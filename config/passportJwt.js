

const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const { hashKey } = require('../helpers/constants');
const db = require('../models')
module.exports=JwtAuth=(passport)=>{
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = hashKey;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    console.log(jwt_payload)
    await db.User.findOne({where:{id: jwt_payload.id}}).then((user,err)=>{
        if (err) {
            console.log(err)
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    })
}))
}

