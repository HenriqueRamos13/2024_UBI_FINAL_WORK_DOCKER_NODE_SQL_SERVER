export type CompanyType = {
  id: string;
  name: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  password: string;
  contact?: string;
  employeeId?: string;
  orcid?: string;
  role: "admin" | "project_creator" | "user";
  recoverPasswordToken?: string;
  companyId?: string;
};

export type UserProjectType = {
  id: string;
  userId: string;
  projectId: string;
  role: "responsible" | "promotor" | "copromotor" | "leader" | "participant";
  alocatedTime: number;
};

export type ProjectType = {
  id: string;
  type: "intern" | "funded" | "contract";
  status:
    | "approved"
    | "canceled"
    | "finishied"
    | "ongoing"
    | "closed"
    | "renovated"
    | "submitting";
  competitiveFinancial: boolean;
  isNational: boolean;
  isIntern: boolean;
  url?: string;
  doi?: string;
  startDate?: Date;
  finishDate?: Date;
  cost: number;
};

export type ProjectInfoType = {
  id: string;
  projectId: string;
  projectInfoId: string;
};

export type ProjectInformationType = {
  id: string;
  language: "pt" | "en";
  name: string;
  title: string;
  description?: string;
};

export type ProjectKeywordType = {
  id: string;
  projectId: string;
  keywordId: string;
};

export type KeywordType = {
  id: string;
  name: string;
};

export type ProjectScientificDomainType = {
  id: string;
  projectId: string;
  cientificDomainId: string;
};

export type ScientificDomainType = {
  id: string;
  name: string;
};

export type ProjectScientificAreaType = {
  id: string;
  projectId: string;
  cientificAreaId: string;
};

export type ScientificAreaType = {
  id: string;
  name: string;
  cientificDomainId: string;
};

export type EntityType = {
  id: string;
  name: string;
  description: string;
  acronym: string;
  address: string;
  url: string;
  country: string;
};

export type EntityContactPointType = {
  id: string;
  contactPointId: string;
  entityId: string;
};

export type ContactPointType = {
  id: string;
  role: string;
};

export type ContactPointInfoType = {
  id: string;
  contactPointId: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
};

export type FundingType = {
  id: string;
  isIntern: boolean;
  value: number;
};

export type EntityFundingType = {
  id: string;
  entityId: string;
  fundingId: string;
};

export type ProgramType = {
  id: string;
  name: string;
};

export type ProgramFundingType = {
  id: string;
  programId: string;
  fundingId: string;
};

export type ProjectFundingType = {
  projectId: string;
  fundingId: string;
};

export type DronePartType = {
  id: string;
  name: string;
  quantity: number;
  companyId: string;
};

export type DroneType = {
  id: string;
  userId: string;
  finish: boolean;
  createdAt: Date;
  companyId: string;
};

export type DroneHasPartType = {
  partId: string;
  droneId: string;
};
