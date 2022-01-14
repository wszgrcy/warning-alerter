import { WarningAlerter } from './index';
describe('index', () => {
  it('WarningAlerter', () => {
    new WarningAlerter('./build.log').run();
  });
});
