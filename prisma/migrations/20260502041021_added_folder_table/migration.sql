-- CreateTable
CREATE TABLE "folder" (
    "id" SERIAL NOT NULL,
    "folder_name" VARCHAR(200) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "folder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
