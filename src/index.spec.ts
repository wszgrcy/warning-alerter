import { WarningAlerter } from './index';
describe('index', () => {
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
    }
  });
});
