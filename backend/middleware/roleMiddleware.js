import { ADMIN, USER } from "../constants/index.js";

const ROLES = {
  Admin: ADMIN,
  User: USER,
};

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.roles) {
      res.status(401);
      throw new Error("You are not authorized to use our platform");
    }

    const roleFound = req.roles.some((role) => allowedRoles.includes(role));

    if (!roleFound) {
      res.status(401);
      throw new Error("You are not authorized to perform this request!");
    }

    next();
  };
};

export default {
  ROLES,
  checkRole,
};
