require('isomorphic-fetch')
const async = require('async')
const logger = require('../src/lib/logger')

const priceConversion = n => parseFloat(n)
const quantityConversion = q => parseInt(q)

const setup = () => {
    return {
        cartServiceUrl: process.env.SERVICE_URL ||
            'https://qa-paypal-cartdatanodeserv.herokuapp.com/graphql'
    }
}

const {cartServiceUrl} = setup()

const sortByKeenTimestamp = (data) => {
    return data.sort((firstProduct, secondProduct) => {
        return (
          new Date(firstProduct.keen.timestamp).getTime() -
          new Date(secondProduct.keen.timestamp).getTime()
        )
    })
}

const getRecordsFromData = (data) => {
    return data.reduce((prev, curr) => {
        prev[curr.cartId] = prev[curr.cartId] || { items: [] }
        // user info
        prev[curr.cartId].userId = curr.user.id
        prev[curr.cartId].userName = curr.user.name
        prev[curr.cartId].userEmail = curr.user.email
        // cart info
        prev[curr.cartId].clientId = curr.clientId
        prev[curr.cartId].cartId = curr.cartId
        prev[curr.cartId].items = prev[curr.cartId].items.concat(curr.items)
        // timestamps
        prev[curr.cartId].updatedAt = curr.keen.timestamp
        prev[curr.cartId].createdAt =
          prev[curr.cartId].createdAt || curr.keen.created_at
        // price
        prev[curr.cartId].total = curr.total
        prev[curr.cartId].currencyCode = curr.currencyCode
        return prev
    }, {})
}

const getVariablesArrayFromRecords = (records) => {
    const variablesArray = Object.keys(records).map((key) => {
        const recordValue = records[key]
        recordValue.total = recordValue.total && priceConversion(recordValue.total)
        const products = recordValue.items.map(item => {
            return {
              id: item.id,
              title: item.title,
              price: item.price && priceConversion(item.price),
              imageUrl: item.imgUrl,
              description: item.description,
              url: item.url,
              quantity: (item.quantity && quantityConversion(item.quantity)) || 1
            }
        })
  
        const cartVariables = JSON.stringify({
            cart: {
                cartId: recordValue.cartId,
                clientId: recordValue.clientId,
                createdAt: recordValue.createdAt,
                updatedAt: recordValue.updatedAt,
                deletedAt: recordValue.deletedAt,
                status: 'Created',
                userId: recordValue.userId,
                userName: recordValue.userName,
                userEmail: recordValue.userEmail,
                total: recordValue.total,
                currencyCode: recordValue.currencyCode || 'USD',
                products
            }
        })
        return cartVariables
    })
    return variablesArray
}

const uploadVariables = async (cartVariables, callback) => {
    const body = JSON.stringify({
        variables: cartVariables,
        query: `mutation ($cart: CartInput!) {
            addCart(cart: $cart) {
            cartId
            status
            }
        }`.replace(/\n/g, ' ')
    })

    try {
        const fetchResponse = await fetch(cartServiceUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer e2eb26fd-fdd2-48dc-84d1-481fa8966f84'
            },
            body
        })
        const jsonResponse = await fetchResponse.json()
        return callback(null, jsonResponse)
    } catch(e) {
        return callback(e)
    }
}

// todo: handle delete events
const processCarts = data => {
  data = sortByKeenTimestamp(data)
  const records = getRecordsFromData(data)
  const variablesArray = getVariablesArrayFromRecords(records)

  return new Promise((resolve, reject) => {
    async.eachLimit(
        variablesArray,
        50,
        uploadVariables,
        (err, result) => {
            if (err) {
                logger.error('async.eachLimit::cart-event.js:', err)
                return reject(new Error(err))
            }
            return resolve(result)
        }
    )
  })
}

exports.processCarts = processCarts
