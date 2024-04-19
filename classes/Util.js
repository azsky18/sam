export default class Util {
  static random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomInArray(array, exclude) {
    if (!array) {
      return null;
    }

    let selectedIndex = -1;
    while (true) {
      selectedIndex = Util.random(0, array.length - 1);

      if (!exclude || (exclude && selectedIndex != exclude)) {
        break;
      }
    }

    return array[selectedIndex];
  }
}
