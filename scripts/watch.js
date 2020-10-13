const chalk = require("chalk")
const fs = require("fs/promises")
const chokidar = require("chokidar")
const build = require("./build")

async function watch(style) {
    const path = `./styles/${style}`
    await fs.access(path).catch(() => {
        chalk.red(`${path} does not exist.`)
        process.exit()
    })

    const start = new Date()
    console.log(chalk.yellow(`Watching for changes in ${chalk.yellowBright(style)}.`))
    chokidar.watch(path, { ignored: /dist/ }).on("all", (event, path) => {
        if (new Date() - start < 100) return
        console.log(`${chalk.yellow(event) + ":"} ${chalk.yellowBright(path)}`)
        setTimeout(build, 100, style)
    })
}

watch(process.argv[2])
module.exports = watch
