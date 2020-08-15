const fs = require("fs")
const chalk = require("chalk")
const sass = require("node-sass")
const userCSS = require("usercss-meta")

const STYLE = process.argv[2]
if (!fs.existsSync(`./src/${STYLE}/style.scss`))
    process.exit(console.log(chalk.red(`Error: "src/${STYLE}/style.scss" does not exist.`)))

sass.render({ file: `./src/${STYLE}/style.scss`, outputStyle: "compressed" }, (err, result) => {
    if (err)
        process.exit(console.log(chalk.red(err.formatted)))
    if (!fs.existsSync("./dist"))
        fs.mkdirSync("./dist")

    const defaultData = JSON.parse(fs.readFileSync("./src/defaults.json"))
    const styleData = JSON.parse(fs.readFileSync(`./src/${STYLE}/style.json`))
    const data = { ...defaultData, ...styleData }
    const meta = userCSS.stringify(data, { alignKeys: true })
    fs.writeFileSync(`./dist/${STYLE}.min.css`, `${meta}\n\n${result.css}`)

    console.log(chalk.green(`Compiled ${STYLE}.`))
})