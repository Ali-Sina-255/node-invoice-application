import { ADMIN, USER } from "../constants/index";
const ROLES = {
  Admin: ADMIN,
  User: USER,
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user && !req.roles) {
      res.status(401);
      throw new Error("You are not authorized to use our platform");
    }

    const rolesArray = [...allowedRoles];

    const roleFound = req.roles
      .map((role) => rolesArray.includes(role))
      .find(value === true);

    if (!roleFound) {
      res.status(401);
      throw new Error("You are not authorized to preform this request!");
    }

    next();
  };
};

const role = { ROLES, checkRole };
export default role;
