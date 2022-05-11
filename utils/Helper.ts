export class Helper {
  static removeDuplicate<T>(array: T[], key: string): T[] {
    return array.reduce((arr: any[], item: any) => {
      const removed = arr.filter((i) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  }
}
