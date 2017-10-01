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
    assert(interpreter.arraysAreEqual(interpreter.parseStatements(statement_db),parsed_statement_db))
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
    assert(interpreter.arraysAreEqual(interpreter.parseConditions(rule),parsed_rule));
  });
  it("Conditions are separated by the established separator",function(){
    assert(interpreter.insertConditionDivider(parsed_rule[1])==separated_conditions);
  });
  it("Rules get parsed correctly", function(){
    assert(interpreter.arraysAreEqual(interpreter.parseRules(rules),parsed_rules));
  })
});

describe("Database State Checker", function(){
  var interpreter = null;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });
  var broken_db = [
      "varon(juan).",
      "varon("
  ];
 let incomplete_statement = 1;
  var lastname_db = [
      "varon(juan).",
      "varon(pepe sanchez).",
      "varon(hector).",
  ];
  var conditionless_db = [
      "varon(juan).",
      "varon(pepe).",
      "hijo(X, Y) :- .",
      "hija(X, Y) :- ."
  ];
  var healthy_db = [
      "varon(juan).",
      "varon(pepe).",
      "varon(hector).",
      "varon(roberto).",
      "varon(alejandro).",
      "mujer(maria).",
      "mujer(cecilia).",
      "padre(juan, pepe).",
      "padre(juan, pepa).",
      "padre(hector, maria).",
      "padre(roberto, alejandro).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];

  it("Broken database is detected and Error is thrown",function(){
      expect(() => interpreter.checkDatabaseHealth(broken_db)).to.throw(Error);
  });
  it("Last name in database is detected and Error is thrown",function(){
      expect(() => interpreter.checkDatabaseHealth(lastname_db)).to.throw(Error);
  });
  it("Rule without conditions detected and Error is thrown",function(){
      expect(() => interpreter.checkDatabaseHealth(conditionless_db)).to.throw(Error);
  });
  it("Healthy database is run, no problems",function(){
      assert(interpreter.checkDatabaseHealth(healthy_db))
  });
});

describe("Query Format Functions", function(){
  var interpreter = null;



  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });
  var incomplete_query = "varon(pe"
  var giberish_query = "varon[asd]"
  it("Incomplete query is detected and an Error is thrown", function(){
    expect(() => interpreter.checkQueryHealth(incomplete_query)).to.throw(Error);
  });
  it("Giberish query is detected and an Error is thrown", function(){
    expect(() => interpreter.checkQueryHealth(giberish_query)).to.throw(Error);
  });
});

describe("Databas Parsing Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var parsed_statements = [
      ["varon", "juan"],
      ["padre", "roberto", "cecilia"]
  ];
  var parsed_rules = [
      ["hijo(X,Y)", "varon(X)|padre(Y,X)"],
      ["hija(X,Y)", "mujer(X)|padre(Y,X)"]
  ];
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setStatements(statement_db1);
      interpreter.setRules(statement_db1);
  });
  it("Statements parsed correctly", function(){
    assert(interpreter.arraysAreEqual(interpreter.statements,parsed_statements))
  });
  it("Rules parsed correctly", function(){
    assert(interpreter.arraysAreEqual(interpreter.rules,parsed_rules))
  });
})

describe("Database Setting Relation Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var relation_format_statements = [
      ["varon", ["juan"]],
      ["padre", ["roberto", "cecilia"]]
  ];
  let name = 0;
  let params = 1;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setStatements(statement_db1);
      interpreter.setRelations();
  });
  it("Relation with one param created correctly", function(){
    assert(interpreter.statements[0].name == relation_format_statements[0][name]
    && interpreter.arraysAreEqual(interpreter.statements[0].params,relation_format_statements[0][params]))
  });
  it("Relation with more than one param created correctly", function(){
    assert(interpreter.statements[1].name == relation_format_statements[1][name]
    && interpreter.arraysAreEqual(interpreter.statements[1].params,relation_format_statements[1][params]))
  });
})

describe("Query Processing Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var raw_query_1 = "varon(juan)";
  var raw_query_2 = "padre(roberto, cecilia)";
  var raw_rule_query = "hijo(roberto, cecilia)"
  var parsed_query_1_information = ["varon", ["juan"]]
  var parsed_query_2_information = ["padre", ["roberto", "cecilia"]]
  var parsed_query_1;
  var parsed_query_2;
  var parsed_rule_query;
  let name = 0;
  let params = 1;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setStatements(statement_db1);
      interpreter.setRelations();
      parsed_query_1 = interpreter.parseQuery(raw_query_1);
      parsed_query_2 = interpreter.parseQuery(raw_query_2);
      parsed_rule_query = interpreter.parseQuery(raw_rule_query);
  });
  it("Statement Query with one parameter is processed correctly", function(){
    assert(interpreter.parseQuery(raw_query_1).name = parsed_query_1_information[name]
    && interpreter.arraysAreEqual(interpreter.parseQuery(raw_query_1).params,parsed_query_1_information[params]))
  });
  it("Statement Query with more than one parameter is processed correctly", function(){
    assert(interpreter.parseQuery(raw_query_2).name = parsed_query_2_information[name]
    && interpreter.arraysAreEqual(interpreter.parseQuery(raw_query_2).params,parsed_query_2_information[params]))
  });
  it("Statement Query with one parameter is processed correctly as statement", function(){
    assert(interpreter.queryIsStatement(parsed_query_1))
  });
  it("Statement Query with more than one parameter is processed correctly as statement", function(){
    assert(interpreter.queryIsStatement(parsed_query_2))
  });
  it("Rule Query is correctly detected as rule", function(){
    assert(interpreter.queryIsStatement(parsed_rule_query)==false)
  });
})

describe("Database State Checker", function(){
  var interpreter = null;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });
  var broken_db = [
      "varon(juan).",
      "varon("
  ];
 let incomplete_statement = 1;
  var lastname_db = [
      "varon(juan).",
      "varon(pepe sanchez).",
      "varon(hector).",
  ];
  var conditionless_db = [
      "varon(juan).",
      "varon(pepe).",
      "hijo(X, Y) :- .",
      "hija(X, Y) :- ."
  ];
  var healthy_db = [
      "varon(juan).",
      "varon(pepe).",
      "varon(hector).",
      "varon(roberto).",
      "varon(alejandro).",
      "mujer(maria).",
      "mujer(cecilia).",
      "padre(juan, pepe).",
      "padre(juan, pepa).",
      "padre(hector, maria).",
      "padre(roberto, alejandro).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];

  it("Broken database is detected and Error is thrown",function(){
      expect(() => interpreter.checkDatabaseHealth(broken_db)).to.throw(Error);
  });
  it("Last name in database is detected and Error is thrown",function(){
      expect(() => interpreter.checkDatabaseHealth(lastname_db)).to.throw(Error);
  });
  it("Rule without conditions detected and Error is thrown",function(){
      expect(() => interpreter.checkDatabaseHealth(conditionless_db)).to.throw(Error);
  });
  it("Healthy database is run, no problems",function(){
      assert(interpreter.checkDatabaseHealth(healthy_db))
  });
});

describe("Query Format Functions", function(){
  var interpreter = null;



  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
  });
  var incomplete_query = "varon(pe"
  var giberish_query = "varon[asd]"
  it("Incomplete query is detected and an Error is thrown", function(){
    expect(() => interpreter.checkQueryHealth(incomplete_query)).to.throw(Error);
  });
  it("Giberish query is detected and an Error is thrown", function(){
    expect(() => interpreter.checkQueryHealth(giberish_query)).to.throw(Error);
  });
});

describe("Databas Parsing Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var parsed_statements = [
      ["varon", "juan"],
      ["padre", "roberto", "cecilia"]
  ];
  var parsed_rules = [
      ["hijo(X,Y)", "varon(X)|padre(Y,X)"],
      ["hija(X,Y)", "mujer(X)|padre(Y,X)"]
  ];
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setStatements(statement_db1);
      interpreter.setRules(statement_db1);
  });
  it("Statements parsed correctly", function(){
    assert(interpreter.arraysAreEqual(interpreter.statements,parsed_statements))
  });
  it("Rules parsed correctly", function(){
    assert(interpreter.arraysAreEqual(interpreter.rules,parsed_rules))
  });
})

describe("Database Setting Relation Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var relation_format_statements = [
      ["varon", ["juan"]],
      ["padre", ["roberto", "cecilia"]]
  ];
  let name = 0;
  let params = 1;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setStatements(statement_db1);
      interpreter.setRelations();
  });
  it("Relation with one param created correctly", function(){
    assert(interpreter.statements[0].name == relation_format_statements[0][name]
    && interpreter.arraysAreEqual(interpreter.statements[0].params,relation_format_statements[0][params]))
  });
  it("Relation with more than one param created correctly", function(){
    assert(interpreter.statements[1].name == relation_format_statements[1][name]
    && interpreter.arraysAreEqual(interpreter.statements[1].params,relation_format_statements[1][params]))
  });
})

describe("Statement Query Verification Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var raw_query_1 = "varon(juan)";
  var raw_query_2 = "padre(roberto, cecilia)";
  var raw_query_3 = "padre(roberto, maria)";
  var parsed_query_1;
  var parsed_query_2;
  var parsed_false_query;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setStatements(statement_db1);
      interpreter.setRelations();
      parsed_query_1 = interpreter.parseQuery(raw_query_1);
      parsed_query_2 = interpreter.parseQuery(raw_query_2);
      parsed_false_query = interpreter.parseQuery(raw_query_3);
  });
  it("Statement Query with one parameter is verificated correctly", function(){
    assert(interpreter.verificateStatement(parsed_query_1))
  });
  it("Statement Query with more than one parameter is verificated correctly", function(){
    assert(interpreter.verificateStatement(parsed_query_2))
  });
  it("False Statement Query is verificated correctly as false", function(){
    assert(interpreter.verificateStatement(parsed_false_query)==false)
  });

})

describe("Rule Relation Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var rule_1_information = ["hijo",["X","Y"],["varon(X)", "padre(Y,X)"]]
  var rule_2_information = ["hija",["X","Y"],["mujer(X)", "padre(Y,X)"]]
  let name = 0;
  let subject = 1;
  let conditions = 2;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setRules(statement_db1);
      interpreter.setRulesRelations();
  });
  it("Rule 1 relation es created correctly", function(){
    assert(interpreter.rules[0].name == rule_1_information[name]
      && interpreter.arraysAreEqual(interpreter.rules[0].params_format,rule_1_information[subject])
      && interpreter.arraysAreEqual(interpreter.rules[0].conditions,rule_1_information[conditions]))
  });
  it("Rule 2 relation es created correctly", function(){
    assert(interpreter.rules[1].name == rule_2_information[name]
      && interpreter.arraysAreEqual(interpreter.rules[1].params_format,rule_2_information[subject])
      && interpreter.arraysAreEqual(interpreter.rules[1].conditions,rule_2_information[conditions]))
  });
})

describe("Rule Relation Functions",function(){
  var interpreter = null;

  var statement_db1 = [
      "varon(juan).",
      "padre(roberto, cecilia).",
      "hijo(X, Y) :- varon(X), padre(Y, X).",
      "hija(X, Y) :- mujer(X), padre(Y, X)."
  ];
  var rule_1_information = ["hijo",["X","Y"],["varon(X)", "padre(Y,X)"]]
  var rule_2_information = ["hija",["X","Y"],["mujer(X)", "padre(Y,X)"]]
  var raw_query_2 = "hija(roberto, cecilia)"
  var raw_query_1 = "hijo(roberto, juan)"
  var rule_match_query_1;
  var rule_match_query_2;
  let name = 0;
  let subject = 1;
  let conditions = 2;
  beforeEach(function () {
      // runs before each test in this block
      interpreter = new Interpreter();
      interpreter.setRules(statement_db1);
      interpreter.setRulesRelations();
      rule_match_query_1 = interpreter.getMatchingRule(interpreter.parseQuery(raw_query_1));
      rule_match_query_2 = interpreter.getMatchingRule(interpreter.parseQuery(raw_query_2));

  });
  it("Rule 1 relation es created correctly", function(){
    assert(rule_match_query_1.name == rule_1_information[name]
      && interpreter.arraysAreEqual(rule_match_query_1.params_format,rule_1_information[subject])
      && interpreter.arraysAreEqual(rule_match_query_1.conditions,rule_1_information[conditions]))
  });
  it("Rule 2 relation es created correctly", function(){
    assert(rule_match_query_2.name == rule_2_information[name]
      && interpreter.arraysAreEqual(rule_match_query_2.params_format,rule_2_information[subject])
      && interpreter.arraysAreEqual(rule_match_query_2.conditions,rule_2_information[conditions]))
  });
})
