import { parseFn, Stubs} from '../maineffect'

describe('asyncFn2', () => {
  const parsedFn = parseFn(require.resolve('./asyncFn2'));
  beforeEach(() => {
    parsedFn.reset();
  });

  // Run 1 - Coverage: 20% (2/10 statements)
  test('apiCall stub returns ok response', async () => {
    const stubs = Stubs(jest.fn);
    const apiCall = stubs.createStub('apiCall').mockResolvedValue({
      ok: true,
      data: [{ name: 'foo' }],
      status: 'success'
    });

    const result = await parsedFn
      .find('fetchData')
      .callWith(apiCall);

    expect(result).toEqual(['foo']);
    expect(stubs.getStubs().apiCall).toHaveBeenCalled();
  });

});