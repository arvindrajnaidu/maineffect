import { parseFn } from '../maineffect'

describe('apigwSimulator', () => {  
  const prod = parseFn(require.resolve('./apigwSimulator')).provide('process', {
    env: { NODE_ENV: 'production' },
  });
  const dev = parseFn(require.resolve('./apigwSimulator')).provide('process', {
    env: { NODE_ENV: 'development' },
  });

  it('should not call ext on server if env is not development', () => {
    const extStub = jest.fn();
    prod.find('apigwSimulator').callWith({ ext: extStub });
    expect(extStub).toBeCalledTimes(0);
  });

  it('should call ext on server if env is not development', () => {
    const extStub = jest.fn();
    dev.find('apigwSimulator').callWith({ ext: extStub });
    expect(extStub).toBeCalled();
  });

  describe('onPreHandler', () => {
    it('should not set any new headers when z-auth-token is not present', () => {
      const headers = {};
      dev.find('onPreHandler').callWith({ headers }, { continue: jest.fn() });
      expect(Object.keys(headers).length).toEqual(0);
    });

    it('should set any new headers when z-auth-token is present', () => {
      const headers = {
        'z-auth-token': 'token',
        'z-apigw-role-id': 'foo',
        'z-apigw-cognito-user-id': 'bar',
      };
      dev
        .find('onPreHandler')
        .provide('jwt', {
          decode: () => {
            return {
              'custom:roleID': 'foo',
              sub: 'bar',
              'custom:partnerID': 'foobar',
            };
          },
        })
        .callWith({ headers }, { continue: jest.fn() });
      expect(headers).toEqual({
        'z-auth-token': 'token',
        'z-apigw-role-id': 'foo',
        'z-apigw-cognito-user-id': 'bar',
      });
    });

    it('should set any new headers when z-auth-token is present', () => {
      const headers = { 'z-auth-token': 'token' };
      dev
        .find('onPreHandler')
        .provide('jwt', {
          decode: () => {
            return {
              'custom:roleID': 'foo',
              sub: 'bar',
              'custom:partnerID': 'foobar',
            };
          },
        })
        .callWith({ headers }, { continue: jest.fn() });
      expect(headers).toEqual({
        'z-auth-token': 'token',
        'z-apigw-role-id': 'foo',
        'z-apigw-cognito-user-id': 'bar',
        'z-apigw-partner-id': 'foobar',
      });
    });
  });
});
