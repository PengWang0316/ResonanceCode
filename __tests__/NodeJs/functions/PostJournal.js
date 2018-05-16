import postJournal from '../../../NodeJsFiles/routers/functions/PostJournal';

jest.mock('../../../NodeJsFiles/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../../NodeJsFiles/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../../NodeJsFiles/MongoDB', () => ({ createJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('createJournal without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { createJournal } = require('../../../NodeJsFiles/MongoDB');

    await postJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(createJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('createJournal with error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { createJournal } = require('../../../NodeJsFiles/MongoDB');
    const { error } = require('../../../NodeJsFiles/utils/Logger');
    createJournal.mockReturnValue(Promise.reject());

    await postJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(createJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
