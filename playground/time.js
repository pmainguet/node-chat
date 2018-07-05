const moment = require('moment');

console.log('DD/MM/YYYY', '\n', moment().format('DD/MM/YYYY'), '\n', '------');
console.log('MMM', '\n', moment().format('MMM'), '\n', '------');
console.log('Do', '\n', moment().format('Do'), '\n', '------');
console.log('locale FR', '\n', moment().locale('FR').format('MMM'), '\n', '------');
console.log('fromNow', '\n', moment('17/10/1983', 'DD/MM/YYYY').fromNow(), '\n', '------');
console.log('timestamp', '\n', moment(new Date().getTime()).format('DD/MM/YYYY'));