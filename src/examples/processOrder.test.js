import { parseFn, Stubs } from '../maineffect';

describe('processOrders', () => {
  const parsedFn = parseFn(require.resolve('./processOrder'));

  beforeEach(() => {
    parsedFn.reset();
  });

  test('processes valid buy order', () => {
    const stubs = Stubs(jest.fn);
    const validator = stubs.createStub('validator').mockReturnValue(true);

    const orders = [{ type: 'buy', amount: 100 }];
    const result = parsedFn
      .find('processOrders')
      .callWith(orders, validator);

    expect(result).toEqual([{ action: 'buy', amount: 100 }]);
    expect(stubs.getStubs().validator).toHaveBeenCalledWith(orders[0]);
  });

  test('processes valid sell order', () => {
    const stubs = Stubs(jest.fn);
    const validator = stubs.createStub('validator').mockReturnValue(true);

    const orders = [{ type: 'sell', amount: 50 }];
    const result = parsedFn
      .find('processOrders')
      .callWith(orders, validator);

    expect(result).toEqual([{ action: 'sell', amount: 50 }]);
    expect(stubs.getStubs().validator).toHaveBeenCalledWith(orders[0]);
  });

  test('processes unknown order type as hold', () => {
    const stubs = Stubs(jest.fn);
    const validator = stubs.createStub('validator').mockReturnValue(true);

    const orders = [{ type: 'unknown', amount: 25 }];
    const result = parsedFn
      .find('processOrders')
      .callWith(orders, validator);

    expect(result).toEqual([{ action: 'hold', amount: 0 }]);
  });

  test('rejects invalid order', () => {
    const stubs = Stubs(jest.fn);
    const validator = stubs.createStub('validator').mockReturnValue(false);

    const orders = [{ type: 'buy', amount: 100 }];
    const result = parsedFn
      .find('processOrders')
      .callWith(orders, validator);

    expect(result).toEqual([{ action: 'rejected', reason: 'invalid' }]);
  });

  test('handles validator error', () => {
    const stubs = Stubs(jest.fn);
    const validator = stubs.createStub('validator').mockImplementation(() => {
      throw new Error('validation failed');
    });

    const orders = [{ type: 'buy', amount: 100 }];
    const result = parsedFn
      .find('processOrders')
      .callWith(orders, validator);

    expect(result).toEqual([{ action: 'error', reason: 'validation failed' }]);
  });

  test('processes multiple orders', () => {
    const stubs = Stubs(jest.fn);
    const validator = stubs.createStub('validator')
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const orders = [
      { type: 'buy', amount: 100 },
      { type: 'sell', amount: 50 },
      { type: 'sell', amount: 75 }
    ];
    const result = parsedFn
      .find('processOrders')
      .callWith(orders, validator);

    expect(result).toEqual([
      { action: 'buy', amount: 100 },
      { action: 'rejected', reason: 'invalid' },
      { action: 'sell', amount: 75 }
    ]);
    expect(stubs.getStubs().validator).toHaveBeenCalledTimes(3);
  });
});
