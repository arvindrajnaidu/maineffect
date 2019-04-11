import { expect } from 'chai'
import { parseFn } from '../src/maineffect'
import sinon from 'sinon'

const parsed = parseFn(`${__dirname}/../src/examples/lambda.js`)

describe('Lambda Functions', () => {
    describe('sortByKeenTimestamp()', () => {
        it('should sort by keen timestamp', () => {
            const result = parsed
                        .find('sortByKeenTimestamp')
                        .callWith([{
                            keen: {
                                timestamp: 1554908877176
                            }
                        }, {
                            keen: {
                                timestamp: 1554908866354
                            }
                        }])
                        .result
                                 
            expect(result).to.deep.equal([{
                keen: {
                    timestamp: 1554908866354
                }
            }, {
                keen: {
                    timestamp: 1554908877176
                }
            }])
        })
    })

    describe('getRecordsFromData()', () => {
        it('should get reords from datta', () => {
            const result = parsed
                        .find('getRecordsFromData')
                        .callWith([{
                            "cartEventType": "addToCart",
                            "cartId": "1554867956435-songz-1554867959059",
                            "items": [
                              {
                                "weight": 4,
                                "requires_shipping": true,
                                "updated_at": "2018-09-11T19:27:50-07:00",
                                "inventory_quantity": 1,
                                "weight_unit": "oz",
                                "compare_at_price": null,
                                "id": 6989017350201,
                                "sku": "8494845",
                                "title": "A Gift For A Friend: XS",
                                "inventory_policy": "deny",
                                "inventory_management": null,
                                "fulfillment_service": "printful",
                                "option2": null,
                                "option3": null,
                                "admin_graphql_api_id": "gid://shopify/ProductVariant/6989017350201",
                                "option1": "XS",
                                "price": "25.00",
                                "barcode": null,
                                "image_id": 2053033852985,
                                "taxable": true,
                                "old_inventory_quantity": 1,
                                "grams": 113,
                                "product_id": 536790335545,
                                "url": "https://cr.ppmuse.com/",
                                "created_at": "2018-03-08T14:53:12-08:00",
                                "imgUrl": "https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-37d2a869.jpg?v=1520549594",
                                "inventory_item_id": 6978884206649,
                                "position": 1
                              }
                            ],
                            "clientId": "AZdikCQZCGuR1aUNJVk5IlhYsZ9sWHQQ8u5gc1LCF3xTw9XjVNIt7h7MtL5S4MwXZ5XNm6mRl8IyaQzY",
                            "trackingType": "cartEvent",
                            "keen": {
                              "timestamp": "2019-04-10T03:46:17.776Z",
                              "created_at": "2019-04-10T03:46:17.776Z",
                              "id": "5cad67095bed23000197073d"
                            },
                            "user": {
                              "guid": "055a533416a0a4ccc1353d32ffffffff",
                              "email": "1554867955900@ppmuse.com",
                              "name": "Annonynomous",
                              "id": "0b5b7dea9d82acd343c19aadba"
                            },
                            "total": "25.00"
                          }, {
                            "cartEventType": "addToCart",
                            "cartId": "1554867956435-songz-1554867959059",
                            "items": [
                              {
                                "weight": 4.5,
                                "requires_shipping": true,
                                "updated_at": "2018-09-11T19:16:55-07:00",
                                "inventory_quantity": 1,
                                "weight_unit": "oz",
                                "compare_at_price": null,
                                "id": 6837513355321,
                                "sku": "4203432",
                                "title": "BFS - Breadth First Search: S",
                                "inventory_policy": "deny",
                                "inventory_management": null,
                                "fulfillment_service": "printful",
                                "option2": null,
                                "option3": null,
                                "admin_graphql_api_id": "gid://shopify/ProductVariant/6837513355321",
                                "option1": "S",
                                "price": "19.00",
                                "barcode": null,
                                "image_id": 1977692586041,
                                "taxable": true,
                                "old_inventory_quantity": 1,
                                "grams": 128,
                                "product_id": 509746282553,
                                "url": "https://cr.ppmuse.com/",
                                "created_at": "2018-02-21T02:19:28-08:00",
                                "imgUrl": "https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-3cf88634.jpg?v=1519208370",
                                "inventory_item_id": 6825637740601,
                                "position": 1
                              }
                            ],
                            "clientId": "AZdikCQZCGuR1aUNJVk5IlhYsZ9sWHQQ8u5gc1LCF3xTw9XjVNIt7h7MtL5S4MwXZ5XNm6mRl8IyaQzY",
                            "trackingType": "cartEvent",
                            "keen": {
                              "timestamp": "2019-04-10T03:46:18.214Z",
                              "created_at": "2019-04-10T03:46:18.214Z",
                              "id": "5cad670aa120d70001d8788e"
                            },
                            "user": {
                              "guid": "055a533416a0a4ccc1353d32ffffffff",
                              "email": "1554867955900@ppmuse.com",
                              "name": "Annonynomous",
                              "id": "0b5b7dea9d82acd343c19aadba"
                            },
                            "total": "44.00"
                          }])
                        .result
            expect(result).to.deep.equal({
                "1554867956435-songz-1554867959059": {
                    "items": [{
                        "weight": 4,
                        "requires_shipping": true,
                        "updated_at": "2018-09-11T19:27:50-07:00",
                        "inventory_quantity": 1,
                        "weight_unit": "oz",
                        "compare_at_price": null,
                        "id": 6989017350201,
                        "sku": "8494845",
                        "title": "A Gift For A Friend: XS",
                        "inventory_policy": "deny",
                        "inventory_management": null,
                        "fulfillment_service": "printful",
                        "option2": null,
                        "option3": null,
                        "admin_graphql_api_id": "gid://shopify/ProductVariant/6989017350201",
                        "option1": "XS",
                        "price": "25.00",
                        "barcode": null,
                        "image_id": 2053033852985,
                        "taxable": true,
                        "old_inventory_quantity": 1,
                        "grams": 113,
                        "product_id": 536790335545,
                        "url": "https://cr.ppmuse.com/",
                        "created_at": "2018-03-08T14:53:12-08:00",
                        "imgUrl": "https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-37d2a869.jpg?v=1520549594",
                        "inventory_item_id": 6978884206649,
                        "position": 1
                    }, {
                        "weight": 4.5,
                        "requires_shipping": true,
                        "updated_at": "2018-09-11T19:16:55-07:00",
                        "inventory_quantity": 1,
                        "weight_unit": "oz",
                        "compare_at_price": null,
                        "id": 6837513355321,
                        "sku": "4203432",
                        "title": "BFS - Breadth First Search: S",
                        "inventory_policy": "deny",
                        "inventory_management": null,
                        "fulfillment_service": "printful",
                        "option2": null,
                        "option3": null,
                        "admin_graphql_api_id": "gid://shopify/ProductVariant/6837513355321",
                        "option1": "S",
                        "price": "19.00",
                        "barcode": null,
                        "image_id": 1977692586041,
                        "taxable": true,
                        "old_inventory_quantity": 1,
                        "grams": 128,
                        "product_id": 509746282553,
                        "url": "https://cr.ppmuse.com/",
                        "created_at": "2018-02-21T02:19:28-08:00",
                        "imgUrl": "https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-3cf88634.jpg?v=1519208370",
                        "inventory_item_id": 6825637740601,
                        "position": 1
                    }],
                    "userId": "0b5b7dea9d82acd343c19aadba",
                    "userName": "Annonynomous",
                    "userEmail": "1554867955900@ppmuse.com",
                    "clientId": "AZdikCQZCGuR1aUNJVk5IlhYsZ9sWHQQ8u5gc1LCF3xTw9XjVNIt7h7MtL5S4MwXZ5XNm6mRl8IyaQzY",
                    "cartId": "1554867956435-songz-1554867959059",
                    "updatedAt": "2019-04-10T03:46:18.214Z",
                    "createdAt": "2019-04-10T03:46:17.776Z",
                    "total": "44.00",
                    "currencyCode": undefined
                }
            })
        })
    })

    describe('getVariablesArrayFromRecords', () => {
        it('should get variables from records', () => {
            const result = parsed
                        .find('getVariablesArrayFromRecords')
                        .provide('priceConversion', parseFloat)
                        .provide('quantityConversion', parseInt)
                        .callWith({
                            "1554867956435-songz-1554867959059": {
                                "items": [{
                                    "weight": 4,
                                    "requires_shipping": true,
                                    "updated_at": "2018-09-11T19:27:50-07:00",
                                    "inventory_quantity": 1,
                                    "weight_unit": "oz",
                                    "compare_at_price": null,
                                    "id": 6989017350201,
                                    "sku": "8494845",
                                    "title": "A Gift For A Friend: XS",
                                    "inventory_policy": "deny",
                                    "inventory_management": null,
                                    "fulfillment_service": "printful",
                                    "option2": null,
                                    "option3": null,
                                    "admin_graphql_api_id": "gid://shopify/ProductVariant/6989017350201",
                                    "option1": "XS",
                                    "price": "25.00",
                                    "barcode": null,
                                    "image_id": 2053033852985,
                                    "taxable": true,
                                    "old_inventory_quantity": 1,
                                    "grams": 113,
                                    "product_id": 536790335545,
                                    "url": "https://cr.ppmuse.com/",
                                    "created_at": "2018-03-08T14:53:12-08:00",
                                    "imgUrl": "https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-37d2a869.jpg?v=1520549594",
                                    "inventory_item_id": 6978884206649,
                                    "position": 1
                                }, {
                                    "weight": 4.5,
                                    "requires_shipping": true,
                                    "updated_at": "2018-09-11T19:16:55-07:00",
                                    "inventory_quantity": 1,
                                    "weight_unit": "oz",
                                    "compare_at_price": null,
                                    "id": 6837513355321,
                                    "sku": "4203432",
                                    "title": "BFS - Breadth First Search: S",
                                    "inventory_policy": "deny",
                                    "inventory_management": null,
                                    "fulfillment_service": "printful",
                                    "option2": null,
                                    "option3": null,
                                    "admin_graphql_api_id": "gid://shopify/ProductVariant/6837513355321",
                                    "option1": "S",
                                    "price": "19.00",
                                    "barcode": null,
                                    "image_id": 1977692586041,
                                    "taxable": true,
                                    "old_inventory_quantity": 1,
                                    "grams": 128,
                                    "product_id": 509746282553,
                                    "url": "https://cr.ppmuse.com/",
                                    "created_at": "2018-02-21T02:19:28-08:00",
                                    "imgUrl": "https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-3cf88634.jpg?v=1519208370",
                                    "inventory_item_id": 6825637740601,
                                    "position": 1
                                }],
                                "userId": "0b5b7dea9d82acd343c19aadba",
                                "userName": "Annonynomous",
                                "userEmail": "1554867955900@ppmuse.com",
                                "clientId": "AZdikCQZCGuR1aUNJVk5IlhYsZ9sWHQQ8u5gc1LCF3xTw9XjVNIt7h7MtL5S4MwXZ5XNm6mRl8IyaQzY",
                                "cartId": "1554867956435-songz-1554867959059",
                                "updatedAt": "2019-04-10T03:46:18.214Z",
                                "createdAt": "2019-04-10T03:46:17.776Z",
                                "total": "44.00",
                                "currencyCode": undefined
                            }
                        })
                        .result
            expect(result).to.deep.equal([ `{"cart":{"cartId":"1554867956435-songz-1554867959059","clientId":"AZdikCQZCGuR1aUNJVk5IlhYsZ9sWHQQ8u5gc1LCF3xTw9XjVNIt7h7MtL5S4MwXZ5XNm6mRl8IyaQzY","createdAt":"2019-04-10T03:46:17.776Z","updatedAt":"2019-04-10T03:46:18.214Z","status":"Created","userId":"0b5b7dea9d82acd343c19aadba","userName":"Annonynomous","userEmail":"1554867955900@ppmuse.com","total":44,"currencyCode":"USD","products":[{"id":6989017350201,"title":"A Gift For A Friend: XS","price":25,"imageUrl":"https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-37d2a869.jpg?v=1520549594","url":"https://cr.ppmuse.com/","quantity":1},{"id":6837513355321,"title":"BFS - Breadth First Search: S","price":19,"imageUrl":"https://cdn.shopify.com/s/files/1/0004/3722/3481/products/mockup-3cf88634.jpg?v=1519208370","url":"https://cr.ppmuse.com/","quantity":1}]}}` ])
        })
    })

    describe('uploadVariables', () => {
        it('should get upload payload from variables', async () => {
            const callbackSpy = sinon.spy()
            const fetchStub = sinon.stub().resolves('bar')
            const result = await parsed
                        .find('uploadVariables')
                        .fold('jsonResponse', {})
                        .provide('cartServiceUrl', 'url')
                        .provide('fetch', fetchStub)
                        .callWith('foo', callbackSpy)
                        .result
            const fetchBody = JSON.parse(fetchStub.getCall(0).args[1].body)
            expect(fetchBody.variables).to.equal('foo')
            expect(callbackSpy.getCall(0).lastArg).to.deep.equal({})
        })
        it('should get upload payload from variables', async () => {
            const callbackSpy = sinon.spy()
            const fetchStub = sinon.stub().resolves('bar')
            const result = await parsed
                        .find('uploadVariables')
                        .fold('jsonResponse', {})
                        .provide('cartServiceUrl', 'url')
                        .provide('fetch', fetchStub)
                        .callWith('foo', callbackSpy)
                        .result
            const fetchBody = JSON.parse(fetchStub.getCall(0).args[1].body)
            expect(fetchBody.variables).to.equal('foo')
            expect(callbackSpy.getCall(0).lastArg).to.deep.equal({})
        })
    })

    describe('processCarts()', () => {
        it('should return the sum of two numbers', async () => {
            const a = await parsed
                        .find('processCarts')
                        .destroy('logger')
                        .fold('records', '[]')
                        .provide('sortByKeenTimestamp', () => [])
                        .provide('getVariablesArrayFromRecords', () => [])
                        .provide('async', {eachLimit: sinon.stub().callsArgWith(3, null, 'foo')})
                        .provide('uploadVariables', () => {})
                        .callWith([])
                        .result
                 
            expect(a).to.equal('foo')
        });

        it('should throw is upload fails', async () => {
            try {
                await parsed
                    .find('processCarts')
                    .destroy('logger')
                    .fold('records', '[]')
                    .provide('sortByKeenTimestamp', () => [])
                    .provide('getVariablesArrayFromRecords', () => [])
                    .provide('async', {eachLimit: sinon.stub().callsArgWith(3, 'foo')})
                    .provide('uploadVariables', () => {})
                    .callWith([])
                    .result
            } catch (e) {
                expect(e.message).to.be.equal('foo')
            }
        });
    });
});