import Agenda from "./Agenda";
import Util from "./Util";

export default class Person {
  game;
  id;
  name;
  img;
  faction;
  location;

  isLeader;
  prestigeItems;
  influence;

  constructor(
    game,
    id,
    name,
    faction,
    location,
    isLeader,
    prestigeItems,
    influence
  ) {
    this.game = game;
    this.id = id;
    this.name = name;
    this.faction = faction;
    this.location = location;
    this.isLeader = isLeader;
    this.prestigeItems = prestigeItems;
    this.influence = influence;
  }

  // 턴 넘김시 처리해야할 것들
  passTurn() {
    console.log(this.name + "의 턴");

    this.addInfluenceByPrestige();
    this.prestigeItems.forEach((p) => p.minusAge(1));
    this.removeExpiredPresigeItem();

    this.agendaAiAction();

    console.log(this.name + "가 턴을 마칩니다.");
  }

  move(targetLocation) {
    this.location = targetLocation;
  }

  addPrestigeItem(prestigeItem) {
    this.prestigeItems.push(prestigeItem);
  }

  removePrestigeItem(prestigeItem) {
    const index = this.prestigeItems.findIndex((p) => p.id == prestigeItem.id);
    this.prestigeItems.splice(index, 1);
  }

  removeExpiredPresigeItem() {
    this.prestigeItems
      .filter((p) => p.isExpred)
      .forEach((p) => this.removePrestigeItem(p));
  }

  get prestige() {
    return this.prestigeItems.map((p) => p.score).reduce((a, b) => a + b, 0);
  }

  addInfluenceByPrestige() {
    this.influence += this.prestige;
    return this.influence;
  }

  useInfluence(amount) {
    if (this.influence < amount) {
      return null; // 정확히는 오류가 나야함
    }

    this.influence -= amount;
    return this.influence;
  }

  agendaAiAction() {
    const targetFaction = Util.randomInArray(this.game.factions, this.faction);
    const action = Util.randomInArray(["HOSTILITY", "FRIENDSHIP"]);
    const initiator = this;
    const newAgenda = new Agenda(targetFaction, action, initiator);
    console.log(this.name + "이 새로운 아젠다 설정", newAgenda);
  }
}
