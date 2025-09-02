import { Response } from 'express';
import { Database } from '../../../database';
import { ResponseService } from '../../../utils/response';
import { uploadFile } from '../../../utils/upload';
import { CreateProfileInterface, GetAllProfiles, ProfileInterface, UpdateProfileInterface } from './profiles';
import { errorLogger } from '../../../utils/logger';

export class ProfileService {
  data: ProfileInterface | CreateProfileInterface | UpdateProfileInterface;
  userId: string;
  dataId: string;
  file: Express.Multer.File;
  res: Response;

  constructor(
    data: ProfileInterface | CreateProfileInterface | UpdateProfileInterface,
    userId: string,
    dataId: string,
    file: Express.Multer.File,
    res: Response,
  ) {
    this.data = data;
    this.userId = userId;
    this.dataId = dataId;
    this.file = file;
    this.res = res;
  }

  private async profileExist(): Promise<{ exists: boolean; error?: unknown }> {
    try {
      const profile = await Database.Profile.findOne({ where: { id: this.dataId }, raw: true });
      if (!profile) {
        return { exists: false };
      } else {
        return { exists: true };
      }
    } catch (error) {
      return { exists: false, error };
    }
  }

  private async getUserRole(userId: string): Promise<string | null> {
    try {
      const user = await Database.User.findOne({
        where: { id: userId },
        include: [
          {
            model: Database.Role,
            as: 'role',
            attributes: ['name'],
          },
        ],
        raw: true,
        nest: true,
      });
      return user?.name || null;
    } catch (error) {
      errorLogger(error as Error, 'User exists error');
      return null;
    }
  }

  async create(): Promise<unknown> {
    try {
      const user = await Database.User.findOne({ where: { id: this.userId }, raw: true });
      if (!user) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          res: this.res,
        });
      }

      // Check if profile already exists for this user
      const existingProfile = await Database.Profile.findOne({ where: { userId: this.userId } });
      if (existingProfile) {
        return ResponseService({
          data: null,
          status: 409,
          success: false,
          message: 'Profile already exists for this user',
          res: this.res,
        });
      }

      const userRole = await this.getUserRole(this.userId);
      if (!userRole) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'User role not found',
          res: this.res,
        });
      }

      let imageUrl: string = '';
      if (this.file) {
        try {
          imageUrl = await uploadFile(this.file as Express.Multer.File);
        } catch (error) {
          const { message, stack } = error as Error;
          return ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res: this.res,
          });
        }
      }

      const profileData = { ...this.data } as CreateProfileInterface;
      if (imageUrl) {
        profileData.imageUrl = imageUrl;
      }

      const profile = await Database.Profile.create({
        ...profileData,
        userId: this.userId,
        userRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return ResponseService({
        data: profile,
        status: 201,
        success: true,
        message: 'Profile successfully created',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findAll(): Promise<unknown> {
    try {
      const profiles = await Database.Profile.findAll({
        include: [
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'email'],
            include: [
              {
                model: Database.Role,
                as: 'role',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });

      if (!profiles || profiles.length === 0) {
        return ResponseService<GetAllProfiles[]>({
          data: [],
          status: 200,
          success: true,
          message: 'No profiles found',
          res: this.res,
        });
      }

      return ResponseService({
        data: profiles,
        status: 200,
        message: 'Profiles successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findCitizenProfiles(): Promise<unknown> {
    try {
      const profiles = await Database.Profile.findAll({
        where: { userRole: 'citizen' },
        include: [
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'email', 'username'],
          },
        ],
      });

      if (!profiles || profiles.length === 0) {
        return ResponseService<GetAllProfiles[]>({
          data: [],
          status: 200,
          success: true,
          message: 'No citizen profiles found',
          res: this.res,
        });
      }

      return ResponseService({
        data: profiles,
        status: 200,
        message: 'Citizen profiles successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findOrganizationProfiles(): Promise<unknown> {
    try {
      const profiles = await Database.Profile.findAll({
        where: { userRole: 'organization' },
        include: [
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'email', 'address'],
          },
        ],
      });

      if (!profiles || profiles.length === 0) {
        return ResponseService<GetAllProfiles[]>({
          data: [],
          status: 200,
          success: true,
          message: 'No organization profiles found',
          res: this.res,
        });
      }

      return ResponseService({
        data: profiles,
        status: 200,
        message: 'Organization profiles successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findLawFirmProfiles(): Promise<unknown> {
    try {
      const profiles = await Database.Profile.findAll({
        where: { userRole: 'law-firm' },
        include: [
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'email', 'address'],
          },
        ],
      });

      if (!profiles || profiles.length === 0) {
        return ResponseService<GetAllProfiles[]>({
          data: [],
          status: 200,
          success: true,
          message: 'No law firm profiles found',
          res: this.res,
        });
      }

      return ResponseService({
        data: profiles,
        status: 200,
        message: 'Law firm profiles successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async findOne(): Promise<unknown> {
    try {
      const profileCheck = await this.profileExist();

      if (profileCheck.error) {
        const { message, stack } = profileCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!profileCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Profile not found',
          res: this.res,
        });
      }

      const profile = await Database.Profile.findOne({
        where: { id: this.dataId },
        include: [
          {
            model: Database.User,
            as: 'user',
            attributes: ['id', 'email', 'username', 'address'],
            include: [
              {
                model: Database.Role,
                as: 'role',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      });

      return ResponseService({
        data: profile,
        status: 200,
        message: 'Profile successfully retrieved',
        success: true,
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async update(): Promise<unknown> {
    try {
      const profileCheck = await this.profileExist();
      if (profileCheck.error) {
        const { message, stack } = profileCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }
      if (!profileCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Profile not found',
          res: this.res,
        });
      }

      let imageUrl: string = '';
      if (this.file) {
        try {
          imageUrl = await uploadFile(this.file as Express.Multer.File);
        } catch (error) {
          const { message, stack } = error as Error;
          return ResponseService({
            data: { message, stack },
            status: 500,
            success: false,
            res: this.res,
          });
        }
      }

      const updateData: UpdateProfileInterface = { ...this.data };
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      const updatedProfile = await Database.Profile.update(
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { where: { id: this.dataId } },
      );

      return ResponseService({
        data: updatedProfile,
        success: true,
        status: 200,
        message: 'Profile successfully updated',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }

  async delete(): Promise<unknown> {
    try {
      const profileCheck = await this.profileExist();

      if (profileCheck.error) {
        const { message, stack } = profileCheck.error as Error;
        return ResponseService({
          data: { message, stack },
          success: false,
          status: 500,
          res: this.res,
        });
      }

      if (!profileCheck.exists) {
        return ResponseService({
          data: null,
          status: 404,
          success: false,
          message: 'Profile not found',
          res: this.res,
        });
      }

      const deletedProfile = await Database.Profile.destroy({ where: { id: this.dataId } });

      return ResponseService({
        data: deletedProfile,
        success: true,
        status: 200,
        message: 'Profile successfully deleted',
        res: this.res,
      });
    } catch (error) {
      const { message, stack } = error as Error;
      return ResponseService({
        data: { message, stack },
        success: false,
        status: 500,
        res: this.res,
      });
    }
  }
}