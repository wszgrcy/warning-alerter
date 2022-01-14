import { fstat } from 'fs';
import { WarningAlerter } from './index';
import * as fs from 'fs';
import path from 'path';
describe('index', () => {
  let logList: string[] = [];
  let originLog = console.log;
  beforeAll(() => {
    console.log = function (item: string) {
      logList.push(item);
      originLog.call(this, item);
    };
  });
  afterAll(() => {
    console.log = originLog;
  });
  it('WarningAlerter', () => {
    let instance = new WarningAlerter('./build.log');
    instance.run();
    let list = Object.values(instance.collectionObject);
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      for (const item of element.detail) {
        expect(item).not.toContain('warnings generated');
      }
      expect(element.location.path).not.toEqual('ld');
      expect(element.location.path).not.toEqual('third-party');
      expect(element.location.path).not.toEqual('/Applications');
    }
    for (let i = 0; i < logList.length; i++) {
      const element = logList[i];
      expect(/^📌 Location: \//.test(element)).toBeFalsy();
    }
    expect(list.length).toBe(50);
    let content = fs
      .readFileSync(path.resolve(process.cwd(), './warning.log'))
      .toString();
    let contentList = content.split('\n');
    for (let i = 0; i < contentList.length; i++) {
      const element = contentList[i];
      expect(element === logList[i]).toBeTrue();
    }
  });
});
