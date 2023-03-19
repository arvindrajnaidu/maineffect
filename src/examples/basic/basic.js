
export const sum = (a, b) => a + b

export const sumAsync = async (a, b) => {
    const result = await new Promise((resolve) => {
        setTimeout(() => resolve(a + b), 0)
    })
    return result
}

export const pitcher = message => {
    throw new Error(message) 
}

export const pitcherAsync = (message) => {    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            return reject(new Error(message))
        }, 0)
    })
}

export const copyUserObject = (user, newName) => {
  const newUser = {...user}
  newUser.name = newName
  return newUser
}

function simpleFunction () {
    return true
}