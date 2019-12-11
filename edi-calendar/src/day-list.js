let dayIteartor = new Date(2019, 11, 10);

function getDateAndAdvance() {
    let currentDay = dayIteartor;
    dayIteartor = new Date();
	dayIteartor.setDate(currentDay.getDate() + 1);
    return currentDay;
}

class DayInformation {
	constructor(advice, celebration = null) {
		this.advice = advice
		this.celebration = celebration;
        this.date = getDateAndAdvance();
	}
}

let dayList = [
	new DayInformation('Ничего не откладывайте на будущее, сегодня же ищите наилучшее решение'),
    new DayInformation('Отличный момент для обращения к высшим силам и занятий искусством'),
    new DayInformation('Аккуратнее обращайтесь с электроприборами', ['День работников леса']),
    new DayInformation('Отличный день для всех, кто избрал путь Света и не пошел путем Тьмы'),
    new DayInformation('День измерительных процедур и прояснения спорных вопросов'),
    new DayInformation('Прекрасный момент для реализации творческих замыслов', ['День оружейника']),
    new DayInformation('День бесстрашия и борьбы с несправедливостью'),
    new DayInformation('Проведите эту пятницу по возможности спокойно и гармонично', ['Международный день мира', 'День воинской славы России', 'Куликовская битва', 'РОЖДЕСТВО ПРЕСВЯТОЙ БОГОРОДИЦЫ']),
    new DayInformation('Посвятите этот выходной укреплению здоровья'),
    new DayInformation('Астрологический фон пестрый; прислушайтесь к голосу интуиции'),
    new DayInformation('Любые сюрпризы этого дня можно обернуть себе на пользу'),
    new DayInformation('Не спешите, творчески отнеситесь к порученному делу'),
    new DayInformation('Не торопитесь, берегите душевный покой'),
    new DayInformation('Берите пример с детей - воспринимайте мир как увлекательную игру', ['День воспитателя и всех дошкольных работников', 'Всемирный день туризма', 'ВОЗДВИЖЕНИЕ КРЕСТА ГОСПОДНЯ']),
    new DayInformation('Найдите время для домашнего отдыха', ['День работника атомной промышленности']),
    new DayInformation('Удачный момент для прогулок и путешествий'),
    new DayInformation('Отличный момент для семейного отдыха', ['День машиностроителя', 'Международный день переводчика']),
    new DayInformation('Не уклоняйтесь от решения экологических проблем', ['День пожилых людей', 'День сухопутных войск РФ', 'Международный день музыки'])
];

export { DayInformation, dayList };
