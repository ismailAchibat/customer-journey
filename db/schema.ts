import { or } from 'drizzle-orm';
import { date, integer, numeric, pgTable, serial, text, time, timestamp, uuid } from 'drizzle-orm/pg-core';

export const organisations = pgTable('organisations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  teamRole: text('team_role'),
  organisationId: text('organisation_id').notNull().references(() => organisations.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company'),
  phoneNumber: text('phone_number'),
  email: text('email'),
  country: text('country'),
  status: text('status'),
  organisationId: text('organisation_id').notNull().references(() => organisations.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deals = pgTable('deals', {
  id: text('id').primaryKey(),
  date: date('date').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  clientId: text('client_id').notNull().references(() => clients.id),
  amount: numeric('amount').notNull(),
});

export const calendar = pgTable('calendar', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  client_name: text('client_name'),
  subject: text('subject'),
  date: date('date').notNull(),
  time: time('time').notNull(),
  duration: integer('duration'), // duration in minutes
});

export const chats = pgTable('chats', {
  id: text('id').primaryKey(),
  fromUserId: text('from_user_id').notNull().references(() => users.id),
  toUserId: text('to_user_id').notNull().references(() => users.id),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
});