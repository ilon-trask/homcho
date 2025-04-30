import { loadPrompt } from "braintrust";
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
                text: (await loadPrompt({
                    projectName: "homcho",
                    slug: "workflow_prompt"
                })).prompt?.messages?.[0]?.content
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
