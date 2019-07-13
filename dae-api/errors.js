exports.Conflict = function(msg) {
  this.name = 'Conflict'
  Error.call(this, msg)
  Error.captureStackTrace(this, arguments.callee)
}

exports.Conflict.prototype.__proto__ = Error.prototype

exports.Unprocessable = function(msg) {
  this.name = 'Unprocessable'
  Error.call(this, msg)
  Error.captureStackTrace(this, arguments.callee)
}

exports.Unprocessable.prototype.__proto__ = Error.prototype

exports.BadRequest = function(msg) {
  this.name = 'BadRequest'
  Error.call(this, msg)
  Error.captureStackTrace(this, arguments.callee)
}

exports.BadRequest.prototype.__proto__ = Error.prototype

exports.NotFound = function(msg) {
  this.name = 'NotFound'
  Error.call(this, msg)
  Error.captureStackTrace(this, arguments.callee)
}

exports.NotFound.prototype.__proto__ = Error.prototype

exports.Unauthorized = function(msg) {
  this.name = 'Unauthorized'
  Error.call(this, msg)
  Error.captureStackTrace(this, arguments.callee)
}

exports.Unauthorized.prototype.__proto__ = Error.prototype


