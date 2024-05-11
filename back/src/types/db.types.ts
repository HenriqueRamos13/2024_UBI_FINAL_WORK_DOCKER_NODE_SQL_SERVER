export type TypeUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  contact?: string;
  employeeId?: string;
  orcid?: string;
  role: "admin" | "project_creator" | "user";
  recoverPasswordToken?: string;
};

export type TypeUserProjects = {
  id: string;
  userId: string;
  projectId: string;
  role: "responsible" | "promotor" | "copromotor" | "leader" | "participant";
  allocatedTime: number;
};

export type TypeProject = {
  id: string;
  type: "intern" | "funded" | "contract";
  status:
    | "approved"
    | "canceled"
    | "finished"
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

export type TypeProjectInfos = {
  id: string;
  projectId: string;
  projectInfoId: string;
};

export type TypeProjectInfo = {
  id: string;
  language: "pt" | "en";
  name: string;
  title: string;
  description?: string;
};

export type TypeProjectKeywords = {
  id: string;
  projectId: string;
  keywordId: string;
};

export type TypeKeywords = {
  id: string;
  name: string;
};

export type TypeProjectScientificDomains = {
  id: string;
  projectId: string;
  scientificDomainId: string;
};

export type TypeScientificDomain = {
  id: string;
  name: string;
};

export type TypeProjectScientificAreas = {
  id: string;
  projectId: string;
  scientificAreaId: string;
};

export type TypeScientificArea = {
  id: string;
  name: string;
  scientificDomainId: string;
};

export type TypeEntity = {
  id: string;
  name: string;
  description: string;
  acronym: string;
  address: string;
  url: string;
  country: string;
};

export type TypeEntityContactPoints = {
  id: string;
  contactPointId: string;
  entityId: string;
};

export type TypeContactPoint = {
  id: string;
  role: string;
};

export type TypeContactPointInfo = {
  id: string;
  contactPointId: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
};

export type TypeFunding = {
  id: string;
  isIntern: boolean;
  value: number;
};

export type TypeEntityFundings = {
  id: string;
  entityId: string;
  fundingId: string;
};

export type TypeProgram = {
  id: string;
  name: string;
};

export type TypeProgramsFundings = {
  id: string;
  programId: string;
  fundingId: string;
};

export type TypeProjectFundings = {
  projectId: string;
  fundingId: string;
};

export type TypeDroneParts = {
  id: string;
  name: string;
  quantity: number;
};

export type TypeDrone = {
  id: string;
  userId: string;
  finish: boolean;
  createdAt: Date;
};

export type TypeDroneHasParts = {
  partId: string;
  droneId: string;
};
