import { expect } from 'chai'
import { load } from '../src/maineffect'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import sinon, {stub} from 'sinon'

describe('Greeeting', () => {
    const parsed = load('../src/examples/Greeting.js')
    describe('render()', () => {
        it('should render', () => {
            const {result} = parsed
                            .find('Greeting')
                            .find('render')
                            .provide('React', React)
                            .apply({
                                props: {
                                    name: 'FOO'
                                }
                            })
            expect(ReactDOMServer.renderToString(result)).to.include('Hello FOO')
        })
    })

    describe('componentDidMount()', () => {
        const setStateStub = stub()
        it('should set state to loaded', () => {
            const {result} = parsed
                            .find('componentDidMount')
                            // .provide('React', React)
                            .apply({
                                setState: setStateStub
                            })
            sinon.assert.calledWith(setStateStub, {
                isLoaded: true
            });
        })
    })
    
})
