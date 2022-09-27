// ***********************************************
// *** Constructor with property definitions ****
// ***********************************************
class Person {
  // using a single record parameter with ES6 function parameter destructuring
  constructor({ personId, name }) {
    // assign properties by invoking implicit setters
    this.personId = personId; // number (integer)
    this.name = name; // string
  }
  get personId() {
    return this._personId;
  }
  static checkPersonId(id) {
    if (id === undefined) {
      return new NoConstraintViolation(); // may be optional as an IdRef
    } else {
      // convert to integer
      id = parseInt(id);
      if (isNaN(id) || !Number.isInteger(id) || id < 1) {
        return new RangeConstraintViolation(
          "The person ID must be a positive integer!"
        );
      } else {
        return new NoConstraintViolation();
      }
    }
  }
  /*
     Checks ID uniqueness constraint against the direct type of a Person object
     */
  static checkPersonIdAsId(id, DirectType) {
    var validationResult;
    if (!DirectType) DirectType = Person; // default
    id = parseInt(id);
    if (isNaN(id)) {
      return new MandatoryValueConstraintViolation(
        "A positive integer value for the person ID is required!"
      );
    }
    validationResult = Person.checkPersonId(id);
    if (validationResult instanceof NoConstraintViolation) {
      if (DirectType.instances[id]) {
        validationResult = new UniquenessConstraintViolation(
          "There is already a " +
            DirectType.name +
            " record with this person ID!"
        );
      } else {
        validationResult = new NoConstraintViolation();
      }
    }
    return validationResult;
  }
  static checkPersonIdAsIdRef(id) {
    var validationResult = Person.checkPersonId(id);
    if (validationResult instanceof NoConstraintViolation && id !== undefined) {
      if (!Person.instances[id]) {
        validationResult = new ReferentialIntegrityConstraintViolation(
          "There is no person record with this person ID!"
        );
      }
    }
    return validationResult;
  }
  set personId(id) {
    // this.constructor may be Person or any category of it
    var validationResult = Person.checkPersonIdAsId(id, this.constructor);
    if (validationResult instanceof NoConstraintViolation) {
      this._personId = parseInt(id);
    } else {
      throw validationResult;
    }
  }
  get name() {
    return this._name;
  }
  set name(n) {
    /*SIMPLIFIED CODE: no validation with Person.checkName */
    this._name = n;
  }
  /* Convert object to string */
  toString() {
    return "Person{ persID: " + this.personId + ", name: " + this.name + "}";
  }
  /* Convert object to row/record */
  toRecord() {
    var rec = {};
    for (let p of Object.keys(this)) {
      // remove underscore prefix
      if (p.charAt(0) === "_") rec[p.substr(1)] = this[p];
    }
    return rec;
  }
}
// ***********************************************
// *** Class-level ("static") properties *********
// ***********************************************
Person.instances = {};

// *********************************************************
// *** Class-level ("static") storage management methods ***
// *********************************************************
/**
 *  Create a new Person row
 */
Person.add = function (slots) {
  var person = null;
  try {
    person = new Person(slots);
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    person = null;
  }
  if (person) {
    Person.instances[person.personId] = person;
    console.log("Saved: " + person.name);
  }
};
/**
 *  Update an existing author record
 */
Person.update = function ({ personId, name, biography }) {
  const author = Person.instances[personId],
    objectBeforeUpdate = util.cloneObject(author);
  var noConstraintViolated = true,
    ending = "",
    updatedProperties = [];
  try {
    if (name && author.name !== name) {
      author.name = name;
      updatedProperties.push("name");
    }
    if (biography && author.biography !== biography) {
      author.biography = biography;
      updatedProperties.push("biography");
    }
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    noConstraintViolated = false;
    // restore object to its state before updating
    Person.instances[personId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log(
        "Propert" +
          ending +
          " " +
          updatedProperties.toString() +
          " modified for author " +
          name
      );
    } else {
      console.log("No property value changed for author " + name + " !");
    }
  }
};
/**
 *  Delete an existing author record
 */
Person.destroy = function (personId) {
  const author = Person.instances[personId];
  delete Person.instances[personId];
  console.log("Person " + author.name + " deleted.");
};
/**
 *  Save all author objects as records
 */
Person.saveAll = function () {
  const authors = {};
  for (let key of Object.keys(Person.instances)) {
    let author = Person.instances[key];
    authors[key] = author.toRecord();
  }
  try {
    localStorage["authors"] = JSON.stringify(authors);
    console.log(Object.keys(authors).length + " authors saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
/**
 * Load all Author+Employee+Person records, convert them to objects
 * and build all class extensions of the class hierarchy in the
 * classes' instances collection.
 * @method
 * @static
 */
Person.retrieveAll = function () {
  var people = {},
    employees = {},
    authors = {};
  if (!localStorage["authors"]) localStorage["authors"] = "{}";
  if (!localStorage["employees"]) localStorage["employees"] = "{}";
  if (!localStorage["people"]) localStorage["people"] = "{}";
  try {
    people = JSON.parse(localStorage["people"]);
    employees = JSON.parse(localStorage["employees"]);
    authors = JSON.parse(localStorage["authors"]);
  } catch (e) {
    console.log("Error when reading from Local Storage\n" + e);
  }
  for (let key of Object.keys(authors)) {
    try {
      // convert record to (typed) object
      Author.instances[key] = new Author(authors[key]);
      // create superclass extension
      Person.instances[key] = Author.instances[key];
    } catch (e) {
      console.log(
        `${e.constructor.name} while deserializing` +
          `author ${key}: ${e.message}`
      );
    }
  }
  console.log(Object.keys(Author.instances).length + " Author records loaded.");
  for (let key of Object.keys(employees)) {
    try {
      // convert record to (typed) object
      Employee.instances[key] = new Employee(employees[key]);
      // create superclass extension
      Person.instances[key] = Employee.instances[key];
    } catch (e) {
      console.log(
        `${e.constructor.name} while deserializing` +
          `author ${key}: ${e.message}`
      );
    }
  }
  console.log(
    Object.keys(Employee.instances).length + " Employee records loaded."
  );
  for (let key of Object.keys(people)) {
    try {
      // convert record to (typed) object
      Person.instances[key] = new Person(people[key]);
    } catch (e) {
      console.log(
        `${e.constructor.name} while deserializing` +
          `author ${key}: ${e.message}`
      );
    }
  }
  console.log(Object.keys(Person.instances).length + " Person records loaded.");
};
/**
 *  Save all person objects in an entity table (a map of entity records)
 */
Person.saveAll = function () {
  const people = {};
  for (let key of Object.keys(Person.instances)) {
    let pers = Person.instances[key];
    // save only direct instances
    if (pers.constructor === Person) people[key] = pers.toRecord();
  }
  try {
    localStorage["people"] = JSON.stringify(people);
    console.log(Object.keys(people).length + " people saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
