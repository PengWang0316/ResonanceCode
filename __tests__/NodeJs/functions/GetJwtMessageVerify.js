import getJwtMessageVerify from '../../../NodeJsFiles/routers/functions/GetJwtMessageVerify';

jest.mock('../../../NodeJsFiles/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../../NodeJsFiles/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../../NodeJsFiles/MongoDB', () => ({ fetchOneUser: jest.fn().mockReturnValue(new Promise((resolve, reject) => resolve({ a: 1, b: 2 }))) }));

describe('GetJwtMessageVerify', () => {
  test('JwtMessageVerify without error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { fetchOneUser } = require('../../../NodeJsFiles/MongoDB');
    await getJwtMessageVerify(req, res);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(fetchOneUser).toHaveBeenCalledTimes(1);
    expect(fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).toHaveBeenLastCalledWith({ a: 1, b: 2, isAuth: true });
  });

  test('JwtMessageVerify with error', async () => {
    const mockJsonFn = jest.fn();
    const req = { query: { jwtMessage: 'jwtMessage' } };
    const res = { json: mockJsonFn };

    const { error } = require('../../../NodeJsFiles/utils/Logger');
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const mongoDB = require('../../../NodeJsFiles/MongoDB');
    mongoDB.fetchOneUser = jest.fn().mockReturnValue(new Promise((resolve, reject) => reject()));
    await getJwtMessageVerify(req, res);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(mongoDB.fetchOneUser).toHaveBeenCalledTimes(1);
    expect(mongoDB.fetchOneUser).toHaveBeenLastCalledWith('id');
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
