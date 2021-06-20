export default class Random {
  /** 取最小到最大區間亂數 ex. getRandom(1, 5, 10) 包含1, 5的亂數取10個 */
  static getRangeNumbers(min: number, max: number, count: number): number[] {
    const numbers: number[] = [];
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return numbers;
  }

  /** 隨機排序 使用 Fisher-Yates Shuffling 演算法 */
  static getShuffleNumbers(min: number = 0, max: number) {
    const arr = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }

    let i, j, temp;
    for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
}
