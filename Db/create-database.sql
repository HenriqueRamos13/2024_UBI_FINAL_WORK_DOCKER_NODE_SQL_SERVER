CREATE DATABASE [database]
GO

USE [database];
GO

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

CREATE TABLE user_projects (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES [user](id),
    projectId UNIQUEIDENTIFIER NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('responsible', 'promotor', 'copromotor', 'leader', 'participant')),
    alocatedTime INT NOT NULL
);
GO

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

CREATE TABLE project_infos (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    projectInfoId UNIQUEIDENTIFIER NOT NULL
);
GO

CREATE TABLE project_info (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    language NVARCHAR(50) NOT NULL CHECK (language IN ('pt', 'en')),
    name NVARCHAR(255) NOT NULL,
    title NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX)
);
GO

CREATE TABLE project_keywords (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    keywordId UNIQUEIDENTIFIER NOT NULL
);
GO

CREATE TABLE keywords (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE TABLE project_scientific_domains (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    cientificDomainId UNIQUEIDENTIFIER NOT NULL
);
GO

CREATE TABLE cientific_domain (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE TABLE project_scientific_areas (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    cientificAreaId UNIQUEIDENTIFIER NOT NULL
);
GO

CREATE TABLE cientific_area (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    cientificDomainId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES cientific_domain(id)
);
GO

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

CREATE TABLE entity_contact_points (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contactPointId UNIQUEIDENTIFIER NOT NULL,
    entityId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES entity(id)
);
GO

CREATE TABLE contact_point (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    role NVARCHAR(255) NOT NULL
);
GO

CREATE TABLE contact_point_info (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    contactPointId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES contact_point(id),
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    phone NVARCHAR(255),
    designation NVARCHAR(255)
);
GO

CREATE TABLE funding (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    isIntern BIT NOT NULL,
    value FLOAT NOT NULL
);
GO

CREATE TABLE entity_fundings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    entityId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES entity(id),
    fundingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES funding(id)
);
GO

CREATE TABLE program (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL
);
GO

CREATE TABLE programs_fundings (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    programId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES program(id),
    fundingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES funding(id)
);
GO

CREATE TABLE project_fundings (
    projectId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES project(id),
    fundingId UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES funding(id)
);
GO


-- Programaçao no servidor

CREATE TABLE drone_parts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0
);
GO

CREATE TABLE drone (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES [user](id),
    finish BIT NOT NULL DEFAULT 0,  -- Usando BIT para boolean
    created_at DATE NOT NULL
);
GO

CREATE TABLE drone_has_parts (
    part_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES drone_parts(id),
    drone_id UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES drone(id),
    PRIMARY KEY (part_id, drone_id)
);
GO





-- seed

-- Insert Users
INSERT INTO [user] (name, email, password, role)
VALUES
    ('Henrique Marques', 'henrique.mrcr@gmail.com', '123456789', 'admin'),
    ('Professor X', 'professor@gmail.com', '123456789', 'project_creator'),
    ('Alice Johnson', 'alice.johnson@example.com', 'password123', 'user'),
    ('Bob Smith', 'bob.smith@example.com', 'password123', 'user');

-- Get User IDs
DECLARE @UserId1 UNIQUEIDENTIFIER = (SELECT id FROM [user] WHERE email = 'henrique.mrcr@gmail.com');
DECLARE @UserId2 UNIQUEIDENTIFIER = (SELECT id FROM [user] WHERE email = 'professor@gmail.com');
DECLARE @UserId3 UNIQUEIDENTIFIER = (SELECT id FROM [user] WHERE email = 'alice.johnson@example.com');
DECLARE @UserId4 UNIQUEIDENTIFIER = (SELECT id FROM [user] WHERE email = 'bob.smith@example.com');

-- Insert Projects
INSERT INTO project (type, status, competitiveFinancial, isNational, isIntern, cost)
VALUES
    ('funded', 'ongoing', 1, 1, 0, 20000),
    ('intern', 'approved', 0, 0, 1, 15000),
    ('contract', 'submitting', 1, 1, 0, 30000),
    ('funded', 'closed', 0, 1, 1, 50000);

-- Get Project IDs
DECLARE @ProjectId1 UNIQUEIDENTIFIER = (SELECT id FROM project WHERE cost = 20000);
DECLARE @ProjectId2 UNIQUEIDENTIFIER = (SELECT id FROM project WHERE cost = 15000);
DECLARE @ProjectId3 UNIQUEIDENTIFIER = (SELECT id FROM project WHERE cost = 30000);
DECLARE @ProjectId4 UNIQUEIDENTIFIER = (SELECT id FROM project WHERE cost = 50000);

-- Link Users to Projects
INSERT INTO user_projects (userId, projectId, role, alocatedTime)
VALUES
    (@UserId1, @ProjectId1, 'leader', 50),
    (@UserId2, @ProjectId2, 'participant', 70),
    (@UserId3, @ProjectId1, 'copromotor', 22),
    (@UserId4, @ProjectId2, 'responsible', 32),
    (@UserId3, @ProjectId3, 'leader', 100),
    (@UserId4, @ProjectId4, 'promotor', 100);

-- Project Info
INSERT INTO project_info (language, name, title, description)
VALUES
    ('en', 'Drone Project', 'Aerial Mapping Drone', 'A project to develop an aerial mapping drone.'),
    ('pt', 'AI Research', 'Advanced AI Algorithms', 'A project focused on creating advanced AI algorithms.'),
    ('en', 'Renewable Energy', 'Solar Energy Development', 'A project to develop efficient solar panels.'),
    ('pt', 'Space Exploration', 'Mars Habitat', 'Exploring the possibilities of a habitat on Mars.');

-- Link Project Info to Projects
INSERT INTO project_infos (projectId, projectInfoId)
VALUES
    (@ProjectId1, (SELECT id FROM project_info WHERE name = 'Drone Project')),
    (@ProjectId2, (SELECT id FROM project_info WHERE name = 'AI Research')),
    (@ProjectId3, (SELECT id FROM project_info WHERE name = 'Renewable Energy')),
    (@ProjectId4, (SELECT id FROM project_info WHERE name = 'Space Exploration'));

-- Drones
INSERT INTO drone (user_id, finish, created_at)
VALUES
    (@UserId1, 0, GETDATE()),
    (@UserId2, 0, GETDATE());

-- Get Drone IDs
DECLARE @DroneId1 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM drone ORDER BY NEWID());
DECLARE @DroneId2 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM drone ORDER BY NEWID() DESC);

-- Drone Parts
INSERT INTO drone_parts (name, quantity)
VALUES
    ('Propeller', 8),
    ('Camera', 4),
    ('Battery', 10);

-- Get Part IDs
DECLARE @PartId1 UNIQUEIDENTIFIER = (SELECT id FROM drone_parts WHERE name = 'Propeller');
DECLARE @PartId2 UNIQUEIDENTIFIER = (SELECT id FROM drone_parts WHERE name = 'Camera');
DECLARE @PartId3 UNIQUEIDENTIFIER = (SELECT id FROM drone_parts WHERE name = 'Battery');

-- Link Parts to Drones
INSERT INTO drone_has_parts (part_id, drone_id)
VALUES
    (@PartId1, @DroneId1),
    (@PartId2, @DroneId1),
    (@PartId3, @DroneId1),
    (@PartId1, @DroneId2),
    (@PartId2, @DroneId2),
    (@PartId3, @DroneId2);

-- Insert Keywords
INSERT INTO keywords (name)
VALUES
    ('Technology'),
    ('Innovation'),
    ('Renewable Energy');

-- Get Keyword IDs
DECLARE @KeywordId1 UNIQUEIDENTIFIER = (SELECT id FROM keywords WHERE name = 'Technology');
DECLARE @KeywordId2 UNIQUEIDENTIFIER = (SELECT id FROM keywords WHERE name = 'Innovation');
DECLARE @KeywordId3 UNIQUEIDENTIFIER = (SELECT id FROM keywords WHERE name = 'Renewable Energy');

-- Link Keywords to Projects
INSERT INTO project_keywords (projectId, keywordId)
VALUES
    (@ProjectId1, @KeywordId1),
    (@ProjectId2, @KeywordId2),
    (@ProjectId3, @KeywordId3);

-- Insert Scientific Domains
INSERT INTO cientific_domain (name)
VALUES
    ('Engineering'),
    ('Physics'),
    ('Biology');

-- Get Scientific Domain IDs
DECLARE @DomainId1 UNIQUEIDENTIFIER = (SELECT id FROM cientific_domain WHERE name = 'Engineering');
DECLARE @DomainId2 UNIQUEIDENTIFIER = (SELECT id FROM cientific_domain WHERE name = 'Physics');
DECLARE @DomainId3 UNIQUEIDENTIFIER = (SELECT id FROM cientific_domain WHERE name = 'Biology');

-- Link Scientific Domains to Projects
INSERT INTO project_scientific_domains (projectId, cientificDomainId)
VALUES
    (@ProjectId1, @DomainId1),
    (@ProjectId2, @DomainId2),
    (@ProjectId3, @DomainId3);

-- Insert Scientific Areas
INSERT INTO cientific_area (name, cientificDomainId)
VALUES
    ('Robotics', @DomainId1),
    ('Quantum Mechanics', @DomainId2),
    ('Genetics', @DomainId3);

-- Get Scientific Area IDs
DECLARE @AreaId1 UNIQUEIDENTIFIER = (SELECT id FROM cientific_area WHERE name = 'Robotics');
DECLARE @AreaId2 UNIQUEIDENTIFIER = (SELECT id FROM cientific_area WHERE name = 'Quantum Mechanics');
DECLARE @AreaId3 UNIQUEIDENTIFIER = (SELECT id FROM cientific_area WHERE name = 'Genetics');

-- Link Scientific Areas to Projects
INSERT INTO project_scientific_areas (projectId, cientificAreaId)
VALUES
    (@ProjectId1, @AreaId1),
    (@ProjectId2, @AreaId2),
    (@ProjectId3, @AreaId3);

-- Insert Entities
INSERT INTO entity (name, description, acronym, address, url, country)
VALUES
    ('Tech Innovations Inc.', 'A company dedicated to innovative technology solutions.', 'TII', '123 Tech Way, Innovation City', 'http://techinnovations.com', 'USA'),
    ('Quantum Research Lab', 'A leading research facility in quantum physics.', 'QRL', '456 Quantum Rd, Physics Town', 'http://quantumlab.com', 'Germany');

-- Get Entity IDs
DECLARE @EntityId1 UNIQUEIDENTIFIER = (SELECT id FROM entity WHERE acronym = 'TII');
DECLARE @EntityId2 UNIQUEIDENTIFIER = (SELECT id FROM entity WHERE acronym = 'QRL');

-- Insert Fundings
INSERT INTO funding (isIntern, value)
VALUES
    (0, 500000),
    (1, 200000);

-- Get Funding IDs
DECLARE @FundingId1 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM funding ORDER BY NEWID());
DECLARE @FundingId2 UNIQUEIDENTIFIER = (SELECT TOP 1 id FROM funding ORDER BY NEWID() DESC);

-- Link Entities to Fundings
INSERT INTO entity_fundings (entityId, fundingId)
VALUES
    (@EntityId1, @FundingId1),
    (@EntityId2, @FundingId2);

-- Insert Programs
INSERT INTO program (name)
VALUES
    ('Innovation Grant'),
    ('International Physics Symposium');

-- Get Program IDs
DECLARE @ProgramId1 UNIQUEIDENTIFIER = (SELECT id FROM program WHERE name = 'Innovation Grant');
DECLARE @ProgramId2 UNIQUEIDENTIFIER = (SELECT id FROM program WHERE name = 'International Physics Symposium');

-- Link Programs to Fundings
INSERT INTO programs_fundings (programId, fundingId)
VALUES
    (@ProgramId1, @FundingId1),
    (@ProgramId2, @FundingId2);

-- Link Projects to Fundings
INSERT INTO project_fundings (projectId, fundingId)
VALUES
    (@ProjectId1, @FundingId1),
    (@ProjectId2, @FundingId2);

-- Insert Contact Points
INSERT INTO contact_point (role)
VALUES
    ('Technical Support'),
    ('Customer Service');

-- Get Contact Point IDs
DECLARE @ContactPointId1 UNIQUEIDENTIFIER = (SELECT id FROM contact_point WHERE role = 'Technical Support');
DECLARE @ContactPointId2 UNIQUEIDENTIFIER = (SELECT id FROM contact_point WHERE role = 'Customer Service');

-- Insert Contact Point Info
INSERT INTO contact_point_info (contactPointId, name, email, phone, designation)
VALUES
    (@ContactPointId1, 'John Doe', 'john.doe@techinnovations.com', '123-456-7890', 'Tech Support Lead'),
    (@ContactPointId2, 'Jane Doe', 'jane.doe@quantumlab.com', '098-765-4321', 'Customer Service Manager');

-- Link Contact Points to Entities
INSERT INTO entity_contact_points (entityId, contactPointId)
VALUES
    (@EntityId1, @ContactPointId1),
    (@EntityId2, @ContactPointId2);

GO