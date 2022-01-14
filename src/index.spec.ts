import { WarningAlerter } from './index';
describe('index', () => {
  it('WarningAlerter', () => {
    let instance = new WarningAlerter('./build.log');
    instance.run();
    for (let i = 0; i < instance.collectionList.length; i++) {
      const element = instance.collectionList[i];
      for (const item of element.detail) {
        expect(item).not.toContain('warnings generated');
      }
      expect(element.location).not.toEqual('ld');
    }
  });
});
