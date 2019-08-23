
const sum = (a, b) => a + b

const sumAsync = async (a, b) => {
    const result = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(a + b), 0)
    })
    return result
}

const pitcher = message => {
    throw new Error(message) 
}

const pitcherAsync = async (message) => {
    const result = await new Promise((resolve, reject) => {
        setTimeout(() => {
            return reject(new Error(message))
        }, 0)
    })
}

const copyUserObject = (user, newName) => {
  const newUser = {...user}
  newUser.name = newName
  return newUser
}
