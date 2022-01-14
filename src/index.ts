import * as fs from 'fs';
import * as path from 'path';
import { WarnItem } from './warn-item';
const WARN_START_REGEXP = /^((.*):(\d+):(\d+)):\swarning:\s(.*)$/;
const WARN_END_REGEXP = /\d+ warnings? generated\.|In file included/;
// 这里处理的不够完美,但是我确实没有看出来,构建生产的路径是一哪个为相对路径的,只能通过给予的日志推测出为`wukong-editor`下的某个文件夹
const ROOT_DIR = `/Users/pw/workspace/wukong/wukong-editor/out`;
export class WarningAlerter {
  private absoluteFilePath: string;
  private content!: string;
  /**@internal  */
  collectionObject: Record<string, WarnItem> = {};
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
        if (
          result[1].includes('third-party') ||
          result[1].startsWith('/Applications')
        ) {
          continue;
        }
        isWarn = true;
        warnItem.location = {
          path: result[2],
          line: result[3],
          column: result[4],
        };
        warnItem.message = result[5];
        if (!this.collectionObject[result[1]]) {
          this.collectionObject[result[1]] = warnItem;
        }
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
    let list = Object.values(this.collectionObject);
    for (let i = 0; i < list.length; i++) {
      const element = list[i];

      console.log(`⚠️  ⚠️  ⚠️  Warning [${i + 1}/${list.length}] ⚠️  ⚠️  ⚠️`);
      console.log(``);
      console.log(
        `📌 Location: ${this.pathFormat(element.location.path)}:${
          element.location.line
        }:${element.location.column}`
      );
      console.log(`🔎 Message: ${element.message}`);
      console.log(`📝 Detail:`);
      console.log(``);
      for (let i = 0; i < element.detail.length; i++) {
        const detail = element.detail[i];
        console.log(`${detail}`);
      }
      console.log(``);
    }
  }
  private pathFormat(filePath: string) {
    filePath = filePath.replace(/\/[^\/]+\/\.\./, '');
    return path.posix.relative(ROOT_DIR, filePath);
  }
}

if (require.main === module) {
  if (typeof process.argv[2] !== 'string') {
    throw new Error('请传入一个路径');
  }
  new WarningAlerter(process.argv[2]).run();
}
