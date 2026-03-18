-- CreateTable
CREATE TABLE "_ProjectAssignments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProjectAssignments_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectAssignments_B_index" ON "_ProjectAssignments"("B");

-- AddForeignKey
ALTER TABLE "_ProjectAssignments" ADD CONSTRAINT "_ProjectAssignments_A_fkey" FOREIGN KEY ("A") REFERENCES "peoples"("PeopleID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectAssignments" ADD CONSTRAINT "_ProjectAssignments_B_fkey" FOREIGN KEY ("B") REFERENCES "projects"("ProjectID") ON DELETE CASCADE ON UPDATE CASCADE;
