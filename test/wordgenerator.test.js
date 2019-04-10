import { expect } from 'chai'
import { parseFn } from '../src/mockoff'

const parsed = parseFn(`${__dirname}/../src/examples/wordgenerator.js`)

describe('Wordgenerator Functions', () => {
    describe('generateWord()', () => {
        it('should return a word', () => {
            const a = parsed.find('generateWord').callWith().result
            expect(a).to.equal('foo')
        });
    });
});