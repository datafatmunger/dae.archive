var crypto = require('crypto')

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId
     
  /**
   * User model
   * 
   * Used for persisting users
   */  
  function validatePresenceOf(value) {
    return value && value.length
  }

  var User = new Schema({
    email: { type: String, validate: [validatePresenceOf, 'Email address required'], index: { unique: true } },
    name: String,
    //city: String,
    lastseen: Date,
    hashed_password: String,
    salt: String
  })
  
  User.virtual('lastseendate')
    .get(function() {
      return date.toReadableDate(this.lastseen, 'datestamp')
    })
  
  User.virtual('id')
    .get(function() {
      return this._id.toHexString()
  })
  
  User.virtual('password')
    .set(function(pw) {
      this._password = pw
      this.salt = this.createSalt()
      this.hashed_password = this.encryptPassword(pw)
    })
    .get(function() { return this._password })
  
  User.method('authenticate', function(plain) {
    return this.encryptPassword(plain) === this.hashed_password
  })
  
  User.method('createSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  })
  
  User.method('encryptPassword', function(str) {
    return crypto.createHmac('sha1', this.salt).update(str).digest('hex')
  })

  User.method('serialize', function() {
    return {
      'id': this._id,
      'email': this.email,
      'name': this.name
    }
  })
  
  // Temp remove password requirement - JBG
  /*
  User.pre('save', function(next) {
    if (!validatePresenceOf(this.hashed_password)) {
      next(new Error('Invalid password'))
    } else {
      next()
    }
  })
  */
  
  //register validators
  User.path('email').validate(function(val) {
    return val.length > 0
  }, 'EMAIL_MISSING')
  
  /**
   * LoginToken model
   * 
   * Used for persisting session tokens
   */
  var LoginToken = new Schema({
    name: { type: String, index: true },
    series: { type: String, index: true },
    token: { type: String, index: true }
  })
  
  LoginToken.virtual('id')
    .get(function() {
      return this._id.toHexString()
  })

  LoginToken.virtual('cookieValue')
    .get(function() {
      return JSON.stringify({ name: this.name, token: this.token, series: this.series })
    })
  
  LoginToken.method('randomToken', function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  })

  LoginToken.pre('save', function(next) {
    this.token = this.randomToken()
    this.series = this.randomToken()
    next()
  })

  // register mongoose models
  mongoose.model('User', User)
  mongoose.model('LoginToken', LoginToken)
  fn()

}

exports.defineModels = defineModels

