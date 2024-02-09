const { spawn } = require("node:child_process");
const os = require("os");

if (os.platform() === "linux") {
        console.log("start machine")
	let machine = spawn("python",["machine.py", 11, 7])
	machine.stdout.on("data", (data) => {
		console.log(data.toString())
	})
}
