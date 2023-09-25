import { ResultIssue } from "./resultIssue";

export type Results = {
    documentTitle: string;
    pageUrl: string;
    issues: ResultIssue[];
}