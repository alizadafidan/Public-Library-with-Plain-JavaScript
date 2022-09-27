// ***********************************************
// *** Constructor with property definitions ****
// ***********************************************
class Author extends Person {
  // using a single record parameter with ES6 function parameter destructuring
  constructor({ personId, name, biography }) {
    super({ personId, name });
    // assign additional properties
    this.biography = biography;
  }
  get biography() {
    return this._biography;
  }
  set biography(b) {
    /*SIMPLIFIED CODE: no validation */
    this._biography = b;
  }
  /* Convert object to string */
  toString() {
    return (
      "Author{ persID: " +
      this.personId +
      ", name: " +
      this.name +
      ", biography:" +
      this.biography +
      "}"
    );
  }
}
// *****************************************************
// *** Class-level ("static") properties ***
// *****************************************************
Author.instances = {};

// *********************************************************
// *** Class-level ("static") storage management methods ***
// *********************************************************
/**
 *  Create a new author record
 */
Author.add = function (slots) {
  var author = null;
  try {
    author = new Author(slots);
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
    author = null;
  }
  if (author) {
    Author.instances[author.personId] = author;
    console.log("Saved: " + author.name);
  }
};
/**
 *  Update an existing author record
 */
Author.update = function ({ personId, name, biography }) {
  const author = Author.instances[personId],
    objectBeforeUpdate = util.cloneObject(author);
  var noConstraintViolated = true,
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
    Author.instances[personId] = objectBeforeUpdate;
  }
  if (noConstraintViolated) {
    if (updatedProperties.length > 0) {
      let ending = updatedProperties.length > 1 ? "ies" : "y";
      console.log(
        `Propert${ending} ${updatedProperties.toString()} modified for author ${name}`
      );
    } else {
      console.log("No property value changed for author " + name + " !");
    }
  }
};
/**
 *  Delete an existing author record
 */
Author.destroy = function (personId) {
  const author = Author.instances[personId];
  delete Author.instances[personId];
  console.log("Author " + author.name + " deleted.");
};
/**
 *  Save all author objects as records
 */
Author.saveAll = function () {
  const authors = {};
  for (let key of Object.keys(Author.instances)) {
    let author = Author.instances[key];
    authors[key] = author.toRecord();
  }
  try {
    localStorage["authors"] = JSON.stringify(authors);
    console.log(Object.keys(authors).length + " authors saved.");
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
  }
};
