export interface PostData {
    _id: string;
    content: string;
    author: {
      _id: string;
      profilePicture: string | null;
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
      profilePicture: string | null;
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
        profilePicture: string | null;
        firstName: string;
        lastName: string;
    };
    content: string;
    date: string;
    likes: Like[];
}

export interface CommentProps {
    _id: string,
    profilePicture: string | null;
    fullName: string;
    datetime: string;
    content: string;
    parentId: string;
    likes: Like[];
    update: Function;
    type: string;
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
    birthDay: string;
    birthMonth: string;
    hometown: string;
    occupation: string;
    profilePicture: string | null;
    visibility: {
        dateOfBirth: boolean;
        hometown: boolean;
        occupation: boolean;
    };
}

export interface UserFriendProps {
    friend: {
      _id: string;
      firstName: string;
      lastName: string;
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
    profilePicture: string | null;
    firstName: string;
    lastName: string;
    hometown: string | null;
    visibility: {
        hometown: boolean;
    };
}

export interface EditProfileProps {
    currentUser: {
      id: string;
      firstName: string;
      lastName: string;
      birthDay: string;
      birthMonth: string;
      hometown: string;
      occupation: string;
      profilePicture: string;
      visibility: {
        dateOfBirth: boolean;
        hometown: boolean;
        occupation: boolean;
      };
    };
}

export interface BirthdayFormProps {
    formState: FormState;
    handleInputChange: (e: React.ChangeEvent<any>) => void;
}
  
export interface PrivateInfo {
    dateOfBirth: boolean;
    hometown: boolean;
    occupation: boolean;
}
  
export interface FormState {
    birthDay: string;
    birthMonth: string;
    hometown: string;
    occupation: string;
    profilePicture: string | null | File;
    privateInfo: PrivateInfo;
    [key: string]: string | PrivateInfo | boolean | null | File;
}

export interface PostFormProps {
    onSubmit: (postContent: string) => void;
}

export interface NotificationType {
    id: string;
    sender: {
      firstName: string;
      lastName: string;
      displayPicture: string | null;
    };
    type: string;
    content: string;
    isRead: boolean;
}