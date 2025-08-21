import { desc, relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";


export const genderEnum = t.pgEnum("gender", ["male", "female"]);

export const students = t.pgTable("students", {
  id: t.bigserial("id", { mode: "number" }).primaryKey(),
  firstName: t.varchar("firstname", { length: 255 }).notNull(),
  lastName: t.varchar("lastname", { length: 255 }).notNull(),
  studentId: t.varchar("student_id", { length: 50 }).notNull().unique(),
  DOB: t.date("dob"),
  gender: genderEnum("gender"),
});

export const genres = t.pgTable("genres", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
});

export const books = t.pgTable("books", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  title: t
    .varchar({
      length: 255,
    })
    .notNull(),
  author: t
    .varchar({
      length: 255,
    })
    .notNull(),
  publishedAt: t.timestamp().notNull(),

  genreId: t.bigint({ mode: "number" }).references(() => genres.id, {
    onDelete: "set null",
  }),

  description: t.text("description").notNull().default(""),
  coverImage: t.varchar("cover_image", { length: 255 }).notNull().default(""),
  summary: t.text("summary").notNull().default(""),
});

export const beverage = t.pgTable("beverage", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  price: t.numeric().notNull(),
  description: t.text().notNull().default(""),
  imageUrl: t.varchar({ length: 255 }).notNull().default(""),
});

export const order = t.pgTable("order", {
  id: t.bigserial({ mode: "number" }).primaryKey(),
  beverageId: t.bigint({ mode: "number" }).references(() => beverage.id, {
    onDelete: "cascade",
  }),
  note: t.text("note").notNull().default(""),
  quantity: t.integer().notNull().default(1),
  orderDate: t.timestamp().notNull().defaultNow(),
});

export const orderRelations = relations(order, ({ one }) => ({
  beverage: one(beverage, {
    fields: [order.beverageId],
    references: [beverage.id],
  }),
}));

export const bookRelations = relations(books, ({ one }) => ({
  genre: one(genres, {
    fields: [books.genreId],
    references: [genres.id],
  }),
}));
