import * as fs from 'fs';
import * as path from 'path';
import { WarnItem } from './type';
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
    let item: WarnItem = { detail: [] };
    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      let result = element.match(WARN_START_REGEXP);
      if (result) {
        if (isWarn) {
          this.collectionList.push(item);
          item = { detail: [] };
        }
        isWarn = true;
        item.location = result[1];
        item.message = result[2];
        continue;
      }
      if (WARN_END_REGEXP.test(element)) {
        if (isWarn) {
          this.collectionList.push(item);
          item = { detail: [] };
        }
        isWarn = false;
        continue;
      }
      if (isWarn) {
        item.detail!.push(element);
      }
    }
  }
  private print() {
    for (let i = 0; i < this.collectionList.length; i++) {
      const element = this.collectionList[i];

      console.log(
        `⚠️  ⚠️  ⚠️  Warning [${i}/${this.collectionList.length}] ⚠️  ⚠️  ⚠️`
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
