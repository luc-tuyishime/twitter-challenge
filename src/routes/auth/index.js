import { Router } from "express";
import signupController from "../../controllers/auth";
import joiValidator from "../../middlewares/joiValidator";
import * as schema from "../../helpers/validation/joi-schemas";
import errorHandlerAsync from "../../middlewares/errorHandler";

const router = Router();

router.post(
  "/signup",
  joiValidator(schema.newUser),
  errorHandlerAsync(signupController.signup)
);
router.post("/login", errorHandlerAsync(signupController.login));

export default router;
