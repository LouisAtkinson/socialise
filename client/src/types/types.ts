export interface PostData {
    id: number;
    content: string;
    recipient: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    author: {
      id: string;
      displayPicture: string | null;
      firstName: string;
      lastName: string;
    };
    date: string;
    likes: Like[];
    comments: CommentData[];
}

export interface PostProps {
    id: number;
    content: string;
    recipient: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    author: {
      id: string;
      displayPicture: string | null;
      firstName: string;
      lastName: string;
    };
    date: string;
    likes: Like[];
    comments: CommentData[];
    update: Function
}

export interface CommentData {
    id: number;
    author: {
        id: string;
        displayPicture: string | null;
        firstName: string;
        lastName: string;
    };
    content: string;
    date: string;
    likes: Like[];
}

export interface CommentProps {
    id: number,
    authorId: string,
    displayPicture: string | null;
    fullName: string;
    datetime: string;
    content: string;
    parentId: number;
    likes: Like[];
    update: Function;
    type: string;
}
  
export interface Like {
    id: string;
    firstName: string;
    lastName: string;
    displayPicture: string | null;
}

export interface DisplayPictureOwner {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
}

export interface UserProfileProps {
    id: string;
    firstName: string;
    lastName: string;
    birthDay: string;
    birthMonth: string;
    hometown: string;
    occupation: string;
    displayPicture: string | null;
    visibility: {
        birthday: boolean;
        hometown: boolean;
        occupation: boolean;
    };
}

export interface UserFriendProps {
    friend: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }

export interface SearchBarProps {
    initialQuery?: string;
    closeMobileNav: Function | null;
}

export interface FriendButtonProps {
    userId: string;
    friendshipStatus: string | null;
    setFriendshipStatus: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface UserCardProps {
    id: string;
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
      displayPicture: string;
      visibility: {
        birthday: boolean;
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
    birthday: boolean;
    hometown: boolean;
    occupation: boolean;
}
  
export interface FormState {
    birthDay: string;
    birthMonth: string;
    hometown: string;
    occupation: string;
    displayPicture: string | null | File;
    privateInfo: PrivateInfo;
    [key: string]: string | PrivateInfo | boolean | null | File;
}

export interface PostFormProps {
    onSubmit: (postContent: string) => void;
}  

export interface NotificationType {
    id: number;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
      displayPicture: string | null;
    };
    type: string;
    isRead: boolean;
    postId: number;
    commentId: number;
    displayPictureId: number | null;
}

export interface LikesSectionProps {
    likes: Like[];
  }

export interface LikesPopupProps {
    likes: Like[];
    onClose: () => void;
}

export interface NotificationCardProps {
    notification: NotificationType;
    markAsRead: (notificationId: number) => void;
    deleteNotification: (notificationId: number) => void;
}

export interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}