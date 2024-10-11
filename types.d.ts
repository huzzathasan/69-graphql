export interface UserCreateInterface {
  name: string;
  email: string;
  username?: string;
  password: string;
}

export interface UserUpdateInterface {
  name: string;
  email: string;
  username?: string;
  password: string;
  isVerified: boolean;
}

export interface PostCreateInterface {
  title: string;
  authorId?: string;
  image: string;
  paragraph: string;
}
export interface PostUpdateInterface {
  title: string;
  authorId?: string;
  image: string;
  paragraph: string;
}
