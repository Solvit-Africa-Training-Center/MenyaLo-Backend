import { IRequestUser } from '../../../middleware/unifiedAuthMiddleware';

interface ProfileInterface {
  id: string;
  userId: string;
  userRole: string;
  name: string;
  bio?: string;
  occupation?: string;
  imageUrl?: string;
  website?: string;
  phoneNumber?: string;
  teamSize?: number;
  yearsOfExperience?: number;
  caseResolved?: number;
  successRate?: number;
  establishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: null;
}

type CreateCitizenProfileInterface = {
  name: string;
  occupation?: string;
  bio?: string;
  phoneNumber?: string;
  imageUrl?: string;
};

type CreateOrganizationProfileInterface = {
  name: string;
  imageUrl?: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
  teamSize?: number;
  yearsOfExperience?: number;
  establishedAt?: Date;
};

type CreateLawFirmProfileInterface = {
  name: string;
  imageUrl?: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
  teamSize?: number;
  yearsOfExperience?: number;
  caseResolved?: number;
  successRate?: number;
  establishedAt?: Date;
};

type CreateProfileInterface = CreateCitizenProfileInterface | CreateOrganizationProfileInterface | CreateLawFirmProfileInterface;

type UpdateCitizenProfileInterface = Partial<CreateCitizenProfileInterface>;
type UpdateOrganizationProfileInterface = Partial<CreateOrganizationProfileInterface>;
type UpdateLawFirmProfileInterface = Partial<CreateLawFirmProfileInterface>;

type UpdateProfileInterface = UpdateCitizenProfileInterface | UpdateOrganizationProfileInterface | UpdateLawFirmProfileInterface;

interface GetAllProfiles {
  profiles: ProfileInterface[];
}

interface ProfileRequestInterface extends IRequestUser {
  body: CreateProfileInterface;
  params: {
    id: string;
  };
  file?: Express.Multer.File;
}

interface UpdateProfileRequestInterface extends IRequestUser {
  body: UpdateProfileInterface;
  params: {
    id: string;
  };
  file?: Express.Multer.File;
}

export {
  ProfileInterface,
  CreateCitizenProfileInterface,
  CreateOrganizationProfileInterface,
  CreateLawFirmProfileInterface,
  CreateProfileInterface,
  UpdateCitizenProfileInterface,
  UpdateOrganizationProfileInterface,
  UpdateLawFirmProfileInterface,
  UpdateProfileInterface,
  GetAllProfiles,
  ProfileRequestInterface,
  UpdateProfileRequestInterface,
};