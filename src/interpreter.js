var Interpreter = function () {
    var statements;
    var rules;
    function Relation(name,params){
      this.name = name;
      this.params = params;
    }
    function Rule(name, params_format, conditions){
      this.name = name;
      this.params_format = params_format;
      this.conditions = conditions
    }
    this.parseDB = function (database) {
      this.checkDatabaseHealth(database);
      this.setStatements(database);
      this.setRelations();
      this.setRules(database);
      this.setRulesRelations()
    }

    this.setRulesRelations = function(){
      let i;
      let name = 0;
      for(i = 0; i < this.rules.length; i++){
        let rule_header = this.rules[i][0].split(/[(,)]/)
        this.rules[i] = new Rule(rule_header[name],this.filterEmptyStrings(rule_header.splice(1)),this.rules[i][1].split("|"))
      }
    }

    this.checkQuery = function(query){
      parsed_query = this.parseQuery(query);
      if(this.queryIsStatement(parsed_query)){
        return this.verificateStatement(parsed_query);
      }else {
        return this.verificateRule(parsed_query);
      }
    }

    this.verificateRule = function(query){
      var rule = this.getMatchingRule(query)
      let i;
      let j;
      for(i = 0; i<rule.conditions.length; i++){
        let condition_checked = rule.conditions[i]
        for(j = 0; j<rule.params_format.length; j++){
          let subject = rule.params_format[j];
          condition_checked = condition_checked.replace(subject,query.params[j])
        }
        if(!this.verificateStatement(this.parseQuery(condition_checked))){
            return false;
        }
      }
      return true;
    }

    this.getMatchingRule = function(query){
      let i;
      for(i = 0; i<this.rules.length; i++){
        if(this.rules[i].name == query.name
        && this.rules[i].params_format.length == query.params.length){
          return this.rules[i]
        }
      }
      throw new Error('No matching Rule')
    }
    this.verificateStatement = function(query){
      let i;
      for(i = 0; i < this.statements.length; i++){
        if(this.statements[i].name == query.name
        && this.arraysAreEqual(this.statements[i].params,query.params)){
        return true;
        }
      }
      return false;
    }
    this.parseQuery = function(query){
      let aux = this.filterEmptyStrings(this.removeSpaces(query).split(/[(,)]/))
      return new Relation(aux[0],aux.splice(1))
    }

    this.queryIsStatement = function(query){
      let i;
      for(i = 0; i<this.statements.length; i++){
        if(this.statements[i].params.length == query.params.length
        && this.statements[i].name == query.name){
          return true;
        }
      }
      return false;
    }

    this.setRelations = function(){
      let i;
      let relation_name = 0;
      let aux = [];
      for(i = 0; i<this.statements.length; i++){
        aux.push(new Relation(this.statements[i][relation_name],this.statements[i].splice(1)));
      }
      this.statements = aux;
    }


    this.setStatements = function(database){
      let i;
      let aux = [];
      for(i=0; i<database.length; i++){
        if(this.databaseLineIsStatement(database[i])){
          aux.push(database[i]);
        }
      }
      this.statements = this.parseStatements(aux);
    }
    this.setRules = function(database){
      let i;
      let aux =[];
      for(i=0; i<database.length; i++){
        if(!this.databaseLineIsStatement(database[i])){
          aux.push(database[i]);
        }
      }
      this.rules = this.parseRules(aux);

    }

    this.filterEmptyStrings = function(array){
      let i;
      let aux =[];
      for(i = 0;i<array.length;i++){
        if(array[i]!='')
          aux.push(array[i]);
      }
      return aux;
    }



    this.splitLine = function(line){
      return line.split(/[(,)]/);
    }
    this.checkDatabaseHealth = function(database){
      let i;
      for(i = 0; i<database.length;i++){
        if(this.databaseLineIsStatement(database[i])){
          this.checkStatementHealth(database[i]);
        }else {
          this.checkRuleHealth(database[i]);
        }
      }
      return true;
    }
    this.checkStatementHealth = function(line){
      let statement_regex = /\w+\(\w+(, \w+)*\)\./
      if(!line.match(statement_regex)){
        throw new Error('Wrong Statement Format');
      }
    }
    this.checkRuleHealth = function(line){
      let statement_regex  = /\w+\(\w+(, \w+)*\)/
      let dot_regex = / :- /
      let rule_regex = new RegExp (statement_regex.source + dot_regex.source
        + statement_regex.source + "(" + statement_regex.source + ")*\.")
      if(!line.match(rule_regex)){
        throw new Error('Wrong Rule Format');
      }
    }
    this.checkQueryHealth = function(line){
      let query_regex = /\w+\(\w+(, \w+)*\)\.*/
      if(!line.match(query_regex)){
        throw new Error('Wrong Query Format');
      }
    }

    this.removeStopAtTheEnd = function(entry){
      if(entry.indexOf(".") == -1)
        throw new Error("Missing Stop");
      return entry.substring(0,entry.length-1);
    }
    this.parseStatements = function(entry){
      let i;
      for(i = 0; i<entry.length; i++){
        let aux = entry[i];
        aux = this.removeStopAtTheEnd(aux);
        aux = this.removeSpaces(aux);
        entry[i] = this.filterEmptyStrings(this.splitLine(aux));
      }
      return entry;
    }
    this.databaseLineIsStatement = function(line){
      let i;
      for(i = 0; i<line.length; i++){
        if(!line[i].match(/[a-z]/i)){
          continue;
        }
        if(line[i].toUpperCase() == line[i]){
          return false;
        }
      }
      return true;
    }
    this.removeSpaces = function(entry){
      return entry.replace(/\s+/g,"")
    }
    this.parseConditions = function(entry){
      return entry.split(":-");
    }
    this.insertConditionDivider = function(entry){
      let condition_divider_regex = /\),/g;
      return entry.replace( condition_divider_regex ,')|');
    }
    this.parseRules = function(entry){
      let i;
      for(i = 0; i<entry.length; i++){
        let aux = this.removeStopAtTheEnd(entry[i]);
        aux = this.parseConditions(this.removeSpaces(aux));
        aux[1] = this.insertConditionDivider(aux[1]);
        entry[i] = aux;
      }
      return entry;
    }
    this.arraysAreEqual = function(array_a,array_b){
      if(array_a.length != array_b.length || typeof(array_a) != typeof(array_b)){
        return false;
      }
      let i;
      for(i = 0;i<array_a.length; i++){
        if(typeof(array_a) == typeof(array_a[i])){
          if(!this.arraysAreEqual(array_a[i],array_b[i])){
            return false;
          }
        }else if(array_a[i] != array_b[i]){
          return false;
        }
      }
      return true;
    }
}
module.exports = Interpreter;
