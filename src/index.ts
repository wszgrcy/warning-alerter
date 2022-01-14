import * as fs from 'fs';
import * as path from 'path';
import { WarnItem } from './warn-item';
const WARN_START_REGEXP = /^(.*:\d+:\d+):\swarning:(.*)$/;
const WARN_END_REGEXP = /\d+ warnings? generated\./;
export class WarningAlerter {
  private absoluteFilePath: string;
  private content!: string;
  /**@internal  */
  collectionList: WarnItem[] = [];
  constructor(filePath: string) {
    this.absoluteFilePath = path.resolve(process.cwd(), filePath);
  }
  run() {
    this.readFile();
    this.collectionWarn();
    this.print();
  }
  private readFile() {
    let buffer = fs.readFileSync(this.absoluteFilePath);
    this.content = buffer.toString();
  }
  private collectionWarn() {
    let list = this.content.split('\n');
    let isWarn = false;
    let warnItem = new WarnItem();
    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      let result = element.match(WARN_START_REGEXP);
      if (result) {
        if (isWarn) {
          warnItem = new WarnItem();
        }
        isWarn = true;
        warnItem.location = result[1];
        warnItem.message = result[2];
        this.collectionList.push(warnItem);
        continue;
      }
      if (WARN_END_REGEXP.test(element)) {
        if (isWarn) {
          warnItem = new WarnItem();
        }
        isWarn = false;
        continue;
      }
      if (isWarn) {
        warnItem.detail.push(element);
      }
    }
  }
  private print() {
    for (let i = 0; i < this.collectionList.length; i++) {
      const element = this.collectionList[i];

      console.log(
        `⚠️  ⚠️  ⚠️  Warning [${i + 1}/${
          this.collectionList.length
        }] ⚠️  ⚠️  ⚠️`
      );
      console.log(`\n`);
      console.log(`📌 Location: ${element.location}`);
      console.log(`🔎 Message: ${element.message}`);
      console.log(`📝 Detail:`);
      for (let i = 0; i < element.detail!.length; i++) {
        const detail = element.detail![i];
        console.log(`${detail}`);
      }
    }
  }
}

if (require.main === module) {
  new WarningAlerter(process.argv[1]).run();
}
