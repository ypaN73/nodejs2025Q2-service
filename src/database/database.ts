export interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export interface Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export const users: User[] = [];
export const artists: Artist[] = [];
export const albums: Album[] = [];
export const tracks: Track[] = [];
export const favorites: Favorites = {
  artists: [],
  albums: [],
  tracks: [],
};
