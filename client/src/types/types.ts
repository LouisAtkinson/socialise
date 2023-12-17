export interface PostData {
    _id: string;
    content: string;
    author: {
      _id: string;
      profilePicture: File | null;
      firstName: string;
      lastName: string;
    };
    date: string;
    likes: Like[];
    comments: CommentData[];
  }

export interface PostProps {
    _id: string;
    content: string;
    author: {
      _id: string;
      profilePicture: File | null;
      firstName: string;
      lastName: string;
    };
    date: string;
    likes: Like[];
    comments: CommentData[];
    update: Function
}

export interface CommentData {
    _id: string;
    author: {
        id: string;
        profilePicture: File | null;
        firstName: string;
        lastName: string;
    };
    content: string;
    date: string;
}

export interface CommentProps {
    _id: string,
    profilePicture: File | null;
    fullName: string;
    datetime: string;
    content: string;
    postId: string;
    update: Function;
}
  
export interface Like {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface UserProfileProps {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    hometown: string;
    occupation: string;
    profilePicture: File | null;
    visibility: {
        dateOfBirth: boolean;
        hometown: boolean;
        occupation: boolean;
    };
}

export interface SearchBarProps {
    initialQuery?: string;
}

export interface FriendButtonProps {
    userId: string;
}

export interface UserCardProps {
    id: string;
    profilePicture: File | null;
    firstName: string;
    lastName: string;
    hometown: string | null;
    visibility: {
        hometown: boolean;
    };
}

export interface EditProfileProps {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      dateOfBirth: Date | null;
      hometown: string;
      occupation: string;
      profilePicture: File;
      visibility: {
        dateOfBirth: boolean;
        hometown: boolean;
        occupation: boolean;
      };
    };
}
  
export interface PrivateInfo {
    dateOfBirth: boolean;
    hometown: boolean;
    occupation: boolean;
}
  
export interface FormState {
    dateOfBirth: string | null;
    hometown: string;
    occupation: string;
    profilePicture: File;
    privateInfo: PrivateInfo;
    [key: string]: string | PrivateInfo | boolean | null | File;
}

export interface PostFormProps {
    onSubmit: (postContent: string) => void;
}