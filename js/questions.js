import {QuestionBuilder, QuestionType} from "./quiz.js";
import questions from "/data/questions.json" assert { type: "json" }

export const questionsList = questions;

// questionsList.push(new QuestionBuilder(QuestionType.Checkbox,
//     "Выберите предметы, с которыми можно безопасно играть.")
//     .addAnswer("бенгальские свечи")
//     .addAnswer("плюшевый медвежонок", true)
//     .addAnswer("спички")
//     .addAnswer("деревянный кубик", true)
//     .addAnswer("зажигалка")
//     .addAnswer("резиновый мячик", true).build());
// questionsList.push(new QuestionBuilder(QuestionType.Checkbox,
//     "Выберите предметы, неправильное обращение с которыми может привести к пожару.")
//     .addAnswer("электроутюг", true)
//     .addAnswer("электрический фонарик")
//     .addAnswer("настольная лампа", true)
//     .addAnswer("радиоприёмник на батарейках")
//     .addAnswer("ёлочные игрушки")
//     .addAnswer("электропаяльник", true).build());
// questionsList.push(new QuestionBuilder(QuestionType.Checkbox,
//     "Какие из перечисленных жидкостей огнеопасны?")
//     .addAnswer("бензин", true)
//     .addAnswer("молоко")
//     .addAnswer("сок яблочный")
//     .addAnswer("лак для ногтей", true)
//     .addAnswer("клей резиновый", true).build());
// questionsList.push(new QuestionBuilder(QuestionType.Radio,
//     "Загорелся телевизор, что делать?")
//     .addAnswer("залить водой")
//     .addAnswer("выдернуть шнур из розетки, залить водой, сообщить в пожарную охрану", true)
//     .addAnswer("позвать соседей")
//     .addAnswer("лечь на пол и плакать").build());
// questionsList.push(new QuestionBuilder(QuestionType.Text,
//     "Как называется профессия человека, тушащего пожар?")
//     .addAnswer("пожарный", true).build());
// questionsList.push(new QuestionBuilder(QuestionType.Radio,
//     "Если в доме отключили электричество, чем наиболее безопасно можно воспользоваться для освещения?")
//     .addAnswer("спичками")
//     .addAnswer("свечой")
//     .addAnswer("зажигалкой")
//     .addAnswer("электрическим фонариком", true).build());
// questionsList.push(new QuestionBuilder(QuestionType.Checkbox,
//     "Какие надписи предупреждают о безопасности?")
//     .addAnswer("«Вход воспрещен!»")
//     .addAnswer("«Не курить!»", true)
//     .addAnswer("«Берегись автомобиля»", true)
//     .addAnswer("«Огнеопасно»", true).build());
// questionsList.push(new QuestionBuilder(QuestionType.Text,
//     `В каком году по Указу Президента России Государственная противопожарная служба переподчинена из МВД в МЧС?
//      Напишите в ответ только год (например "1994").`)
//     .addAnswer("2001").build());
// questionsList.push(new QuestionBuilder(QuestionType.Radio,
//     "От непотушенного окурка задымился ватный матрац на постели. Каковы ваши действия?")
//     .addAnswer("выброшу матрац на балкон")
//     .addAnswer("вынесу матрац в ванную комнату и залью водой", true)
//     .addAnswer("сброшу матрац на пол и затопчу ногами").build());
// questionsList.push(new QuestionBuilder(QuestionType.Text,
//     "Назвать тип огнетушителя, предназначенного для тушения разнообразных материалов, предметов, веществ.")
//     .addAnswer("пенный", true).build());
//
// console.log(JSON.stringify(questionsList));

