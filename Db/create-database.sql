CREATE DATABASE [database]
GO

USE [database];
GO

-- Creating USER table
CREATE TABLE [user] (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    contact NVARCHAR(255),
    employeeId NVARCHAR(255),
    orcid NVARCHAR(255),
    role NVARCHAR(255) NOT NULL CHECK (role IN ('admin', 'project_creator', 'user')),
    recoverPasswordToken NVARCHAR(255)
);
GO

-- Creating USER_PROJECTS table
CREATE TABLE user_projects (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES [user](id),
    projectId UNIQUEIDENTIFIER NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('responsible', 'promotor', 'copromotor', 'leader', 'participant')),
    alocatedTime INT NOT NULL
);
GO

-- Creating PROJECT table
CREATE TABLE project (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    type NVARCHAR(50) NOT NULL CHECK (type IN ('intern', 'funded', 'contract')),
    status NVARCHAR(50) NOT NULL CHECK (status IN ('approved', 'canceled', 'finishied', 'ongoing', 'closed', 'renovated', 'submitting')),
    competitiveFinancial BIT NOT NULL,
    isNational BIT NOT NULL,
    isIntern BIT NOT NULL,
    url NVARCHAR(255),
    doi NVARCHAR(255),
    startDate DATE,
    finishDate DATE,
    cost FLOAT NOT NULL
);
GO

-- Creating PROJECT_INFOS table
CREATE TABLE project_infos (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    projectInfoId UNIQUEIDENTIFIER NOT NULL
);
GO

-- Creating PROJECT_INFO table
CREATE TABLE project_info (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    language NVARCHAR(50) NOT NULL CHECK (language IN ('pt', 'en')),
    name NVARCHAR(255) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX)
);
GO

-- Creating PROJECT_KEYWORDS table
CREATE TABLE project_keywords (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    keywordId UNIQUEIDENTIFIER NOT NULL
);
GO

-- Creating KEYWORDS table
CREATE TABLE keywords (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

-- Creating PROJECT_SCIENTIFIC_DOMAINS table
CREATE TABLE project_scientific_domains (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    cientificDomainId UNIQUEIDENTIFIER NOT NULL
);
GO

-- Creating SCIENTIFIC_DOMAIN table
CREATE TABLE cientific_domain (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

-- Creating PROJECT_SCIENTIFIC_AREAS table
CREATE TABLE project_scientific_areas (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    cientificAreaId UNIQUEIDENTIFIER NOT NULL
);
GO

-- Creating SCIENTIFIC_AREA table
CREATE TABLE cientific_area (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    cientificDomainId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES cientific_domain(id)
);
GO

-- Creating ENTITY table
CREATE TABLE entity (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    acronym NVARCHAR(255) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    url NVARCHAR(255) NOT NULL,
    country NVARCHAR(255) NOT NULL
);
GO

-- Creating ENTITY_CONTACT_POINTS table
CREATE TABLE entity_contact_points (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contactPointId UNIQUEIDENTIFIER NOT NULL,
    entityId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES entity(id)
);
GO

-- Creating CONTACT_POINT table
CREATE TABLE contact_point (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role NVARCHAR(255) NOT NULL
);
GO

-- Creating CONTACT_POINT_INFO table
CREATE TABLE contact_point_info (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contactPointId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES contact_point(id),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(255),
    designation NVARCHAR(255)
);
GO

-- Creating FUNDING table
CREATE TABLE funding (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    isIntern BIT NOT NULL,
    value FLOAT NOT NULL
);
GO

-- Creating ENTITY_FUNDINGS table
CREATE TABLE entity_fundings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    entityId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES entity(id),
    fundingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES funding(id)
);
GO

-- Creating PROGRAM table
CREATE TABLE program (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

-- Creating PROGRAMS_FUNDINGS table
CREATE TABLE programs_fundings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    programId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES program(id),
    fundingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES funding(id)
);
GO

-- Creating PROJECT_FUNDINGS table
CREATE TABLE project_fundings (
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    fundingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES funding(id)
);
GO