const fs = require("fs/promises")
const chalk = require("chalk")
const sass = require("node-sass")
const render = require("util").promisify(sass.render)
const userCSS = require("usercss-meta")

async function build(style) {
    await fs.access(`./styles/${style}/style.scss`).catch(() => {
        console.log(
            chalk.red(`Error: style ${chalk.redBright(`"${style}"`)} does not exist.`)
        )
        process.exit()
    })

    let error = null
    const result = await render({
        file: `./styles/${style}/style.scss`,
        outputStyle: "compressed"
    }).catch(err => (error = err))
    if (error)
        return console.log(
            chalk.red("Error: ") + chalk.redBright(error.formatted.slice(7))
        )

    await fs
        .access(`./styles/${style}/dist/`)
        .catch(() => fs.mkdir(`./styles/${style}/dist/`))

    const defaults = JSON.parse(await fs.readFile("./styles/defaults.json"))
    const data = JSON.parse(await fs.readFile(`./styles/${style}/style.json`))
    const meta = userCSS.stringify({ ...defaults, ...data }, { alignKeys: true })
    await fs.writeFile(
        `./styles/${style}/dist/${style}.min.css`,
        `${meta}\n\n${result.css}`
    )

    console.log(chalk.green(`Compiled ${chalk.greenBright(style)}.`))
}

build(process.argv[2])
module.exports = build
