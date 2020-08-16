const fs = require("fs")
const chalk = require("chalk")
const sass = require("node-sass")
const render = require("util").promisify(sass.render)
const userCSS = require("usercss-meta")

async function build(style) {
    if (!fs.existsSync(`./styles/${style}/style.scss`))
        console.log(chalk.red(`Error: "styles/${style}/style.scss" does not exist.`))

    let error = null
    const result = await render({
        file: `./styles/${style}/style.scss`,
        outputStyle: "compressed"
    }).catch(err => error = err)
    if (error) return console.log(chalk.red(error.formatted))

    if (!fs.existsSync(`./styles/${style}/dist/`))
        fs.mkdirSync(`./styles/${style}/dist/`)

    const data = userCSS.stringify({
        ...JSON.parse(fs.readFileSync("./styles/defaults.json")),
        ...JSON.parse(fs.readFileSync(`./styles/${style}/style.json`))
    }, { alignKeys: true })
    fs.writeFileSync(`./styles/${style}/dist/${style}.min.css`, `${data}\n\n${result.css}`)

    console.log(chalk.green(`Compiled ${style}.`))
}

build(process.argv[2])
module.exports = build