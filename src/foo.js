const istanbul = require('istanbul-lib-instrument')
const coverage = require('istanbul-lib-coverage')
const vm = require('vm')

const instrumenter = istanbul.createInstrumenter({esModules: true, debug: true})

const code = `
    export const handler = async (req, res) => {
        log.info('Inside handler')
        const myName = await fetch('/name/me')
        const luckyNumber = randomizer().get()
        let message = \`Hello \${req.query.user}. I am \${myName}. Your lucky number is \${luckyNumber}\`
        return res.send(message)
    }
`
// const sb = vm.createContext({})

const instrumentedCode = instrumenter.instrumentSync(code)
console.log(instrumentedCode, '<<<<<<<<<<<<<<')
// vm.runInContext(code, sb)
