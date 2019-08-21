
const sum = (a, b) => a + b

const sumAsync = async (a, b) => {
    const result = await new Promise((resolve) => {
        setTimeout(() => resolve(a + b), 500)
    })
    return result
}

const sumAsync = async (a, b) => {
    const result = await new Promise((resolve) => {
        setTimeout(() => resolve(a + b), 500)
    })
    return result
}

const pitcher = message => {
    throw new Error(message) 
}

const pitcherAsync = async (message) => {
    const result = await new Promise((resolve, reject) => {
        // setTimeout(() => {
            return reject(new Error(message))
        // }, 1000)
    })
    return result
}
