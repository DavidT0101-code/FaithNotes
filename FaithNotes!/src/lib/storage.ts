import { Sermon, User } from "./types";

const SERMONS_KEY = "faithnotes_sermons";
const USERS_KEY = "faithnotes_users";
const CURRENT_USER_KEY = "faithnotes_current_user";

export function getSermons(): Sermon[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SERMONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSermon(sermon: Sermon): void {
  const sermons = getSermons();
  const idx = sermons.findIndex((s) => s.id === sermon.id);
  if (idx >= 0) sermons[idx] = sermon;
  else sermons.unshift(sermon);
  localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
}

export function getSermonById(id: string): Sermon | null {
  return getSermons().find((s) => s.id === id) ?? null;
}

export function deleteSermon(id: string): void {
  const sermons = getSermons().filter((s) => s.id !== id);
  localStorage.setItem(SERMONS_KEY, JSON.stringify(sermons));
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export function getUserById(id: string): User | null {
  return getUsers().find((u) => u.id === id) ?? null;
}

export function getUserSermons(userId: string): Sermon[] {
  return getSermons().filter((s) => s.userId === userId);
}

export function getSharedSermons(userId: string): Sermon[] {
  return getSermons().filter(
    (s) =>
      s.userId !== userId &&
      (s.isPublic || s.sharedWith.includes(userId))
  );
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
