CREATE DATABASE [database]
GO

USE [database];
GO

-- Programaçao no servidor

CREATE TABLE company (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE INDEX idx_company_name ON company(name);

-- DB

CREATE TABLE [user] (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    contact NVARCHAR(255),
    employeeId NVARCHAR(255),
    orcid NVARCHAR(255),
    role NVARCHAR(255) NOT NULL CHECK (role IN ('admin', 'project_creator', 'user')),
    recoverPasswordToken NVARCHAR(255),
    companyId UNIQUEIDENTIFIER,
    FOREIGN KEY (companyId) REFERENCES company(id) ON DELETE SET NULL,
    UNIQUE (email)
);
GO

CREATE INDEX idx_user_email ON [user](email);
CREATE INDEX idx_user_name ON [user](name);
CREATE INDEX idx_user_companyId ON [user](companyId);


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

CREATE INDEX idx_project_type ON project(type);
CREATE INDEX idx_project_status ON project(status);
CREATE INDEX idx_project_startDate ON project(startDate);
CREATE INDEX idx_project_finishDate ON project(finishDate);


CREATE TABLE user_projects (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL,
    projectId UNIQUEIDENTIFIER NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('responsible', 'promotor', 'copromotor', 'leader', 'participant')),
    alocatedTime INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES [user](id) ON DELETE CASCADE,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_user_projects_userId ON user_projects(userId);
CREATE INDEX idx_user_projects_projectId ON user_projects(projectId);


CREATE TABLE project_info (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    language NVARCHAR(50) NOT NULL CHECK (language IN ('pt', 'en')),
    name NVARCHAR(255) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX)
);
GO

CREATE INDEX idx_project_info_language ON project_info(language);
CREATE INDEX idx_project_info_name ON project_info(name);
CREATE INDEX idx_project_info_title ON project_info(title);

CREATE TABLE project_infos (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL,
    projectInfoId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (projectInfoId) REFERENCES project_info(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project_infos_projectId ON project_infos(projectId);


CREATE TABLE keywords (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE INDEX idx_keywords_name ON keywords(name);

CREATE TABLE project_keywords (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL,
    keywordId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (keywordId) REFERENCES keywords(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project_keywords_projectId ON project_keywords(projectId);


CREATE TABLE cientific_domain (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE INDEX idx_cientific_domain_name ON cientific_domain(name);

CREATE TABLE project_scientific_domains (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL,
    cientificDomainId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (cientificDomainId) REFERENCES cientific_domain(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project_scientific_domains_projectId ON project_scientific_domains(projectId);


CREATE TABLE cientific_area (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    cientificDomainId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (cientificDomainId) REFERENCES cientific_domain(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_cientific_area_name ON cientific_area(name);
CREATE INDEX idx_cientific_area_cientificDomainId ON cientific_area(cientificDomainId);

CREATE TABLE project_scientific_areas (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL,
    cientificAreaId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (cientificAreaId) REFERENCES cientific_area(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project_scientific_areas_projectId ON project_scientific_areas(projectId);

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

CREATE INDEX idx_entity_name ON entity(name);
CREATE INDEX idx_entity_acronym ON entity(acronym);


CREATE TABLE contact_point (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role NVARCHAR(255) NOT NULL
);
GO

CREATE INDEX idx_contact_point_role ON contact_point(role);

CREATE TABLE entity_contact_points (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contactPointId UNIQUEIDENTIFIER NOT NULL,
    entityId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (entityId) REFERENCES entity(id) ON DELETE CASCADE,
    FOREIGN KEY (contactPointId) REFERENCES contact_point(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_entity_contact_points_entityId ON entity_contact_points(entityId);

CREATE TABLE contact_point_info (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contactPointId UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(255),
    designation NVARCHAR(255),
    FOREIGN KEY (contactPointId) REFERENCES contact_point(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_contact_point_info_contactPointId ON contact_point_info(contactPointId);

CREATE TABLE funding (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    isIntern BIT NOT NULL,
    value FLOAT NOT NULL
);
GO

CREATE INDEX idx_funding_isIntern ON funding(isIntern);

CREATE TABLE entity_fundings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    entityId UNIQUEIDENTIFIER NOT NULL,
    fundingId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (entityId) REFERENCES entity(id) ON DELETE CASCADE,
    FOREIGN KEY (fundingId) REFERENCES funding(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_entity_fundings_entityId ON entity_fundings(entityId);

CREATE TABLE program (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE INDEX idx_program_name ON program(name);

CREATE TABLE programs_fundings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    programId UNIQUEIDENTIFIER NOT NULL,
    fundingId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (programId) REFERENCES program(id) ON DELETE CASCADE,
    FOREIGN KEY (fundingId) REFERENCES funding(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_programs_fundings_programId ON programs_fundings(programId);

CREATE TABLE project_fundings (
    projectId UNIQUEIDENTIFIER NOT NULL,
    fundingId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (fundingId) REFERENCES funding(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_project_fundings_projectId ON project_fundings(projectId);

-- Programaçao no servidor

CREATE TABLE drone_parts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    companyId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (companyId) REFERENCES company(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_drone_parts_companyId ON drone_parts(companyId);

CREATE TABLE drone (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL,
    finish BIT NOT NULL DEFAULT 0,
    createdAt DATE NOT NULL,
    companyId UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (userId) REFERENCES [user](id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_drone_companyId ON drone(companyId);

CREATE TABLE drone_has_parts (
    partId UNIQUEIDENTIFIER NOT NULL,
    droneId UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (partId, droneId),
    FOREIGN KEY (partId) REFERENCES drone_parts(id) ON DELETE CASCADE,
    FOREIGN KEY (droneId) REFERENCES drone(id) ON DELETE CASCADE
);
GO

CREATE INDEX idx_drone_has_parts_partId ON drone_has_parts(partId);
CREATE INDEX idx_drone_has_parts_droneId ON drone_has_parts(droneId);






CREATE TRIGGER trg_after_insert_drone_has_parts
ON drone_has_parts
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dp
    SET dp.quantity = dp.quantity - 1
    FROM drone_parts dp
    INNER JOIN inserted i ON dp.id = i.partId
    WHERE dp.id = i.partId;
END;
GO



CREATE TRIGGER trg_after_delete_drone_has_parts
ON drone_has_parts
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dp
    SET dp.quantity = dp.quantity + 1
    FROM drone_parts dp
    INNER JOIN deleted d ON dp.id = d.partId
    WHERE dp.id = d.partId;
END;
GO
