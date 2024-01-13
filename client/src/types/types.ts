export interface PostData {
    _id: string;
    content: string;
    recipient: {
        _id: string;
        firstName: string;
        lastName: string;
    } | null;
    author: {
      _id: string;
      displayPicture: string | null;
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
    recipient: {
        _id: string;
        firstName: string;
        lastName: string;
    } | null;
    author: {
      _id: string;
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
    _id: string;
    author: {
        _id: string;
        displayPicture: string | null;
        firstName: string;
        lastName: string;
    };
    content: string;
    date: string;
    likes: Like[];
}

export interface CommentProps {
    _id: string,
    authorId: string,
    displayPicture: string | null;
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
      _id: string;
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
}

export interface UserCardProps {
    _id: string;
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
    _id: string;
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
      displayPicture: string | null;
    };
    type: string;
    isRead: boolean;
    postId: string;
    commentId: string;
    displayPictureId: string;
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
    markAsRead: (notificationId: string) => void;
    deleteNotification: (notificationId: string) => void;
}

export interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}