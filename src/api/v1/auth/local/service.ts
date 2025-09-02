import { Response } from 'express';
import { Database } from '../../../../database';
import { ResponseService } from '../../../../utils/response';
import {
  comparePassword,
  destroyToken,
  generateToken,
  hashPassword,
} from '../../../../utils/helper';

export class AuthService {
  data: CreateUserInterface;
  token: string;
  res: Response;

  constructor(data: CreateUserInterface, res: Response, token: string) {
    this.data = data;
    this.res = res;
    this.token = token;
  }

  async citizenRegister(): Promise<void> {
    try {
      const { email, password } = this.data;

      const role = await Database.Role.findOne({ where: { name: 'citizen' }, raw: true });
      if (!role) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Default role "citizen" not found',
          res: this.res,
        });
        return;
      }
      const userExist = await Database.User.findOne({ where: { email } });
      if (userExist) {
        ResponseService({
          data: null,
          status: 409,
          success: false,
          message: 'User already exists',
          res: this.res,
        });
        return;
      }

      const user = await Database.User.create({
        email,
        password: await hashPassword(password),
        roleId: role?.id,
        isActive: true,
      });

      ResponseService({
        data: user,
        message: 'User created successfully',
        success: true,
        status: 201,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async organizationRegister(): Promise<void> {
    try {
      const { email, password } = this.data;

      const role = await Database.Role.findOne({ where: { name: 'organization' }, raw: true });
      if (!role) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Default role "organization" not found',
          res: this.res,
        });
        return;
      }
      const userExist = await Database.User.findOne({ where: { email } });
      if (userExist) {
        ResponseService({
          data: null,
          status: 409,
          success: false,
          message: 'User already exists',
          res: this.res,
        });
        return;
      }

      const user = await Database.User.create({
        email,
        password: await hashPassword(password),
        roleId: role?.id,
        isActive: true,
      });

      ResponseService({
        data: user,
        message: 'User created successfully',
        success: true,
        status: 201,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async lawFirmRegister(): Promise<void> {
    try {
      const { email, password } = this.data;

      const role = await Database.Role.findOne({ where: { name: 'law-firm' }, raw: true });
      if (!role) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Default role "law firm" not found',
          res: this.res,
        });
        return;
      }
      const userExist = await Database.User.findOne({ where: { email } });
      if (userExist) {
        ResponseService({
          data: null,
          status: 409,
          success: false,
          message: 'User already exists',
          res: this.res,
        });
        return;
      }

      const user = await Database.User.create({
        email,
        password: await hashPassword(password),
        roleId: role?.id,
        isActive: true,
      });

      ResponseService({
        data: user,
        message: 'User created successfully',
        success: true,
        status: 201,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async login(): Promise<void> {
    try {
      const { email, password } = this.data;
      const user = await Database.User.findOne({ where: { email }, raw: true });
      if (!user) {
        ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          res: this.res,
        });
        return;
      }

      const validPassword = await comparePassword(password, user.password);
      if (!validPassword) {
        ResponseService({
          data: null,
          status: 401,
          success: false,
          message: 'Invalid email or password',
          res: this.res,
        });

        return;
      }

      const token = await generateToken({ id: user.id, email: user.email, role: user.roleId });
      ResponseService({
        data: { token },
        status: 200,
        success: true,
        message: 'Login successful',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.token;

      await destroyToken(token);

      ResponseService({
        data: null,
        status: 200,
        success: true,
        message: 'Logout successful',
        res: this.res,
      });
    } catch (err) {
      const { message, stack } = err as Error;
      ResponseService({
        data: { message, stack },
        status: 500,
        success: false,
        res: this.res,
      });
    }
  }
}
