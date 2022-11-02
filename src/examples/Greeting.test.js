import { expect } from 'chai'
import { load } from '../maineffect'
import React from 'react'
// import ReactDOMServer from 'react-dom/server'
import sinon, { stub } from 'sinon'

describe('Greeeting', () => {
    const parsed = load(require.resolve('./Greeting.js'), { React });

    describe('constructor()', () => {
        it('should setup the right state', () => {
            const thisParam = {}
            parsed
                .find('Greeting')
                .find('constructor')
                .apply(thisParam)
            expect(thisParam.state).to.deep.equal({
                isLoaded: false,
            })
        })
    })

    describe('componentDidMount()', () => {
        const setStateStub = stub()
        it('should set state to loaded', () => {
            parsed
                .find('componentDidMount')
                .apply({
                    setState: setStateStub
                })
            sinon.assert.calledWith(setStateStub, {
                isLoaded: true
            });
        })
    })

    describe('render()', () => {
        it('should render', () => {
            const { result } = parsed
                .find('Greeting')
                .find('render')
                .apply({
                    props: {
                        name: 'FOO'
                    }
                })
            // const html = ReactDOMServer.renderToString(result)
            // expect(html).to.include('Hello FOO')
        })
    })
})
