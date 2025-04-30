import realProgramsScorer from "./realProgramsScorer.ts";



// (async () => {
//     const result = await realProgramsScorer({ input });
//     console.log(`Banana score: ${result.score}`);
// })();

import { initDataset, init, Dataset, Experiment, Eval } from "braintrust";
import workflow from "./workflow.ts";
import { Score } from "autoevals";

function myApp(input: any) {
    return `output of input ${input}`;
}

function myScore(output: any, rowExpected: any) {
    return Math.random();
}


// Eval(
//     "homcho",
//     {
//         data: initDataset("homcho", { dataset: "first" }),
//         task: workflow,
//         scores: [realProgramsScorer],
//     },
// );