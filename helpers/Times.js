/**
 * 
 * 
 * @author ADNA SERVICE
 * @copyright ADNA SERVICE
 */

const db = require("../models");


/**
 * 
 * @param {string} time 
 * @returns 
 */
function TimeGetter(time) {
    const hour = /[0-9]{1,5}h/;
    const hourM = /[0-9]{1,5}h[0-9]{1,5}m/;
    const min = /[0-9]{1,2}m/;
    const day = /[0-9]{1,2}d/;
    const week = /[0-9]{1,5}w/;
    const digit = /[0-9]+/;
    const sec = /[0-9]{1,2}s/;
    // if (hour.test(time)) {
    //     const getNumber = digit.exec(time)[0];
    //     return { time: `${getNumber.padStart(2, '0') }:00:00`, number: 1 }
    // }else if(hourM.test(time)){
    //     const h = hour.exec(time)[0];
    //     const m = min.test(time)[0];
    //     return { time: `${h.padStart(2, '0') }:${m.padStart(2, '0') }:00`, number: 1 }
    // } else if (min.test(time)) {
    //     const getNumber = digit.exec(time)[0];
    //     return { time: `00:${getNumber.padStart(2, '0') }:00`, number: 1 }
    // } else if (day.test(time)) {
    //     const getNumber = digit.exec(time)[0];
    //     return { time: `${(getNumber*24) }:00:00`, number: getNumber }
    // } else if (week.test(time)) {
    //     const getNumber = digit.exec(time)[0];
    //     const multiple = getNumber > 3 ? 7.5 : 7;
    //     const calc = (24 * multiple) * getNumber;
    //     return { time: `${calc}:00:00`, number: getNumber > 3 ? getNumber * 7.5 : getNumber * 7 }
    // } else return { time: null }
    const result = {
        time: '',
        number: ''
    }
    let h ='00';
    let m ='00';
    let s='00';
    if(hour.test(time)){
        const getNumber = hour.exec(time)[0];
        h = digit.exec(getNumber)[0];
    }

    if(min.test(time)){
        const getNumber = min.exec(time)[0];
        m = digit.exec(getNumber)[0];
    }
    if (day.test(time)) {
        const getNumber = digit.exec(time)[0];
        h = getNumber*24;
        result.number= getNumber;
    }
    if (week.test(time)) {
        const getNumber = digit.exec(time)[0];
        const multiple = getNumber > 3 ? 7.5 : 7;
        const calc = (24 * multiple) * getNumber;
        h = calc;
        result.number = getNumber > 3 ? getNumber * 7.5 : getNumber * 7
    }
    if(sec.test(time)){
        const getNumber = sec.exec(time)[0];
        s = digit.exec(getNumber)[0];
    }
    result.time =`${h}:${m}:${s}`
    return result
}

//'1h45m46s'

function test(time, lefttime) {
    const fTime = TimeGetter(time).time.split(':');
    const hour = /[0-9]{1,5}h/;
    const finialTime = TimeGetter(String(lefttime)).time !== null ? TimeGetter(String(lefttime)).time.split(':') : TimeGetter(hour.exec(lefttime)[0] + 'h').time.split(':');
    const calc = TimeGetter(finialTime[0]).time !== null ? (parseInt(TimeGetter(finialTime[0]).time.split(':')[0]) + parseInt(finialTime[0])) + parseInt(fTime[0]) : parseInt(finialTime[0]) + parseInt(fTime[0]);
    return { uptime: `${calc}:${finialTime[1]}:00` }
}
/**
 * 
 * @param {int} number 
 * @returns 
 */
async function getExactTime(number) {
  const forfait = await db.Times.findAll({ raw: true })
  return forfait.filter((time) => (number >= (parseInt(time.price)-(parseInt(time.price) * 0.19)) && number <= parseInt(time.price) ) && time.price)[0]
 
}

/**
 * GetTime
 */

class getTime {
    /**
     * 
     * @param {string} parm 
     */
    constructor(parm) {
            this.parm = parm
            this.hour = /[0-9]{1,5}h/;
            this.min = /[0-9]{1,2}m/;
            this.sec = /[0-9]{1,2}s/;
            this.day = /[0-9]{1,2}d/;
            this.week = /[0-9]{1,5}w/;
            this.digit = /[0-9]+/;

        }
        /**
         * 
         * @returns {object}
         */
    getHour() {
            return { hour: this.hour.exec(this.parm) !== null ? this.hour.exec(this.parm)[0] : null }
        }
        /**
         * 
         * @returns {object}
         */
    getMinute() {
            return { minutes: this.min.exec(this.parm) !== null ? this.min.exec(this.parm)[0] : null }
        }
        /**
         * 
         * @returns {object}
         */
    getSeconde() {
            return { secondes: this.sec.exec(this.parm) !== null ? this.sec.exec(this.parm)[0] : null }
        }
        /**
         * 
         *@returns {object}
         */
    getWeek() {
            return { week: this.week.exec(this.parm) !== null ? this.week.exec(this.parm)[0] : null }
        }
        /**
         * 
         * @returns {object}
         */
    getDay() {
            return { days: this.day.exec(this.parm) !== null ? this.day.exec(this.parm)[0] : null }
        }
        /**
         * 
         * @param {*} value 
         * @returns 
         */
    getDigit(value) {
        return this.digit.exec(value);
    }
}

/**
 * Calcule les heures et retourne en  { limitUptime: '337:45:00' }
 * @param {string} time 
 * @param {string} lefttime 
 * @returns {object}
 */
function calcUptime(time, lefttime) {
    //const times = new getTime(time)
    const lftTime = new getTime(lefttime)
    let getTimes = null;
    if (lftTime.getDay().days !== null && lftTime.getHour().hour !== null && lftTime.getMinute().minutes !== null && lftTime.getSeconde().secondes !== null) {
        getTimes = (parseInt(TimeGetter(lftTime.getDay().days).time.split(':')[0]) + parseInt(TimeGetter(lftTime.getHour().hour).time.split(':')[0])) + parseInt(TimeGetter(time).time.split(':')[0])
        return { limitUptime: `${getTimes}:${lftTime.getMinute().minutes !==null?lftTime.getDigit(lftTime.getMinute().minutes):'00'}:00` }
    } else if (lftTime.getWeek().week !== null && lftTime.getHour().hour !== null && lftTime.getMinute().minutes !== null && lftTime.getSeconde().secondes !== null) {
        getTimes = (parseInt(TimeGetter(lftTime.getWeek().week).time.split(':')[0]) + parseInt(TimeGetter(lftTime.getHour().hour).time.split(':')[0])) + parseInt(TimeGetter(time).time.split(':')[0])
        return { limitUptime: `${getTimes}:${lftTime.getMinute().minutes !==null?lftTime.getDigit(lftTime.getMinute().minutes):'00'}:00` }
    } else if (lftTime.getDay().days === null && lftTime.getWeek().week === null && lftTime.getHour().hour !== null && lftTime.getMinute().minutes !== null && lftTime.getSeconde().secondes !== null) {
        getTimes = parseInt(TimeGetter(lftTime.getHour().hour).time.split(':')[0]) + parseInt(TimeGetter(time).time.split(':')[0])
        return { limitUptime: `${getTimes}:${lftTime.getMinute().minutes !==null?lftTime.getDigit(lftTime.getMinute().minutes):'00'}:00` }
    } else if (lefttime === '0s') {
        // getTimes = parseInt(TimeGetter(lftTime.getHour().hour).time.split(':')[0]) + parseInt(TimeGetter(time).time.split(':')[0])
        return {
            limitUptime: TimeGetter(time).time
        }
    } else {
        getTimes = parseInt(TimeGetter(lftTime.getHour().hour).time.split(':')[0]) + parseInt(TimeGetter(time).time.split(':')[0])
        return { limitUptime: `${getTimes}:${lftTime.getMinute().minutes !==null?lftTime.getDigit(lftTime.getMinute().minutes):'00'}:00` }
    }
}
/**
 * 
 * @param {string} time 
 * @returns {object}
 */
function SplitTime(time) {
    const SpTime = String(time).split(':');
    return { limitUptime: `${SpTime[0]}:${SpTime[1]}:00`, time: `${parseInt(SpTime[0])}h${SpTime[1]}` }
}

/**
 * 
 * @param {string} date 
 * @returns {object}
 */
const FormatDate = (date) => {
    const months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Setpembre", "Octobre", "Novembre", "Décembre"];
    const result = {
        day: '',
        month: '',
        year: ''
    }
    if (date !== null) {
        const dDate = new Date(String(date).toString());
        result.day = dDate.getUTCDate();
        result.year = dDate.getUTCFullYear();
        result.month = months[dDate.getUTCHours()];

    }

    const dDate = new Date(String(date).toString());
    result.day = dDate.getUTCDate();
    result.year = dDate.getUTCFullYear();
    result.month = months[dDate.getUTCHours()];
    return result
}

// console.log(TimeGetter("5h30m40s"))

module.exports = { TimeGetter, calcUptime, SplitTime, FormatDate,getExactTime }