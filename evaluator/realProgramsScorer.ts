import braintrust from "braintrust";
import { Factuality, Score } from "autoevals";
import ai from "./ai.ts";
import { z } from "zod";




async function realProgramsEvaluator(input: string) {
  const tools = [{ googleSearch: {} },];
  const config = {
    tools,
    responseMimeType: 'text/plain',
    systemInstruction: [
      {
        text: `#System prompt
              check if programs from this text actually exist. 
              Use web search for checking. 
              Name should be exact same as in the input, it can't be part of name or half or it, name of area or department or specialization, also it can't be name of master only bachelor, only whole exact name of program.  
              If there is just similar programs it's still not the one. 
              Return regualr plain text to just display data.
              You should pay close attention whether the program is bachelor or master, approve only bachelor programs.

              #Search format:
              {uni_name} program:{program_name}

              #Format of answer:

              {uni_name}:
              {program_name}: {yes or no}

              All programs are real: {0 or 0.33 or 0.67 or 1} 
`,
      }
    ],
  };
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: "#Input\n" + input
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro-preview-03-25',
    config,
    contents,
  });

  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  return { text, response };
}


const realProgramsScorer = async ({ output }: { output: string }): Promise<Score> => {
  const { text, response } = await realProgramsEvaluator(output);
  const realPrograms = text?.substring(text?.lastIndexOf("All programs are real:") + "All programs are real:".length + 1);
  const score = parseFloat(realPrograms || "0");
  const res = {
    name: "real_programs_scorer", score: score, metadata: {
      evaluation: text,
      response,
      output
    }
  };
  // console.log(res);
  return res;
};


const input = `
Okay, here are three recommendations tailored for a Ukrainian citizen seeking education and career opportunities in the EU/UK.

University Recommendations
Program name: BSc Computer Science

University name: Trinity College Dublin, The University of Dublin (Ireland)
Why it fits: Ireland has a booming tech sector (many major companies have European HQs here), offering strong career prospects post-graduation. Trinity College is highly ranked globally, and Ireland offers post-study work visa options attractive to non-EU nationals like Ukrainians. The program is taught in English.
Program name: BEng Renewable Energy Engineering

University name: University of Exeter (UK)
Why it fits: The UK and EU are heavily investing in renewable energy due to climate goals (like the EU Green Deal). This creates high demand for specialists. Exeter has a strong reputation in environmental science and engineering. While UK visa rules apply, skilled engineers in green tech are often sought after, potentially easing the path to work permits. The program is taught in English.
Program name: BSc International Business Administration (IBA)

University name: Rotterdam School of Management, Erasmus University (Netherlands)
Why it fits: The Netherlands is a major European trade hub with a very international outlook. RSM is a top-tier European business school. An IBA degree provides versatile skills applicable across many sectors (finance, logistics, marketing, management) in multinational companies, which often have clear processes for hiring non-EU talent. The Netherlands also has favourable post-study work schemes ('Orientation Year' visa). The program is taught in English.
Recommended Professions
Name of the profession: Software Engineer / Developer

Where it is applied: Technology companies, finance, e-commerce, healthcare, public sector, startups – virtually every industry.
Average salary range in Europe: €45,000 - €85,000+ per year, depending on experience, location (e.g., higher in Switzerland, Germany, Netherlands, Ireland, UK tech hubs), and specialization.
Useful skills: Programming languages (Python, Java, C++, JavaScript), problem-solving, algorithms, data structures, teamwork, version control (Git), cloud platforms (AWS, Azure, GCP).
Name of the profession: Renewable Energy Engineer

Where it is applied: Energy companies (utilities), engineering consultancies, equipment manufacturers (wind turbines, solar panels), research institutions, government agencies, construction firms specializing in green projects.
Average salary range in Europe: €40,000 - €75,000+ per year, varying by country (e.g., strong demand in Germany, UK, Denmark, Netherlands), experience, and specific role (design, project management, research).
Useful skills: Physics, mathematics, electrical/mechanical engineering principles, knowledge of solar/wind/hydro/geothermal systems, project management, data analysis, CAD software, environmental regulations.
Name of the profession: International Business Analyst / Manager

Where it is applied: Multinational corporations, consulting firms, import/export companies, financial institutions, international organizations, logistics and supply chain management.
Average salary range in Europe: €40,000 - €80,000+ per year, dependent on experience, industry, company size, and location (e.g., financial centres like Frankfurt, Amsterdam, London often pay more).
Useful skills: Market analysis, cross-cultural communication, business strategy, finance, marketing principles, data analysis, negotiation, language skills (English is essential, others are a plus), understanding of international trade regulations.
Advice for Next Steps
Focus on thoroughly researching the specific entry requirements (including English language tests like IELTS/TOEFL and recognition of your Ukrainian qualifications) and application deadlines for your chosen programs. Also, investigate student visa processes and post-study work opportunities for Ukrainians in the target countries (Ireland, UK, Netherlands).
`

// console.log(await realProgramsScorer({ output: input }))

export default realProgramsScorer;

export { realProgramsEvaluator };

// const project = braintrust.projects.create({ name: "homcho" });


// project.scorers.create({
//   name: "Real programs scorer",
//   slug: "real-programs-scorer",
//   description: "Checks if programs are real",
//   parameters: z.object({
//     output: z.string(),
//   }),
//   returns: z.promise(z.object({
//     score: z.number().nullable(),
//     name: z.string(),
//     metadata: z.any().optional()
//   })),
//   handler: async ({ output }) => {
//     return await realProgramsScorer({ output });
//   },
// });
