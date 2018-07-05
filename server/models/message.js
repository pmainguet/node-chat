const moment = require('moment');

const Message = function (from, text) {
    this.from = from,
        this.text = text,
        this.createdAt = moment().valueOf()
}

module.exports = {
    Message
}