import React, { Component } from 'react'
import './calendar.css'
import { dayList } from './day-list.js'

class CalendarDateComponent extends Component {
	constructor() {
		super();
		this.monthsList = [
			'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 
			'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
		this.dayOfWeekList = [
			'воскресенье', 'понедельник', 'вторник',
			'среда', 'четверг', 'пятница', 'суббота'];
	}
	render() {
		const { date } = this.props;
		const dayOfWeek = this.dayOfWeekList[date.getDay()];
		const month = this.monthsList[date.getMonth()];
		let styles = ['date-container'];
		if (date.getDay() === 0) {
			styles.push('important');
		}
		return (
			<div className={styles.join(' ')}>
				<div className='date-caption'>{month}</div>
				<div className='date-number'>{date.getDate()}</div>
				<div className='date-caption'>{dayOfWeek}</div>
			</div>);
	}
}

class Separator extends Component {
	render() {
		const { celebration } = this.props;
		if (celebration === null) {
			return <div className='separator'/>
		}
		else {
			return (
				<div className='important celebration'>
					{celebration[0]}
				</div>
			)
		}
	}
}

class CaptionComponent extends Component {
	render() {
		const { dayInformation } = this.props;
		return (
			<div>
				<Separator celebration={dayInformation.celebration} />
				<div className='date-advice'>
					{dayInformation.advice}
				</div>
			</div>
		)
	}
}

class CalendarComponent extends Component {
	render() {
		const { date } = this.props;
		const dayInformation = dayList.find(
			i => i.date.getYear() === date.getYear() && 
				 i.date.getMonth() === date.getMonth() &&
				 i.date.getDate() === date.getDate());
		return (
			<div className='calendar-container'>
				<CalendarDateComponent date={date} />
				<CaptionComponent dayInformation={dayInformation}/>
			</div>
		)
	}
}

export default CalendarComponent
