import * as fs from 'fs';
import * as path from 'path';
import { WarnItem } from './type';
const WARN_START_REGEXP = /^(.*):(?:\s*)warning:(.*)$/;
// const WARN_END_REGEXP=/(.*):warning:(.*)/
export class WarningAlerter {
  private absoluteFilePath: string;
  private content!: string;
  private collectionList: WarnItem[] = [];
  constructor(filePath: string) {
    this.absoluteFilePath = path.resolve(process.cwd(), filePath);
  }
  run() {
    this.readFile();
    this.collectionWarn();
    this.print();
  }
  readFile() {
    let buffer = fs.readFileSync(this.absoluteFilePath);
    this.content = buffer.toString();
  }
  collectionWarn() {
    let list = this.content.split('\n');
    let isWarn = false;
    let item: WarnItem = { detail: '' };
    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      let result = element.match(WARN_START_REGEXP);
      if (result) {
        if (isWarn) {
          this.collectionList.push(item);
          item = { detail: '' };
        }
        isWarn = true;
        item.location = result[1];
        item.message = result[2];
        continue;
      }
      if (element === '1 warning generated.') {
        if (isWarn) {
          this.collectionList.push(item);
          item = { detail: '' };
        }
        isWarn = false;
        continue;
      }
      if (isWarn) {
        item.detail += element + '\n';
      }
    }
  }
  print() {
    for (let i = 0; i < this.collectionList.length; i++) {
      const element = this.collectionList[i];

      console.log(
        `⚠️  ⚠️  ⚠️  Warning [${i}/${this.collectionList.length}] ⚠️  ⚠️  ⚠️`
      );
      console.log(`\n`);
      console.log(`📌 Location: ${element.location}`);
      console.log(`🔎 Message: ${element.message}`);
      console.log(`📝 Detail:`);
      console.log(`${element.detail}`);
    }
  }
}

if (require.main === module) {
  new WarningAlerter(process.argv[1]).run();
}
