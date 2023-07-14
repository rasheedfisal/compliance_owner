// export interface IRole {
//     id: string;
//     role_name: string;
//     role_description: string;
//     createdAt: Date;
//     updatedAt: Date;
//     permissions?: IPermission[];
//   }
export interface IPermission {
  id: string;
  perm_name: string;
  perm_description: string;
  createdAt: Date;
  updatedAt: Date;
  RolePermission?: IRolePermission;
}
export interface IRolePermission {
  id: string;
  role_id: string;
  perm_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IToken {
  token: string;
}
export interface IPaginatedResponse<T> {
  totalItems: number;
  results: T[];
  totalPages: number;
  currentPage: number;
}

export interface IResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface ILogin {
  id: number;
  name: string;
  email: string;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  token: string;
}
export interface IRole {
  id: number;
  name: string;
}
export interface IUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: Date;
  created_at: Date;
  role: string;
  permissions: string[];
}

export interface ICreateUpdateDomain {
  name: string;
  code: number | string;
}

export interface IDomain {
  id: number;
  name: string;
  updated_at: Date;
  created_at: Date;
  code: number;
}

type IDomainFull = IDomain & { deleted_at: Date };

export interface ICreateUpdateSubDomain {
  name: string;
  code: number | string;
  domain_id: string;
}

export interface ISubDomain {
  id: number;
  name: string;
  code: number;
  domain_id: number;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}

type ISubDomainFull = ISubDomain & { domain: string; controls: number };

export interface ICreateUpdateControls {
  name: string;
  code: number | string;
  sub_domain_id: string;
}

export interface IControls {
  id: number;
  name: string;
  code: number;
  sub_domain_id: number;

  created_at: Date;
  updated_at: Date;
}

type IControlsFull = IControls & {
  "sub-domain": string;
  assesments: number;
  deleted_at: Date;
};

export interface IRegulators {
  id: number;
  name: string;
  email_domain: string;
  logo: string;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IRegulators {
  id: number;
  name: string;
  email_domain: string;
  logo: string;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}
export interface IOrganization {
  id: number;
  name: string;
  email_domain: string;
  type: string;
  code: string;
  logo: string;
  deleted_at: Date;
  created_at: Date;
  updated_at: Date;
}
