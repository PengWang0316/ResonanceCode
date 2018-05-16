import putJournal from '../../../NodeJsFiles/routers/functions/PutJournal';

jest.mock('../../../NodeJsFiles/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../../NodeJsFiles/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id' }));
jest.mock('../../../NodeJsFiles/MongoDB', () => ({ updateJournal: jest.fn().mockReturnValue(Promise.resolve()) }));

describe('PostJournal', () => {
  test('updateJournal without error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { updateJournal } = require('../../../NodeJsFiles/MongoDB');

    await putJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).toHaveBeenLastCalledWith(200);
    expect(mockEndFn).toHaveBeenCalledTimes(1);
  });

  test('updateJournal with error', async () => {
    const mockEndFn = jest.fn();
    const res = { sendStatus: jest.fn().mockReturnValue({ end: mockEndFn }) };
    const req = { body: { jwtMessage: 'message', journal: { id: 'journalId' } } };
    const verifyJWT = require('../../../NodeJsFiles/utils/VerifyJWT');
    const { updateJournal } = require('../../../NodeJsFiles/MongoDB');
    const { error } = require('../../../NodeJsFiles/utils/Logger');
    updateJournal.mockReturnValue(Promise.reject());

    await putJournal(req, res);

    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(updateJournal).toHaveBeenLastCalledWith({ user_id: 'id', id: 'journalId' });
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(mockEndFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
