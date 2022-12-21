// import jwt from 'jsonwebtoken';
// console.log(global.__coverage__, '<<<<<');
const apigwSimulator = server => {
  if (process.env.NODE_ENV !== 'development') return;
  const onPreHandler = (request, h) => {
    const authToken = request.headers['z-auth-token'];
    if (!authToken) return h.continue;

    if (!request.headers['z-apigw-role-id'] || !request.headers['z-apigw-cognito-user-id']) {
      const decrypted = jwt.decode(authToken);
      request.headers['z-apigw-cognito-user-id'] = decrypted.sub;
      request.headers['z-apigw-role-id'] = decrypted['custom:roleID'];
      request.headers['z-apigw-partner-id'] = decrypted['custom:partnerID'];
    }

    return h.continue;
  };
  server.ext('onPreHandler', onPreHandler);
};

export default apigwSimulator;
