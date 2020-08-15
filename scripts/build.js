const fs = require("fs")
const chalk = require("chalk")
const sass = require("node-sass")
const userCSS = require("usercss-meta")

const STYLE = process.argv[2]
if (!fs.existsSync(`./styles/${STYLE}/style.scss`))
    process.exit(console.log(chalk.red(`Error: "styles/${STYLE}/style.scss" does not exist.`)))

sass.render({ file: `./styles/${STYLE}/style.scss`, outputStyle: "compressed" }, (err, result) => {
    if (err)
        process.exit(console.log(chalk.red(err.formatted)))
    if (!fs.existsSync(`./styles/${STYLE}/dist/`))
        fs.mkdirSync(`./styles/${STYLE}/dist/`)

    const defaultData = JSON.parse(fs.readFileSync("./styles/defaults.json"))
    const styleData = JSON.parse(fs.readFileSync(`./styles/${STYLE}/style.json`))
    const data = { ...defaultData, ...styleData }
    const meta = userCSS.stringify(data, { alignKeys: true })
    fs.writeFileSync(`./styles/${STYLE}/dist/${STYLE}.min.css`, `${meta}\n\n${result.css}`)

    console.log(chalk.green(`Compiled ${STYLE}.`))
})