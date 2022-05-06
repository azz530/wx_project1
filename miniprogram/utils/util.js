const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const myFormatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

const myFormatTime0 = date => {

  function myGetDate(addDayCount) {
    date.setDate(date.getDate() + addDayCount);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return [year, month, day].map(formatNumber).join('/')
  }

  return [myGetDate(0),myGetDate(-1),myGetDate(-1)]

}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//导出自定义时间格式
module.exports = {
  formatTime: formatTime,
  myFormatTime: myFormatTime,
  myFormatTime0: myFormatTime0
}