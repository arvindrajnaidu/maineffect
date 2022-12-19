import { expect } from 'chai'
import { parse } from '../maineffect'

const parsed = parse(require.resolve('./fold'))

describe('fold', () => {
  const folder = parsed.find('folder')
  it('should fold ', () => {
      const result = folder
                        .fold('a', 'A')
                        .callWith()
      expect(result.a).to.equal('A')
  })

  it('should fold ', () => {
    const result = folder
                      .callWith()
    expect(result.a).to.deep.equal({})
  })
})
