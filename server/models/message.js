const Message = function (from, text) {
    this.from = from,
        this.text = text,
        this.createdAt = new Date().getTime()
}

module.exports = {
    Message
}