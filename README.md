## Node.js Mocha Test Boilerplate

#### Installation
Install local dependencies
```
npm i
```

#### Running unit test
Execute all unit tests (mocha will look for pattern based `test` named files)

##### Running once
```
npm test
```

##### Running with file watchers
```
npm run test-dev
```


Arguments:

Always return something inspectable. Something useful that reveals the path the execution took.

You have to call functions on an argument.

const handler = (req, res) => {
    let result
    if (!req.params) {
        result = {
            status: 400,
            json: { msg: 'WTF?' }
        }
    } else {
        result = {
            status: 200,
            json: { msg: 'Thanks'}
        }
    }
    res.status(result.status).json(result.json)
    return result
}

VS

const handler = (req, res) => {
    if (!req.params) {
        res.status(400)
            .json({ msg: 'WTF?' })
    } else {
        res.status(200)
            .json({ msg: 'Thanks' })
    }
}
