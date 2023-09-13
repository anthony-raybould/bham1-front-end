import { Results } from "./results";
import { ResultIssue } from "./resultIssue";

export const processResults = function(results : Results){

   const accessibilityErrors = results.issues.filter(isError)

   if (accessibilityErrors.length == 0) {
    return;
   }

   console.log("Accessibility Errors:")
   for (const issue of accessibilityErrors) {
    console.log(issue);
   }

   throw new Error("Accessibility errors.")
}

function isError(resultIssue : ResultIssue) {
    return resultIssue.typeCode == 2;
}