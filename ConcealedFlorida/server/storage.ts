import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface ArchivedVideo {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  publishedAt: string;
  archivedAt: string;
  url: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getArchivedVideos(): Promise<ArchivedVideo[]>;
  archiveVideo(video: Omit<ArchivedVideo, "id" | "archivedAt">): Promise<ArchivedVideo>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private archivedVideos: Map<string, ArchivedVideo>;

  constructor() {
    this.users = new Map();
    this.archivedVideos = new Map();
    this.seedArchive();
  }

  private seedArchive() {
    const seed: Omit<ArchivedVideo, "id" | "archivedAt">[] = [
      {
        youtubeId: "example001",
        title: "Why You Must Understand Use of Force Law Before You Carry",
        channelName: "US LawShield",
        thumbnail: "https://picsum.photos/seed/vid001/480/270",
        publishedAt: "2025-04-08T14:00:00Z",
        url: "https://www.youtube.com/watch?v=example001",
      },
      {
        youtubeId: "example002",
        title: "ADRENALINE DUMP — How to Train for Real-World Stress",
        channelName: "Active Self Protection",
        thumbnail: "https://picsum.photos/seed/vid002/480/270",
        publishedAt: "2025-04-07T18:30:00Z",
        url: "https://www.youtube.com/watch?v=example002",
      },
      {
        youtubeId: "example003",
        title: "The Truth About Florida's New Permitless Carry Law",
        channelName: "Colion Noir",
        thumbnail: "https://picsum.photos/seed/vid003/480/270",
        publishedAt: "2025-04-06T12:00:00Z",
        url: "https://www.youtube.com/watch?v=example003",
      },
      {
        youtubeId: "example008",
        title: "Red Flag Laws Are Spreading — Here's the Map",
        channelName: "Gun Owners of America",
        thumbnail: "https://picsum.photos/seed/vid008/480/270",
        publishedAt: "2025-04-01T08:00:00Z",
        url: "https://www.youtube.com/watch?v=example008",
      },
    ];
    seed.forEach((v) => {
      const id = randomUUID();
      this.archivedVideos.set(id, { ...v, id, archivedAt: v.publishedAt });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArchivedVideos(): Promise<ArchivedVideo[]> {
    return Array.from(this.archivedVideos.values()).sort(
      (a, b) => new Date(b.archivedAt).getTime() - new Date(a.archivedAt).getTime()
    );
  }

  async archiveVideo(video: Omit<ArchivedVideo, "id" | "archivedAt">): Promise<ArchivedVideo> {
    const id = randomUUID();
    const entry: ArchivedVideo = { ...video, id, archivedAt: new Date().toISOString() };
    this.archivedVideos.set(id, entry);
    return entry;
  }
}

export const storage = new MemStorage();
