import ai from "./ai.ts";
import realProgramsScorer, { realProgramsEvaluator } from "./realProgramsScorer.ts";

let count = 0;

async function workflow(input: string) {
    const tools = [{ googleSearch: {} },];
    const config = {
        tools,
        responseMimeType: 'text/plain',
        systemInstruction: [
            {
                text: `# System Prompt

You are a professional researcher in the field of EU/UK education and EU career prospects. You need to provide recommendations that are optimal from the perspective of a Ukrainian citizen.

## Goal

Provide three profession recommendations with relevant specific existing Bachelor programs from a variety of universities

## Methodology

1. Use google_search tool to find up-to-date bachelor programs
2. Choose relevant bachelor programs from the search results

## Structure of the Response

Response Language: English.

### University Recommendations

A list of three specific Bachelor programs (in the EU/UK) with only one university per program:

- Program name: Only output a single program with a specific name.
- University name.
- Why it fits.

Provide answer in text format.
For program name use exact name of the program not the name of the area or department or specialization.
Use whole and complete name of the program, not just part of it.
It's important that you provide only bachelor programs.
Use only official university websites, if you found information somewhere else you need to verify it on official university website
Skip B.Sc BS LLB BA etc in names of programs.

### Recommended Professions

Use the provided professions unless they conflict with the criteria above. 
If any conflicts exist, replace only the conflicting professions with suitable alternatives.

- Name of the profession.
- Where it is applied.
- Average salary range in Europe.
- Useful skills.

### Advice for Next Steps

One short recommendation on the next steps for the user.

### Output Format

            {program_name}:
            {uni_name}:
            {why_it_fits}:

            Recommended Professions:
            - {profession_name}:
            - {profession_name}:
            - {profession_name}:

            Advice for Next Steps:
            {recommendation}
`,
            }
        ],
    };
    const model = 'gemini-2.5-pro-preview-03-25';
    const contents = [
        { role: 'user', parts: [{ text: input },], },
    ];

    const response = await ai.models.generateContent({
        model,
        config,
        contents,
    });
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('count', count++);
    if ((await realProgramsScorer({ output: text })).score != 1) {
        return await workflow(input);
    }
    return text
}

// console.log(await workflow("A list of three recommended professions: Veterinarian, Doctor, Landscape Architect. User's answers to relevant questions: Які шкільні предмети вам подобаються найбільше і чому? Математика та фізика, бо це цікаво, вирішувати ці завдання цікаво. Англійська — бо легко виходить. Що вам більше до вподоби: працювати в команді (якщо так, то ви віддаєте перевагу малим чи великим командам)? Розподіляти завдання серед команди? Виконувати свою частину роботи в команді? Працювати самостійно чи керувати власним бізнесом? Працювати самостійно Чи вам подобається виступати публічно? Ви надаєте перевагу невеликим групам, великим аудиторіям чи уникаєте виступів взагалі? Я уникаю виступів, але насправді мені це подобається Які предмети або науки ви хотіли б продовжувати вивчати в університеті? Бізнес, програмування, духовність Чим вам подобається займатися у вільний час? Створювати щось креативне, організовувати друзів на спільні прогулянки Які у вас захоплення? Чи може ваше хобі стати вашою майбутньою професією? Велосипед, ліпка з пластиліну, читання детективів, музика Які здібності або таланти допомагають вам у навчанні чи спілкуванні з іншими? Гарний організатор та комунікатор Що вам не подобається, що вас демотивує (у навчанні чи в інших людях) або, можливо, навіть дратує? Історія, гуманітарні предмети. Підлість, омана Яку роботу ви ніколи не хотіли б виконувати за жодних обставин? Фізичну Якою мовою ви б хотіли б продовжити навчання? Англійською"));
export default workflow;
