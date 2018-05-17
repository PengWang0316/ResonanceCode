import putHexagram from '../../../NodeJsFiles/routers/functions/PutHexagram';

// jest.mock('dotenv', () => ({ config: jest.fn() }));
jest.mock('../../../NodeJsFiles/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../../NodeJsFiles/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../../NodeJsFiles/MongoDB', () => ({ updateHexagram: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('updateHexagram without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { updateHexagram } = require('../../../NodeJsFiles/MongoDB');

    await putHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateHexagram).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('updateHexagram with error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { updateHexagram } = require('../../../NodeJsFiles/MongoDB');
    const { error } = require('../../../NodeJsFiles/utils/Logger');
    updateHexagram.mockReturnValue(Promise.reject());

    await putHexagram(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateHexagram).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
