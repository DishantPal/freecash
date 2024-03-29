import * as auth from "./auth.model";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { createJWTToken, decodeToken } from "./jwt";
import { sendEmail } from "../../utils/sendEmail";
import { config } from "../../config/config";
import {
  forgotPasswordBodySchema,
  loginBodySchema,
  registerUserSchema,
} from "./auth.schema";
import { dispatchEvent } from "../../events/eventBus";
import { bonusDetails } from "../bonuses/bonuses.model";
import { referCodeUser } from "../user/user.model";
// import emailEvents from "../../events/emailEvent";
export const register = async (req: FastifyRequest, reply: FastifyReply) => {
  const { name, email, password, referral } = req.body as registerUserSchema;
  let hashPassword: string = await bcrypt.hash(password, 10);
  const userExist = await auth.login(email);
  if (userExist) {
    return reply.sendError("User already exists", 409);
  } else {
    const referralCode = (Math.random() + 1).toString(36).substring(7);
    const register = await auth.register(
      name,
      email,
      hashPassword,
      referralCode,
      referral ? referral : null
    );
    console.log(register.insertId);
    if (register) {
      let accessToken = await createJWTToken(
        { name: name, email: email },
        `${parseInt(config.env.app.expiresIn)}h`
      );
      dispatchEvent("user_registered", {
        fromEmail: config.env.app.email,
        toEmail: email,
        subject: "Email Verification Link",
        text: `Hello👋, ${name}. Please verify your email by clicking this link.`,
        link: `${config.env.app.appUrl}/api/v1/auth/verify-email/?token=${accessToken}`,
      });
      //Join No Refer bonus_code
      const noReferBonus = await bonusDetails("join_no_refer");

      //Join With Refer bonus_code
      const joinReferBonus = await bonusDetails("join_with_refer");

      dispatchEvent("assign_bonus", {
        user_id: register.insertId,
        amount: noReferBonus?.amount,
        bonus_code: noReferBonus?.code,
        expires_on: null,
        referred_bonus_id: null,
      });

      if (joinReferBonus?.validity_days) {
        const joinReferExpiresOn = new Date();
        joinReferExpiresOn.setDate(
          joinReferExpiresOn.getDate() + joinReferBonus?.validity_days
        );
        //Join With Refer bonus_code
        const referBonus = await bonusDetails("refer_bonus");
        if (referral) {
          const isReferal = await referCodeUser(referral);
          if (!isReferal) {
            return reply.sendError("Invalid Referal Code", 409);
          }
          //join with refer
          dispatchEvent("assign_bonus", {
            user_id: register.insertId,
            amount: joinReferBonus?.amount,
            bonus_code: joinReferBonus?.code,
            expires_on: joinReferExpiresOn.toISOString(),
            referred_bonus_id: isReferal.id,
          });
          //referal Bonus
          if (referBonus?.validity_days) {
            const expiresOn = new Date();
            expiresOn.setDate(expiresOn.getDate() + referBonus?.validity_days);
            dispatchEvent("assign_bonus", {
              user_id: isReferal.id,
              amount: referBonus?.amount,
              bonus_code: referBonus?.code,
              expires_on: expiresOn.toISOString(),
              referred_bonus_id: null,
            });
          }
        }
      }
      // req.session.set("accessToken", accessToken);
      reply.setCookie("token", accessToken.toString(), { path: "/" });

      // return reply.redirect(`/dashboard?token=${accessToken}`);
      return reply.sendSuccess(
        { token: accessToken },
        201,
        "Registered successfully!"
      );
    } else {
      return reply.sendError("Internal Server Error", 500);
    }
  }
};
export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as loginBodySchema;
  const userData = await auth.login(email);
  if (!userData) {
    return reply.sendError("User not found", 404);
  } else {
    if (userData.password === null) {
      return reply.sendError("Please login through social", 401);
    }
    const isValidPassord = await bcrypt.compare(password, userData.password);
    if (!isValidPassord) {
      return reply.sendError("Invalid Password!", 401);
    } else {
      //Checking session
      let checkSession = req.cookies.accessToken;
      if (checkSession !== undefined) {
        return reply.redirect(`/dashboard?token=${checkSession}`);
        // return reply.sendSuccess(
        //   {
        //     token: checkSession,
        //   },
        //   200,
        //   "Logged in successfully"
        // );
      } else {
        let newAccessToken = await createJWTToken(
          { name: userData.name, email: userData.email, id: userData.id },
          `${parseInt(config.env.app.expiresIn)}h`
        );
        //Encrpted session
        // req.session.set("accessToken", newAccessToken);
        reply.setCookie("token", newAccessToken.toString(), {
          path: "/",
        });
        // return reply.redirect(`/dashboard?token=${newAccessToken}`);
        return reply.sendSuccess(
          { token: newAccessToken },
          200,
          "Logged in successfully"
        );
      }
    }
  }
};

export const verifyEmail = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { token } = req.query as { token: string };
  const decoded: any = decodeToken(reply, token);
  const user = await auth.login(decoded.email);
  if (user?.is_verified == 0) {
    await auth.updateIsVerified(decoded.email);
    // const info = await sendEmail(
    //   config.env.app.email,
    //   decoded.email,
    //   "Welcome🙌🙌",
    //   `Hello👋,
    //       Welcome to Freecash`,
    //   ""
    // );
    dispatchEvent("user_registered", {
      fromEmail: config.env.app.email,
      toEmail: decoded.email,
      subject: "Email Verification Link",
      text: `Hello👋`,
      link: "",
    });
    return reply.view("success.ejs", {
      message: "Your email is successfully verified you can login now",
      token: null,
    });
    // reply.sendSuccess(
    //   "",
    //   200,
    //   "Your email is successfully verified you can login now"
    // );
  } else {
    reply.sendError("Your email is already verified please login", 409);
  }
};
export const forgotPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { email } = req.body as forgotPasswordBodySchema;
  const user = await auth.login(email);
  if (!user) {
    return reply.sendError("User not found", 404);
  } else {
    if (user.password != null) {
      const resetToken = createJWTToken(
        { email: email },
        `${parseInt(config.env.app.expiresIn)}h`
      );
      const resetLink = `${config.env.app.appUrl}/auth/reset-password/?token=${resetToken}`;
      // const info = await sendEmail(
      //   config.env.app.email,
      //   email,
      //   "Password Reset Link",
      //   `Hello👋, click the link below to reset your password`,
      //   `${resetLink}`
      // );
      dispatchEvent("user_registered", {
        fromEmail: config.env.app.email,
        toEmail: email,
        subject: "Email Verification Link",
        text: `Hello👋, click the link below to reset your password`,
        link: `${resetLink}`,
      });
      // return reply.view("success.ejs", {
      //   message: "Password reset link sent to your email",
      //   token: null,
      // });
      return reply.sendSuccess(
        "",
        200,
        "Password reset link sent to your email"
      );
    } else {
      return reply.sendError("Please login through social", 401);
    }
  }
};
export const resetPassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  const { token } = req.query as { token: string };
  const { password } = req.body as { password: string };

  if (!token) {
    return reply.sendError("Token not found", 404);
  } else {
    const decoded: any = decodeToken(reply, token);
    // Continue with your password reset logic
    const hashedPassword = await bcrypt.hash(password, 10);
    await auth.updatePassword(decoded.email, hashedPassword);
    // return reply.view("success.ejs", {
    //   message: "Password reset successful",
    //   token: null,
    // });
    return reply.sendSuccess("", 200, "Password reset successful");
  }
};
export const changePassword = async (
  req: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  let accessToken = req.cookies.accessToken;
  let decoded = await decodeToken(reply, accessToken);
  let email = decoded.email;
  const { currentPassword, password } = req.body as {
    currentPassword: string;
    password: string;
  };

  if (email) {
    const user = await auth.login(email);
    if (!user) {
      return reply.sendError("User not found", 404);
    } else {
      if (user.password === null) {
        return reply.sendError("Password is null", 401);
      }
      const validPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!validPassword) {
        return reply.sendError("Current Password is incorrect", 401);
      } else {
        const hashedNewPassword = await bcrypt.hash(password, 10);
        await auth.updatePassword(email, hashedNewPassword);
        return reply.view("success.ejs", {
          message: "Password reset successful",
          token: null,
        });
      }
    }
  } else {
    return reply.sendError("Email not found", 404);
  }
};
export const logout = (req: FastifyRequest, reply: FastifyReply) => {
  console.log(req.cookies.accessToken);
  req.logout();
  reply.clearCookie("token", { path: "/" });
  req.session.delete();
  return reply.redirect("/auth/login");
  return reply.send({
    message: "Logout Successful",
  });
};
