import * as tokens from "../../utils/tokens";
import * as status from "../../constants/httpStatusCodes";
import * as errorMessages from "../../constants/errorMessages";
import * as successMessages from "../../constants/successMessages";

import db from "../../database/models";

const { User } = db;

export default class AuthController {
  /**
   * @description user signup function
   * @param {object} req request from user
   * @param {object} res response from server
   * @return {object} user information & token
   */
  static async signup(req, res) {
    const newUser = await User.create(req.body);

    return res.status(status.HTTP_CREATED).json({
      status: status.HTTP_CREATED,
      message: successMessages.SIGN_UP_CREATED,
      user: { ...newUser.get(), password: undefined },
    });
  }

  /**
   * @description - login user function
   * @param {object} req
   * @param {object} res
   * @return {Promise} response object
   */
  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user?.get()?.email) {
      return res.status(status.HTTP_NOT_FOUND).json({
        status: status.HTTP_NOT_FOUND,
        message: errorMessages.EMAIL_NOT_FOUND,
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(status.HTTP_UNAUTHORIZED).json({
        status: status.HTTP_UNAUTHORIZED,
        message: errorMessages.BAD_CREDENTIALS,
      });
    }

    const payload = {
      id: user.get().id,
      email: user.get().email,
    };

    const token = tokens.generate(payload);

    return res.status(status.HTTP_OK).json({
      status: status.HTTP_OK,
      message: successMessages.SIGNED_IN,
      user: { ...user.get(), password: undefined },
      token,
    });
  }
}
