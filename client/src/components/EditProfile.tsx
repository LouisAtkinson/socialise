import React, { useState, ChangeEvent, FormEvent, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import blankImage from '../images/blank.png';

interface EditProfileProps {
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

interface PrivateInfo {
  dateOfBirth: boolean;
  hometown: boolean;
  occupation: boolean;
}

interface FormState {
  dateOfBirth: string | null;
  hometown: string;
  occupation: string;
  profilePicture: File;
  privateInfo: PrivateInfo;
  [key: string]: string | PrivateInfo | boolean | null | File;
}

function EditProfile({ user }: EditProfileProps) {
  const [formState, setFormState] = useState<FormState>({
    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    hometown: user.hometown || '',
    occupation: user.occupation || '',
    profilePicture: user.profilePicture || '',
    privateInfo: {
      dateOfBirth: !user.visibility?.dateOfBirth || true,
      hometown: !user.visibility?.hometown || true,
      occupation: !user.visibility?.occupation || true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${user.id}`);
        if (response.ok) {
          const userData = await response.json();
          
          console.log(userData.visibility?.dateOfBirth)

          setFormState({
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
            hometown: userData.hometown || '',
            occupation: userData.occupation || '',
            profilePicture: userData.profilePicture || '',
            privateInfo: {
              dateOfBirth: userData.visibility?.dateOfBirth || true,
              hometown: userData.visibility?.hometown || true,
              occupation: userData.visibility?.occupation || true,
            },
          });
        } else {
          console.error('Failed to fetch user information');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setFormState((prevFormState) => ({
        ...prevFormState,
        privateInfo: {
          ...prevFormState.privateInfo,
          [name]: checked,
        },
      }) as FormState);
    } else {
      const updatedValue = name === 'dateOfBirth' ? new Date(value) : value;

      setFormState((prevFormState) => ({
        ...prevFormState,
        [name]: updatedValue,
      }) as FormState);
    };

    setChangesSaved(false);
    setUnsaved(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setFormState((prevFormState) => ({
        ...prevFormState,
        profilePicture: file,
      }));
    }

    setChangesSaved(false);
    setUnsaved(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('file', formState.profilePicture);

      formData.append('dateOfBirth', formState.dateOfBirth || '');
      formData.append('hometown', formState.hometown || '');
      formData.append('occupation', formState.occupation || '');
      formData.append('privateInfo', JSON.stringify(formState.privateInfo));

      console.log(formData);
      const response = await fetch(`/api/user/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setChangesSaved(true);
        setUnsaved(false);
        const updatedVisibility = {
          dateOfBirth: !formState.privateInfo.dateOfBirth,
          hometown: !formState.privateInfo.hometown,
          occupation: !formState.privateInfo.occupation,
        };

        console.log('Changes saved:', updatedVisibility);
      } else {
        console.error('Failed to update user information', response);
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturnToProfile = () => {
    navigate(`/user/${user.id}`);
  };


  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-picture-section">
          <img
            src={formState.profilePicture !== null ? 
              (typeof formState.profilePicture === 'string' ? 
                formState.profilePicture : 
                URL.createObjectURL(formState.profilePicture)
              ) : 
              blankImage
            } alt="Display picture"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formState.dateOfBirth || ''}
            onChange={handleInputChange}
          />
          <div className="checkbox-label">
            <input
              type="checkbox"
              name="dateOfBirth"
              checked={formState.privateInfo.dateOfBirth}
              onChange={handleInputChange}
            />
            <label>Private</label>
          </div>
        </div>

        {/* Hometown */}
        <div className="form-group">
          <label>Hometown:</label>
          <input
            type="text"
            name="hometown"
            value={formState.hometown || ''}
            onChange={handleInputChange}
          />
          <div className="checkbox-label">
            <input
              type="checkbox"
              name="hometown"
              checked={formState.privateInfo.hometown}
              onChange={handleInputChange}
            />
            <label>Private</label>
          </div>
        </div>

        {/* Occupation */}
        <div className="form-group">
          <label>Occupation:</label>
          <input
            type="text"
            name="occupation"
            value={formState.occupation}
            onChange={handleInputChange}
          />
          <div className="checkbox-label">
            <input
              type="checkbox"
              name="occupation"
              checked={formState.privateInfo.occupation}
              onChange={handleInputChange}
            />
            <label>Private</label>
          </div>
        </div>

        <button 
          className='save-changes-btn' 
          type="submit"
          disabled={!unsaved || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        {changesSaved && <p className="changes-saved-msg">Changes saved</p>}

        <button type="button" onClick={handleReturnToProfile}>
          Return to Profile
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
