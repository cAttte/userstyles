const chalk = require("chalk")
const fs = require("fs")
const chokidar = require("chokidar")
const build = require("./build")

const style = process.argv[2]
const path = `./styles/${style}`
if (!fs.existsSync(path))
    process.exit(chalk.red(`${path} does not exist.`))

const start = new Date()
console.log(chalk.green(`Watching for changes in ${style}.`))
chokidar.watch(path, { ignored: /dist/ }).on("all", (event, path) => {
    if (new Date() - start < 100) return
    console.log(`${chalk.yellow(event)}: ${path}`)
    setTimeout(build, 100, style)
})