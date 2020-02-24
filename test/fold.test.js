import { expect } from 'chai'
import { parse } from '../src/maineffect'

const parsed = parse('../src/examples/fold')

describe('fold', () => {
  const folder = parsed.find('folder')
  it('should fold ', () => {
      const result = folder
                        .fold('a', 'A')
                        .callWith()
                        .result
      expect(result.a).to.equal('A')
  })
})
