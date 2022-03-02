import Joi from 'joi'

// Base
const name = Joi.string().alphanum().min(3).max(30)
const password = Joi.string().min(4)
const email = Joi.string().email()
const code = Joi.string()

// Object
const login = Joi.object({ email, password })
const register = Joi.object({ name, email, password })
const forgot = Joi.object({ email })
const reset = Joi.object({ email, password, code })

function createValidator(schema: Joi.Schema) {
  return (d: any) => {
    const result = schema.validate(d, { allowUnknown: false, presence: 'required' })
    if (result.error) throw new Error(result.error.message)
  }
}

export const Validators = {
  login: createValidator(login),
  register: createValidator(register),
  forgot: createValidator(forgot),
  reset: createValidator(reset),
}
