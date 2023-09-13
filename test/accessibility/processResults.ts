import { Results } from "./results";
import { ResultIssue } from "./resultIssue";

export const processResults = function(results : Results){

   const accessibilityErrors = results.issues.filter(isError)
}

function isError(resultIssue : ResultIssue) {
    return resultIssue.typeCode == 2;
}