const fs = require("fs")
const chalk = require("chalk")
const sass = require("node-sass")

const STYLE = process.argv[2]
if (!fs.existsSync(`./src/${STYLE}/style.scss`))
    process.exit(console.log(chalk.red(`Error: "src/${STYLE}/style.scss" does not exist.`)))

sass.render({ file: `./src/${STYLE}/style.scss`, outputStyle: "compressed" }, (err, result) => {
    if (err)
        process.exit(console.log(chalk.red(err.formatted)))
    if (!fs.existsSync("./dist"))
        fs.mkdirSync("./dist")
    fs.writeFileSync(`./dist/${STYLE}.min.css`, result.css)
    console.log(chalk.green(`Compiled ${STYLE}.`))
})