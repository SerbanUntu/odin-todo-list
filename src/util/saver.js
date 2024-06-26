import { App } from '..';

export class Saver {
  static saveData(field, data) {
    if(App.IGNORE_SAVE_FLAG) return;
    localStorage.setItem(field, JSON.stringify(data));
  }

  static getData(field, backup) {
    let data = JSON.parse(localStorage.getItem(field));
    if(data) return data;
    return backup;
  }
}