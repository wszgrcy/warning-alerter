export class WarnItem {
  location!: { path: string; line: string; column: string };
  message!: string;
  detail: string[] = [];
}
