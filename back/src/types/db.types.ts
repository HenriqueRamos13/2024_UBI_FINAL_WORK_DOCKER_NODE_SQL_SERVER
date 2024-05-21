// User type
type UserType = {
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

// User Projects type
type UserProjectType = {
  id: string;
  userId: string;
  projectId: string;
  role: "responsible" | "promotor" | "copromotor" | "leader" | "participant";
  alocatedTime: number;
};

// Project type
type ProjectType = {
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
  startDate?: string; // Date in ISO format
  finishDate?: string; // Date in ISO format
  cost: number;
};

// Project Infos type
type ProjectInfoType = {
  id: string;
  projectId: string;
  projectInfoId: string;
};

// Project Info type
type ProjectInfoDetailType = {
  id: string;
  language: "pt" | "en";
  name: string;
  title: string;
  description?: string;
};

// Project Keywords type
type ProjectKeywordType = {
  id: string;
  projectId: string;
  keywordId: string;
};

// Keyword type
type KeywordType = {
  id: string;
  name: string;
};

// Project Scientific Domains type
type ProjectScientificDomainType = {
  id: string;
  projectId: string;
  cientificDomainId: string;
};

// Scientific Domain type
type ScientificDomainType = {
  id: string;
  name: string;
};

// Project Scientific Areas type
type ProjectScientificAreaType = {
  id: string;
  projectId: string;
  cientificAreaId: string;
};

// Scientific Area type
type ScientificAreaType = {
  id: string;
  name: string;
  cientificDomainId: string;
};

// Entity type
type EntityType = {
  id: string;
  name: string;
  description: string;
  acronym: string;
  address: string;
  url: string;
  country: string;
};

// Entity Contact Points type
type EntityContactPointType = {
  id: string;
  contactPointId: string;
  entityId: string;
};

// Contact Point type
type ContactPointType = {
  id: string;
  role: string;
};

// Contact Point Info type
type ContactPointInfoType = {
  id: string;
  contactPointId: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
};

// Funding type
type FundingType = {
  id: string;
  isIntern: boolean;
  value: number;
};

// Entity Fundings type
type EntityFundingType = {
  id: string;
  entityId: string;
  fundingId: string;
};

// Program type
type ProgramType = {
  id: string;
  name: string;
};

// Programs Fundings type
type ProgramFundingType = {
  id: string;
  programId: string;
  fundingId: string;
};

// Project Fundings type
type ProjectFundingType = {
  projectId: string;
  fundingId: string;
};

// Drone Parts type
type DronePartType = {
  id: string;
  name: string;
  quantity: number;
};

// Drone type
type DroneType = {
  id: string;
  userId: string;
  finish: boolean;
  createdAt: string; // Date in ISO format
};

// Drone Has Parts type
type DroneHasPartType = {
  partId: string;
  droneId: string;
};
