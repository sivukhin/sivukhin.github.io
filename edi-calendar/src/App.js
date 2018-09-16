import React from 'react'
import CalendarComponent from './calendar'

export default () => (
	<div className='external-container'>
		<CalendarComponent date={new Date()}/>
	</div>
)
