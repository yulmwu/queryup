import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1774222245483 implements MigrationInterface {
    name = 'Init1774222245483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('0', '1')`)
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(32) NOT NULL, "nickname" character varying(32), "password" character varying(255) NOT NULL, "email" character varying(320) NOT NULL, "description" character varying(255), "profileImage" character varying(255), "studentNumber" character varying(5) NOT NULL, "department" smallint NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "status" smallint NOT NULL DEFAULT '1', "club" character varying(255), "role" "public"."users_role_enum" NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "topics" ("id" SERIAL NOT NULL, "slug" character varying(64) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "creatorId" integer, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97c66ab0029f49fde30517f819" ON "topics" ("slug") `)
        await queryRunner.query(
            `CREATE TABLE "topic_posts" ("id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "content" text NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "topicId" integer, "authorId" integer, CONSTRAINT "PK_27bd87a82adb8b519df9ab22e22" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_bbe979d3811e484a9abdb4ea99" ON "topic_posts" ("isDeleted") `)
        await queryRunner.query(
            `CREATE TABLE "topic_post_comments" ("id" SERIAL NOT NULL, "content" text, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, "parentId" integer, "authorId" integer, CONSTRAINT "PK_18873e4285265a0ff1ef64ea01b" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_aaf21204a69c459b4b2c88d99f" ON "topic_post_comments" ("postId") `)
        await queryRunner.query(`CREATE INDEX "IDX_2746d6951f5af8daf65141e6bc" ON "topic_post_comments" ("parentId") `)
        await queryRunner.query(`CREATE INDEX "IDX_6cd08cde040ab6367c3225f9ca" ON "topic_post_comments" ("isDeleted") `)
        await queryRunner.query(
            `CREATE TABLE "anonymous_posts" ("id" SERIAL NOT NULL, "title" character varying(200) NOT NULL, "content" text NOT NULL, "authorName" character varying(32) NOT NULL, "passwordHash" character varying(255) NOT NULL, "ipAddress" character varying(64) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_886b6545ccf021dfd2acb68a1b1" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_91b7f0b7beb0d0d7d1221ac493" ON "anonymous_posts" ("isDeleted") `)
        await queryRunner.query(
            `CREATE TABLE "anonymous_comments" ("id" SERIAL NOT NULL, "content" text, "authorName" character varying(32) NOT NULL, "passwordHash" character varying(255) NOT NULL, "ipAddress" character varying(64) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, "parentId" integer, CONSTRAINT "PK_ed701ce49ac6ca8a147f49d0941" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`CREATE INDEX "IDX_49f9295d70589acba06172d07e" ON "anonymous_comments" ("postId") `)
        await queryRunner.query(`CREATE INDEX "IDX_cd01e1c43da35bc83c5766489a" ON "anonymous_comments" ("parentId") `)
        await queryRunner.query(`CREATE INDEX "IDX_9ec38eaddf8111160d9b7b14a4" ON "anonymous_comments" ("isDeleted") `)
        await queryRunner.query(
            `ALTER TABLE "topics" ADD CONSTRAINT "FK_62a84331503e467c317cc9396fe" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "topic_posts" ADD CONSTRAINT "FK_fa1faf1c53fe932deb42721b8a9" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "topic_posts" ADD CONSTRAINT "FK_f83f9566427e44e6b82047bd6eb" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "topic_post_comments" ADD CONSTRAINT "FK_aaf21204a69c459b4b2c88d99f8" FOREIGN KEY ("postId") REFERENCES "topic_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "topic_post_comments" ADD CONSTRAINT "FK_2746d6951f5af8daf65141e6bc2" FOREIGN KEY ("parentId") REFERENCES "topic_post_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "topic_post_comments" ADD CONSTRAINT "FK_a4dcc5c2b618562ba487137edfb" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "anonymous_comments" ADD CONSTRAINT "FK_49f9295d70589acba06172d07e7" FOREIGN KEY ("postId") REFERENCES "anonymous_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "anonymous_comments" ADD CONSTRAINT "FK_cd01e1c43da35bc83c5766489a3" FOREIGN KEY ("parentId") REFERENCES "anonymous_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "anonymous_comments" DROP CONSTRAINT "FK_cd01e1c43da35bc83c5766489a3"`)
        await queryRunner.query(`ALTER TABLE "anonymous_comments" DROP CONSTRAINT "FK_49f9295d70589acba06172d07e7"`)
        await queryRunner.query(`ALTER TABLE "topic_post_comments" DROP CONSTRAINT "FK_a4dcc5c2b618562ba487137edfb"`)
        await queryRunner.query(`ALTER TABLE "topic_post_comments" DROP CONSTRAINT "FK_2746d6951f5af8daf65141e6bc2"`)
        await queryRunner.query(`ALTER TABLE "topic_post_comments" DROP CONSTRAINT "FK_aaf21204a69c459b4b2c88d99f8"`)
        await queryRunner.query(`ALTER TABLE "topic_posts" DROP CONSTRAINT "FK_f83f9566427e44e6b82047bd6eb"`)
        await queryRunner.query(`ALTER TABLE "topic_posts" DROP CONSTRAINT "FK_fa1faf1c53fe932deb42721b8a9"`)
        await queryRunner.query(`ALTER TABLE "topics" DROP CONSTRAINT "FK_62a84331503e467c317cc9396fe"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_9ec38eaddf8111160d9b7b14a4"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_cd01e1c43da35bc83c5766489a"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_49f9295d70589acba06172d07e"`)
        await queryRunner.query(`DROP TABLE "anonymous_comments"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_91b7f0b7beb0d0d7d1221ac493"`)
        await queryRunner.query(`DROP TABLE "anonymous_posts"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_6cd08cde040ab6367c3225f9ca"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_2746d6951f5af8daf65141e6bc"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_aaf21204a69c459b4b2c88d99f"`)
        await queryRunner.query(`DROP TABLE "topic_post_comments"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_bbe979d3811e484a9abdb4ea99"`)
        await queryRunner.query(`DROP TABLE "topic_posts"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_97c66ab0029f49fde30517f819"`)
        await queryRunner.query(`DROP TABLE "topics"`)
        await queryRunner.query(`DROP TABLE "users"`)
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
    }
}
