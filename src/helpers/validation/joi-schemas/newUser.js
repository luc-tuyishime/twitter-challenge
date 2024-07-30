import Joi from "joi";

import * as validate from "../";

const nameValidator = (label) => (value, helpers) => {
  const checkEmail = validate.name({ name: value, required: true, label });
  return checkEmail === true ? true : helpers?.message(checkEmail);
};

const emailValidator = (value, helpers) => {
  const checkEmail = validate.email(value, true);
  return checkEmail === true ? true : helpers?.message(checkEmail);
};

const passwordValidator = (value, helpers) => {
  const checkPassword = validate.password(value, true);
  return checkPassword === true ? true : helpers?.message(checkPassword);
};

export default Joi.object().keys({
  names: Joi.string().min(2).label("Names").required(),
  email: Joi.string().required().custom(emailValidator),
  password: Joi.string().required().custom(passwordValidator),
  phone: Joi.string().required(),
  address: Joi.string().min(2).label("Names").required(),
  subscriptionId: Joi.number(),
  genreId: Joi.number(),
});
