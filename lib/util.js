var util = {
  /**
   * Gets the user's preferred language from the browser settings
   * @return {string}
   */
  getUserLanguage: function () {
    var lang = window.navigator.userLanguage || window.navigator.language;
    return lang.substring(0, 2);
  },
  languageNames: {
    de: "Deutsch",
    en: "English",
    es: "EspaÃ±ol",
    fr: "FranÃ§ais",
    pt: "PortuguÃªs",
    ru: "Ð ÑƒÑ�Ñ�ÐºÐ¸Ð¹",
    zh: "ä¸­æ–‡",
  },
  // *************** I N T E G E R - Related *************************************
  isIntegerOrIntegerString: function (x) {
    return Number.isInteger(parseInt(x));
  },
  /**
   * Verifies if a value represents a non-negative integer
   * @param {number} x
   * @return {boolean}
   */
  isNonNegativeInteger: function (x) {
    return Number.isInteger(x) && x >= 0;
  },
  /**
   * Verifies if a value represents a positive integer
   * @param {number} x
   * @return {boolean}
   */
  isPositiveInteger: function (x) {
    return Number.isInteger(x) && x > 0;
  },
  // *************** D A T E - Related ****************************************
  /**
   * Verifies if a string represents an ISO date string, which have the format YYYY-MM-DD
   * @param {string} ds
   * @return {string}
   */
  isNotIsoDateString: function (ds) {
    var dateArray = [],
      YYYY = 0,
      MM = 0,
      DD = 0;
    if (typeof ds !== "string") return "Date value must be a string!";
    dateArray = ds.split("-");
    if (dateArray.length < 3) return "Date string has less than 2 dashes!";
    YYYY = parseInt(dateArray[0]);
    MM = parseInt(dateArray[1]);
    DD = parseInt(dateArray[2]);
    if (!Number.isInteger(YYYY) || YYYY < 1000 || YYYY > 9999)
      return "YYYY out of range!";
    if (!Number.isInteger(MM) || MM < 1 || MM > 12) return "MM out of range!";
    if (!Number.isInteger(DD) || DD < 1 || DD > 31) return "MM out of range!";
    return "";
  },
  /**
   * Serialize a Date object as an ISO date string
   * @return  YYYY-MM-DD
   */
  createIsoDateString: function (d) {
    return d.toISOString().substring(0, 10);
  },
  /**
   * Return the next year value (e.g. if now is 2013 the function will return 2014)
   * @return the integer representing the next year value
   */
  nextYear: function () {
    var date = new Date();
    return date.getFullYear() + 1;
  },
  // *************** D O M - Related ****************************************
  /**
   * Create a DOM element
   *
   * @param {string} elemName
   * @param {string} id [optional]
   * @param {string} classValues [optional]
   * @param {string} txt [optional]
   *
   * @return {object}
   */
  createElement: function (elemName, id, classValues, txt) {
    var el = document.createElement(elemName);
    if (id) el.id = id;
    if (classValues) el.className = classValues;
    if (txt) el.textContent = txt;
    return el;
  },
  createDiv: function (id, classValues, txt) {
    return util.createElement("div", id, classValues, txt);
  },
  createSpan: function (id, classValues, txt) {
    return util.createElement("span", id, classValues, txt);
  },
  createPushButton: function (id, classValues, txt) {
    var pB = util.createElement("button", id, classValues, txt);
    pB.type = "button";
    return pB;
  },
  /**
   * Create a DOM option element
   *
   * @param {string} val
   * @param {string} txt
   * @param {string} classValues [optional]
   *
   * @return {object}
   */
  createOption: function (val, txt, classValues) {
    var el = document.createElement("option");
    el.value = val;
    el.text = txt;
    if (classValues) el.className = classValues;
    return el;
  },
  /**
   * Create a time element from a Date object
   *
   * @param {object} d
   * @return {object}
   */
  createTimeElem: function (d) {
    var tEl = document.createElement("time");
    tEl.textContent = d.toLocaleDateString();
    tEl.datetime = d.toISOString();
    return tEl;
  },
  /**
   * Create a list element from an map of objects
   *
   * @param {object} aa  An map of objects
   * @param {string} displayProp  The object property to be displayed in the list
   * @return {object}
   */
  createListFromAssocArray: function (aa, displayProp) {
    var listEl = document.createElement("ul");
    util.fillListFromAssocArray(listEl, aa, displayProp);
    return listEl;
  },
  /**
   * Fill a list element with items from an map of objects
   *
   * @param {object} listEl  A list element
   * @param {object} aa  An map of objects
   * @param {string} displayProp  The object property to be displayed in the list
   */
  fillListFromAssocArray: function (listEl, aa, displayProp) {
    var keys = [],
      listItemEl = null;
    // delete old contents
    listEl.innerHTML = "";
    // create list items from object property values
    keys = Object.keys(aa);
    for (var j = 0; j < keys.length; j++) {
      listItemEl = document.createElement("li");
      listItemEl.textContent = aa[keys[j]][displayProp];
      listEl.appendChild(listItemEl);
    }
  },
  /**
   * Fill a select element with option elements created from an
   * map of objects
   *
   * @param {object} selectEl  A select(ion list) element
   * @param {object|array} selectionRange  A map of objects or an array
   * @param {string} keyProp [optional]  The standard identifier property
   * @param {object} optPar [optional]  A record of optional parameter slots
   *                 including optPar.displayProp and optPar.selection
   */
  fillSelectWithOptions: function (selectEl, selectionRange, keyProp, optPar) {
    var i = 0,
      optionEl = null,
      options = [],
      key = "",
      obj = null,
      displayProp = "";
    // delete old contents
    selectEl.innerHTML = "";
    // create "no selection yet" entry
    if (!selectEl.multiple) {
      selectEl.add(util.createOption("", " --- "));
    }
    // create option elements from object property values
    options = Array.isArray(selectionRange)
      ? selectionRange
      : Object.keys(selectionRange);
    for (let i = 0; i < options.length; i++) {
      if (Array.isArray(selectionRange)) {
        optionEl = util.createOption(i, options[i]);
      } else {
        key = options[i];
        obj = selectionRange[key];
        if (!selectEl.multiple) obj.index = i + 1; // store selection list index
        if (optPar && optPar.displayProp) displayProp = optPar.displayProp;
        else displayProp = keyProp;
        optionEl = util.createOption(key, obj[displayProp]);
        // if invoked with a selection argument, flag the selected options
        if (
          selectEl.multiple &&
          optPar &&
          optPar.selection &&
          optPar.selection[keyProp]
        ) {
          // flag the option element with this value as selected
          optionEl.selected = true;
        }
      }
      selectEl.add(optionEl);
    }
  },
  //***************  M I S C  ****************************************
  /**
   * Retrieves the type of a value, either a data value of type "Number", "String" or "Boolean",
   * or an object of type "Function", "Array", "HTMLDocument", ..., or "Object"
   * @param {any} val
   */
  typeName: function (val) {
    // stringify val and extract the word following "object"
    var typeName = Object.prototype.toString
      .call(val)
      .match(/^\[object\s(.*)\]$/)[1];
    // special case: null is of type "Null"
    if (val === null) return "Null";
    // special case: instance of a user-defined class or ad-hoc object
    if (typeName === "Object") return val.constructor.name || "Object";
    // all other cases: "Number", "String", "Boolean", "Function", "Array", "HTMLDocument", ...
    return typeName;
  },
  /**
   * Creates a clone of a data record object or extracts the data record part of an object
   * @param {object} obj
   */
  cloneRecord: function (obj) {
    var record = null;
    for (var p in obj) {
      if (
        obj.hasOwnProperty(p) &&
        typeof obj[p] != "object" &&
        typeof obj[p] != "null" &&
        typeof obj[p] != "undefined"
      ) {
        record[p] = obj[p];
      }
    }
    return record;
  },
  /**
   * Creates a typed "data clone" of an object
   * Notice that Object.getPrototypeOf(obj) === obj.__proto__
   * === Book.prototype when obj has been created by new Book(...)
   *
   * @param {object} obj
   */
  cloneObject: function (obj) {
    var clone = Object.create(Object.getPrototypeOf(obj));
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (
          typeof obj[p] === "number" ||
          typeof obj[p] === "string" ||
          typeof obj[p] === "boolean" ||
          util.typeName(obj[p]) === "Function" ||
          (util.typeName(obj[p]) === "Date" && obj[p] != null)
        ) {
          clone[p] = obj[p];
        }
        // else clone[p] = cloneObject(obj[p]);
      }
    }
    return clone;
  },
  /**
   * Retrieve the direct supertype of a given class.
   * @author Gerd Wagner
   * @return {boolean}
   */
  getSuperType: function (Class) {
    return Class.prototype.__proto__.constructor;
  },
};
