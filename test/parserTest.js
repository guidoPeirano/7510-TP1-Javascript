var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Remove Stops", function(){
  var interpreter = null;

  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });


  it('Stop should be removed from string', function(){
    assert(interpreter.removeStopAtTheEnd("Sentence with stop at the end.") == "Sentence with stop at the end")
  });
  it('Remove Stop should fail', function(){
    expect(() => interpreter.removeStopAtTheEnd("No Stop")).to.throw(Error);
  });

});


describe("Statement Parser", function(){
  var interpreter = null;
  var statement_db = [
      "varon(juan).",
      "padre(roberto, cecilia)."
  ];

  var unhealthy_statement_db = [
      "varon(juan)",
      "padre(roberto, cecilia)"
  ];
  var parsed_statement_db = [
    ["varon", "juan"],
    ["padre","roberto","cecilia"]
  ]
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });


  it('Statement parser parses a health db',function(){
    assert(interpreter.parseStatements(statement_db),parsed_statement_db)
  });
  it('Statement parser should fail w/unhealthy_statement_db', function(){
    expect(() => interpreter.parseStatements(unhealthy_statement_db)).to.throw(Error);
  });

});


describe("Input Type Recognition", function(){
  var interpreter = null;

  var complete_db = [
      "varon(juan).",
      "padre(juan, pepe).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var statement_1 = 0;
  var statement_2 = 1;
  var rule = 2

  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });


  it('Statement with one parameter is understood correctly',function(){
    assert(interpreter.databaseLineIsStatement(complete_db[statement_1]));
  });
  it('Statement with two parameters is understood correctly',function(){
    assert(interpreter.databaseLineIsStatement(complete_db[statement_2]));
  });
  it('Rule is not a statement',function(){
    assert(interpreter.databaseLineIsStatement(complete_db[rule])== false);
  });
});

describe("Rule Format Functions", function(){
  var interpreter = null;



  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });
  var rules = [
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var parsed_rules = [
      ["hijo(X,Y)", "varon(X)|padre(Y,X)"],
      ["hija(X,Y)", "mujer(X)|padre(Y,X)"]
  ];
  var rule =
      "hija(X,Y):-mujer(X),padre(Y,X)";
  var parsed_rule = [ 'hija(X,Y)', 'mujer(X),padre(Y,X)' ];
  var separated_conditions = 'mujer(X)|padre(Y,X)'

  it("Sentence's spaces are deleted",function(){
    assert(interpreter.removeSpaces("sentence with spaces")=="sentencewithspaces");
  });
  it("Rule is splited in rule and conditions",function(){
    assert(interpreter.parseConditions(rule).equals(parsed_rule));
  });
  it("Conditions are separated by the established separator",function(){
    assert(interpreter.insertConditionDivider(parsed_rule[1])==separated_conditions);
  });
  it("Rules get parsed correctly", function(){
    assert(interpreter.parseRules(rules).equals(parsed_rules));
  })
});
