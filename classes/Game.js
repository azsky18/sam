import Faction from "./Faction.js";
import City from "./City.js";
import Person from "./Person.js";
import Corps from "./Corps.js";
import PrestigeItem from "./PrestigeItem.js";

export default class Game {
  factions;
  cities;
  persons;
  corps;
  playerFaction;
  state;
  #storeRepo;
  turn;

  constructor() {
    this.factions = [
      new Faction(this, "f0", "#42f54e"), // 유비군
      new Faction(this, "f1", "#4266f5"), // 조조군
      new Faction(this, "f2", "#f55142"), // 손권군
    ];

    this.cities = [
      new City(this, "c0", "성도", 100, 400, this.factions[0]),
      new City(this, "c1", "낙양", 400, 150, this.factions[1]),
      new City(this, "c2", "건업", 600, 300, this.factions[2]),
      new City(this, "c3", "한중", 110, 200, this.factions[0]),
      new City(this, "c4", "장안", 200, 100, this.factions[1]),
      new City(this, "c5", "양양", 300, 300, this.factions[2]),
      new City(this, "c6", "서주", 600, 200, this.factions[1]),
    ];

    this.persons = [
      new Person(
        this,
        "p0",
        "유비",
        this.factions[0],
        this.cities[0],
        true,
        [
          new PrestigeItem(this, "p0", "기본", 100, Infinity),
          new PrestigeItem(this, "p1", "군주", 100, Infinity),
        ],
        1000
      ),
      new Person(
        this,
        "p1",
        "관우",
        this.factions[0],
        this.cities[0],
        false,
        [new PrestigeItem(this, "p0", "기본", 100, Infinity)],
        500
      ),
      new Person(
        this,
        "p2",
        "장비",
        this.factions[0],
        this.cities[0],
        false,
        [new PrestigeItem(this, "p0", "기본", 100, Infinity)],
        400
      ),
      new Person(
        this,
        "p3",
        "조조",
        this.factions[1],
        this.cities[1],
        true,
        [new PrestigeItem(this, "p0", "기본", 100, Infinity)],
        1000
      ),
      new Person(
        this,
        "p4",
        "손권",
        this.factions[2],
        this.cities[2],
        true,
        [new PrestigeItem(this, "p0", "기본", 100, Infinity)],
        1000
      ),
      new Person(
        this,
        "p5",
        "사마의",
        this.factions[1],
        this.cities[4],
        false,
        [new PrestigeItem(this, "p0", "기본", 100, Infinity)],
        500
      ),
      new Person(
        this,
        "p6",
        "육손",
        this.factions[2],
        this.cities[5],
        false,
        [new PrestigeItem(this, "p0", "기본", 100, Infinity)],
        500
      ),
    ];

    this.corps = [
      new Corps(
        this,
        "c0",
        "백이병",
        this.factions[0],
        this.persons[1],
        90,
        10000
      ),
      new Corps(
        this,
        "c1",
        "촉1군단",
        this.factions[0],
        this.persons[2],
        70,
        10000
      ),
      new Corps(
        this,
        "c2",
        "위1군단",
        this.factions[1],
        this.persons[5],
        70,
        10000
      ),
    ];

    this.playerFaction = this.factions[0];
    this.state = "NORMAL";
    this.turn = 1;
  }

  passTurn() {
    this.persons.forEach((p) => p.passTurn());

    this.turn += 1;
  }

  // move step1
  moveSelectPerson(person) {
    this.state = "CITY_SELECT";
    this.store("TARGET_PERSON", person);
  }

  // move step2
  moveSelectCity(city) {
    this.store("TARGET_CITY", city);
  }

  // move step3
  move() {
    const person = this.store("TARGET_PERSON");
    const city = this.store("TARGET_CITY");

    person.location = city;

    this.store("TARGET_PERSON", null);
    this.store("TARGET_CITY", null);

    this.state = "NORMAL";

    return person;
  }

  store(key, value) {
    if (!value) {
      // get
      if (!this.#storeRepo) {
        return null;
      } else {
        return this.#storeRepo[key];
      }
    } else {
      // set
      if (!this.#storeRepo) {
        this.#storeRepo = {};
      }

      this.#storeRepo[key] = value;
    }
  }
}
