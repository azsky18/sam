export default class Agenda {
  target;
  action;
  initiator; // 최초 발의자

  constructor(target, action, initiator) {
    this.target = target;
    this.action = action;
    this.initiator = initiator;
  }

  equlas(other) {
    return true;
  }
}
