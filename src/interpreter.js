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
      return entry.replace(/[ ]/g,"")
    }
    this.parseConditions = function(entry){
      return entry.split(":-");
    }
    this.insertConditionDivider = function(entry){
      return entry.replace( /\),/g ,')|');
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


}
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
function checkDatabaseInput(entry){

}
module.exports = Interpreter;
