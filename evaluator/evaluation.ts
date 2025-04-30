import { initDataset } from "braintrust";
import realProgramsScorer from "./realProgramsScorer.ts";
import workflow from "./workflow.ts";

Deno.env.set("BRAINTRUST_API_KEY", "sk-FIFBl10WYUSe72Bmb1bbAxXPTKLnuxcy30pQUiSaLj8txUTu")
async function main() {
    const dataset = initDataset("homcho", { dataset: "first" });
    // console.log(dataset);
    //   const experiment = init("My App", {
    //     experiment: "My Experiment",
    //     dataset: dataset,
    //   });
    for await (const row of dataset) {
        // const output = myApp(row.input);
        // const closeness = myScore(output, row.expected);
        // experiment.log({
        //   input: row.input,
        //   output,
        //   expected: row.expected,
        //   scores: { closeness },
        //   datasetRecordId: row.id,
        // });
        const output = await workflow(row.input);
        const evaluation = await realProgramsScorer({ output });
        // console.log(evaluation);
        if (evaluation.score != 1) {
            console.log(evaluation.metadata);
            console.log(evaluation.score);
        }
    }

    //   console.log(await experiment.summarize());
}

await main();