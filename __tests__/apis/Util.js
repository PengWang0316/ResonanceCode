import sinon from 'sinon';

import * as Util from '../../app/apis/Util';

describe('Test Util with fake timer', () => {
  let clock = null;
  beforeAll(() => {
    clock = sinon.useFakeTimers(new Date(2017, 9, 6).getTime()); // Setting up a fake timer.
  });

  afterAll(() => clock.restore());

  test('getCurrentDateString', () => expect(Util.getCurrentDateString()).toBe('10/06/2017'));

  test('getDateString', () => {
    expect(Util.getDateString(new Date(2016, 0, 1))).toBe('01/01/2016');
    expect(Util.getDateString(new Date(2016, 0, 10))).toBe('01/10/2016');
    expect(Util.getDateString(new Date(2016, 10, 10))).toBe('11/10/2016');
  });

  test('matchDateFormat match', () => expect(Util.matchDateFormat('01/02/2017')).toBeTruthy());

  test('matchDateFormat not match', () => {
    expect(Util.matchDateFormat('0/02/2017')).toBeFalsy();
    expect(Util.matchDateFormat('01/0/2017')).toBeFalsy();
    expect(Util.matchDateFormat('01/02/201')).toBeFalsy();
    expect(Util.matchDateFormat('01/02/20174')).toBeFalsy();
    expect(Util.matchDateFormat('01/022017')).toBeFalsy();
    expect(Util.matchDateFormat('0102/2017')).toBeFalsy();
    expect(Util.matchDateFormat('01/aa/2017')).toBeFalsy();
    expect(Util.matchDateFormat('aa')).toBeFalsy();
  });

  test('getImageArray', () => {
    expect(Util.getImageArray('8,8,6,8,9,8')).toBe('6,8-6,8-6,8-6,8-7,9-6,8');
    expect(Util.getImageArray('8,8,7,8,8,8')).toBe('6,8-6,8-7,9-6,8-6,8-6,8');
    expect(Util.getImageArray('6,7,8,8,7,8')).toBe('6,8-7,9-6,8-6,8-7,9-6,8');
    expect(Util.getImageArray('7,7,8,8,7,8')).toBe('7,9-7,9-6,8-6,8-7,9-6,8');
    expect(Util.getImageArray('9,8,7,8,6,7')).toBe('7,9-6,8-7,9-6,8-6,8-7,9');
    expect(Util.getImageArray('8,8,7,8,7,7')).toBe('6,8-6,8-7,9-6,8-7,9-7,9');
    expect(Util.getImageArray('8,8,8,9,8,6')).toBe('6,8-6,8-6,8-7,9-6,8-6,8');
    expect(Util.getImageArray('6,7,8,8,8,9')).toBe('6,8-7,9-6,8-6,8-6,8-7,9');
  });

  test('getHexagramImageClassNamesArray', () => {
    const classSide = 'img-line-side';
    const classMiddle = 'img-line-middle';
    const classMiddleB = 'img-line-middle-blank';
    const classRedSide = 'img-line-side-red';
    const classRedMiddle = 'img-line-middle-red';
    expect(Util.getHexagramImageClassNamesArray('6,6,6,6,6,6', true)).toEqual([
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB }
    ]);
    expect(Util.getHexagramImageClassNamesArray('6,6,6,6,6,6', false)).toEqual([
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classRedMiddle }
    ]);
    expect(Util.getHexagramImageClassNamesArray('6,7,8,9,6,6', true)).toEqual([
      { side: classRedSide, middle: classMiddleB },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddleB },
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB }
    ]);
    expect(Util.getHexagramImageClassNamesArray('6,7,8,9,6,6', false)).toEqual([
      { side: classRedSide, middle: classRedMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddleB },
      { side: classRedSide, middle: classMiddleB },
      { side: classRedSide, middle: classRedMiddle },
      { side: classRedSide, middle: classRedMiddle }
    ]);
    // const throwTestFunction = () => Util.getHexagramImageClassNamesArray('6,7,8,9,6,0', true);
    // expect(throwTestFunction).toThrowError('Wrong imgString');
    expect(() => Util.getHexagramImageClassNamesArray('6,7,8,9,6,0', true)).toThrowError('Wrong imgString');
  });

  test('getHexagramBlackImageClassNamesArray', () => {
    const classSide = 'img-line-side';
    const classMiddle = 'img-line-middle';
    const classMiddleB = 'img-line-middle-blank';
    expect(Util.getHexagramBlackImageClassNamesArray('7,9-7,9-7,9-7,9-7,9-7,9', true)).toEqual([
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle }
    ]);
    expect(Util.getHexagramBlackImageClassNamesArray('7,9-7,9-7,9-7,9-7,9-7,9', false)).toEqual([
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle }
    ]);
    expect(Util.getHexagramBlackImageClassNamesArray('7,9-6,8-9,7-8,6-7,9-7,9', true)).toEqual([
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddleB },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddleB },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle }
    ]);
    expect(Util.getHexagramBlackImageClassNamesArray('7,9-6,8-9,7-8,6-7,9-7,9', false)).toEqual([
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddleB },
      { side: classSide, middle: classMiddleB },
      { side: classSide, middle: classMiddle },
      { side: classSide, middle: classMiddle }
    ]);
    expect(() => Util.getHexagramBlackImageClassNamesArray('10,9-6,8-9,7-8,6-7,9-7,9', true)).toThrowError('Wrong hexagramString');
    // const throwTestFunction = () => Util.getHexagramBlackImageClassNamesArray('7,9-6,8-9,7-8,6-7,9-7,9', true);
    // expect(throwTestFunction).toThrowError('Wrong hexagramString');
  });
});
