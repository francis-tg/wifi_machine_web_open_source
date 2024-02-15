const express = require("express");
const app = express();
const http = require("http");
const ngrok = require("./config/ngrok");
const cronos = require("./config/cron");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const session = require("express-session");
var sqlite = require("better-sqlite3");
//var SqliteStore = require("better-sqlite3-session-store")(session);
//var sessionsDB = new sqlite("./db/sessions.db");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const socketIO = require("socket.io");
const cors = require("cors");
const { setApiInfos } = require("./helpers/routerOsConnect");
const { Controller } = require("./routes/controller");
const { Machine } = require("./middleware/Machine");
const { if_eq } = require("./helpers/hbs.setting");
const passport = require("passport");
app.use(express.static("public"));
const { ConfigMikrotik } = require("./config/profileTicket");
const JwtAuth = require("./config/passportJwt");
const { setUpdate } = require("./middleware/UpdateDb");
const cron = require("node-cron");
const https = require("https");
const { readFileSync } = require("fs");
//const { setPublicUrl } = require("./helpers/TunnelNgrok");
require("dotenv").config();
// default option

// app.use(helmet());
//app.use(rateLimiterMiddleware);
app.use(cors());
app.set("trust proxy", 1);
app.use(cookieParser("X+a1+TKXwd26mkiUUwqzqQ=="));
app.disable("x-powered-by");
app.use(Machine);
// body parser config
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	}),
);

// passport config
require("./config/passport")(passport);
// Handlebars
app.engine(
	"handlebars",
	expressHandlebars({
		defaultLayout: "main",
		handlebars: allowInsecurePrototypeAccess(Handlebars),
		helpers: {
			selected: function (option, value) {
				if (parseInt(option) === parseInt(value)) {
					return "selected";
				} else {
					return "";
				}
			},
			equal: function (val1, val2) {
				if (val1 === val2) {
					return `<small class="text-danger"> ${val1}  <br/> Recharger rapidement le jus </small>`;
				} else {
					return `<div style="color:black">${val1}</div>`;
				}
			},
			morethan: function (val1, val2) {
				if (val1 >= val2) {
					return `<small class="text-danger">Recharger le jus partiel </small>`;
				}
			},
			checked: function (currentvalue) {
				return currentvalue == "1" ? ' checked="checked"' : "";
			},
			dividedBy: function (value, division) {
				let divided = value / division;
				return divided;
			},
			if_eq,
		},
	}),
);
app.set("view engine", "handlebars");
// Express session midleware
app.use(
	session({
		secret: "X+a1+TKXwd26mkiUUwqzqQ==",
		resave: true,
		saveUninitialized: true,
		cookie: { secure: false, maxAge: 4 * 60 * 60 * 1000 },
		/* store: new SqliteStore({
			//client: sessionsDB,
		}), */
	}),
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Global variables
app.use(function (req, res, next) {
	//const machine_data = await db.Machine_info.findByPk(1);
	//  res.locals.machine = machine_data.screenMessage;
	res.locals.user = req.user || null;
	next();
});
// Routes
Controller(app);
const port = process.env.PORT || 4000;
const server = http.createServer(app);
server.listen(port, () => {
	setTimeout(() => {
		ConfigMikrotik();
		//setPublicUrl();
	}, 5000);
	//require("./launchMachine.js")
	console.log(`server running on port: ${port}`);
});
const getActive = async () => {
	const { api } = await setApiInfos();
	const client = await api.connect();
	const result = await client.menu("/ip/hotspot/active").getAll();
	api.close();
	return {
		activeUsers: result,
		activeUsersCount: result.length,
	};
};
/* const autoConfigInterface = async () => {
  const {api} = await setApiInfos();
  const client = await api.connect();
  const users = await client.menu("/user").getAll();
  if (users.filter((user) => user.name.includes("machine")).length === 0) {
    await client.menu("/user").add({
      name: "machine",
      group: "full",
      comment: "ADNA machine user",
      password: "12345"
    });
    // await client.menu("/system/identity")
    setTimeout(() => {
      api.close();
      console.log("api is close ");
    }, 3000);
    return true;
  }
}; */

const secureServer = https.createServer(
	{
		key: readFileSync("./cert/adna-key.pem"),
		cert: readFileSync("./cert/adna-cert.pem"),
	},
	app,
);

//secureServer
const io = socketIO(server);
let interval;
io.on("connection", async (socket) => {
	console.log("a user connected");
	const active = await getActive();
	io.emit("user connect", active);
	interval = setInterval(async () => {
		const active = await getActive();
		io.emit("user connect", active);
	}, 60 * 3600);

	socket.on("disconnect", () => {
		clearInterval(interval);
		console.log("user disconnected  ");
	});
});

cron.schedule("0 0 * * *", () => {
	console.log("start every day at 00 pm");
	setUpdate();
});
