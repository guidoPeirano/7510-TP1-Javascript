var Interpreter = function () {

    this.parseDB = function (params, paramss, paramsss) {

    }

    this.checkQuery = function (params) {
        return true;
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
        entry[i] = aux.split(/[(,)]/);
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
      return entry.replace(/[ ]/g,"");
    }
    this.parseConditions = function(entry){
      return entry.split(":-");
    }
    this.insertConditionDivider = function(entry){
      return entry.replace(/),/,')|');
    }
    this.parseRule = function(entry){
      let i;
      for(i = 0; i<line.length; i++){
        aux = this.parseConditions(this.removeSpaces(entry));
        aux[1] = this.insertConditionDivider(aux[1]);
      }
    }


}

function checkDatabaseInput(entry){

}
module.exports = Interpreter;
