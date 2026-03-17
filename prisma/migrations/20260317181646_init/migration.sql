-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "categories" (
    "CategoryID" SERIAL NOT NULL,
    "CategoryName" VARCHAR(250) NOT NULL,
    "LogoPath" VARCHAR(250),
    "IsExpense" BOOLEAN NOT NULL,
    "IsIncome" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,
    "Sequence" DECIMAL(10,2),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "expenses" (
    "ExpenseID" SERIAL NOT NULL,
    "ExpenseDate" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER,
    "SubCategoryID" INTEGER,
    "PeopleID" INTEGER NOT NULL,
    "ProjectID" INTEGER,
    "Amount" DECIMAL(10,2) NOT NULL,
    "ExpenseDetail" VARCHAR(500),
    "AttachmentPath" VARCHAR(250),
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("ExpenseID")
);

-- CreateTable
CREATE TABLE "incomes" (
    "IncomeID" SERIAL NOT NULL,
    "IncomeDate" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER,
    "SubCategoryID" INTEGER,
    "PeopleID" INTEGER NOT NULL,
    "ProjectID" INTEGER,
    "Amount" DECIMAL(10,2) NOT NULL,
    "IncomeDetail" VARCHAR(500),
    "AttachmentPath" VARCHAR(250),
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incomes_pkey" PRIMARY KEY ("IncomeID")
);

-- CreateTable
CREATE TABLE "peoples" (
    "PeopleID" SERIAL NOT NULL,
    "PeopleCode" VARCHAR(50),
    "Password" VARCHAR(255) NOT NULL,
    "PeopleName" VARCHAR(250) NOT NULL,
    "Email" VARCHAR(150) NOT NULL,
    "MobileNo" VARCHAR(50) NOT NULL,
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,
    "IsActive" BOOLEAN,

    CONSTRAINT "peoples_pkey" PRIMARY KEY ("PeopleID")
);

-- CreateTable
CREATE TABLE "projects" (
    "ProjectID" SERIAL NOT NULL,
    "ProjectName" VARCHAR(250) NOT NULL,
    "ProjectLogo" VARCHAR(250),
    "ProjectStartDate" TIMESTAMP(3),
    "ProjectEndDate" TIMESTAMP(3),
    "ProjectDetail" VARCHAR(500),
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,
    "IsActive" BOOLEAN,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("ProjectID")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "SubCategoryID" SERIAL NOT NULL,
    "CategoryID" INTEGER NOT NULL,
    "SubCategoryName" VARCHAR(250) NOT NULL,
    "LogoPath" VARCHAR(250),
    "IsExpense" BOOLEAN NOT NULL,
    "IsIncome" BOOLEAN NOT NULL,
    "IsActive" BOOLEAN NOT NULL,
    "Description" VARCHAR(500),
    "UserID" INTEGER NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,
    "Sequence" DECIMAL(10,2),

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("SubCategoryID")
);

-- CreateTable
CREATE TABLE "users" (
    "UserID" SERIAL NOT NULL,
    "UserName" VARCHAR(250) NOT NULL,
    "Email" VARCHAR(500) NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "MobileNo" VARCHAR(50) NOT NULL,
    "Role" "Role" NOT NULL DEFAULT 'USER',
    "ProfileImage" VARCHAR(500),
    "IsActive" BOOLEAN NOT NULL,
    "Created" TIMESTAMP(3) NOT NULL,
    "Modified" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("UserID")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_Email_key" ON "users"("Email");
