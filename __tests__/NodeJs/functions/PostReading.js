import postReading from '../../../NodeJsFiles/routers/functions/PostReading';

jest.mock('../../../NodeJsFiles/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../../NodeJsFiles/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../../NodeJsFiles/MongoDB', () => ({ createReading: jest.fn(), findHexagramImagesForReading: jest.fn().mockReturnValue(new Promise((resolve, reject) => resolve({ id: 'id' }))) }));

describe('PostReading', () => {
  test('Post reading with createReading error', async () => {
    const { error } = require('../../../NodeJsFiles/utils/Logger');
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const mongoDB = require('../../../NodeJsFiles/MongoDB');
    mongoDB.createReading.mockReturnValueOnce(new Promise((resolve, reject) => reject()));
    const mockJsonFn = jest.fn();
    const req = { body: { jwtMessage: 'jwtMessage', reading: { date: '03/16/1982' } } };
    const res = { json: mockJsonFn };

    await postReading(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(mongoDB.createReading).toHaveBeenLastCalledWith({ date: new Date('03/16/1982'), user_id: 'id' });
    expect(error).toHaveBeenCalledTimes(1);
    expect(mongoDB.findHexagramImagesForReading).not.toHaveBeenCalled();
    expect(mockJsonFn).not.toHaveBeenCalled();
  });

  test('Post reading without error', async () => {
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const mongoDB = require('../../../NodeJsFiles/MongoDB');
    mongoDB.createReading.mockReturnValueOnce(new Promise((resolve, reject) =>
      resolve({ a: 1, b: 2 })));
    const mockJsonFn = jest.fn();
    const req = { body: { jwtMessage: 'jwtMessage', reading: { date: '03/16/1982' } } };
    const res = { json: mockJsonFn };

    await postReading(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'jwtMessage', res });
    expect(mongoDB.createReading).toHaveBeenLastCalledWith({ date: new Date('03/16/1982'), user_id: 'id' });
    expect(mongoDB.findHexagramImagesForReading).toHaveBeenLastCalledWith({ a: 1, b: 2 });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'id' });
  });

  test('Post reading without user _id', async () => {
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    verifyJWT.mockReturnValue({ _id: null });
    const mockEndFn = jest.fn();
    const req = { body: { jwtMessage: 'jwtMessage', reading: {} } };
    const res = { end: mockEndFn };

    await postReading(req, res);

    expect(mockEndFn).toHaveBeenLastCalledWith('Invalid User.');
  });
});
