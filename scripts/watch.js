const chalk = require("chalk")
const { exec } = require("child_process")
const fs = require("fs")
const chokidar = require("chokidar")

const STYLE = process.argv[2]
const path = `./styles/${STYLE}`
if (!fs.existsSync(path))
    process.exit(chalk.red(`${path} does not exist.`))

const start = new Date()
console.log(chalk.green(`Watching for changes in ${STYLE}.`))
chokidar.watch(path, { ignored: /dist/ })
    .on("all", (event, path) => {
        if (new Date() - start < 100) return

        console.log(`${chalk.yellow(event)}: ${path}`)
        exec(`npm run build -- ${STYLE}`).on("close", () =>
            console.log(chalk.green(`Compiled ${STYLE}.`))
        )
    })