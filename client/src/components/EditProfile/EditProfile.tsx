import React, { useState, ChangeEvent, FormEvent, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import blankImage from '../../images/blank.png';
import { EditProfileProps, PrivateInfo, FormState } from '../../types/types';
import BirthdayForm from '../BirthdayForm/BirthdayForm';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { fetchDisplayPicture } from '../../helpers/helpers';
import './EditProfile.css';

function EditProfile({ currentUser }: EditProfileProps) {
  const [formState, setFormState] = useState<FormState>({
    birthDay: currentUser.birthDay || '',
    birthMonth: currentUser.birthMonth || '',
    hometown: currentUser.hometown || '',
    occupation: currentUser.occupation || '',
    displayPicture: currentUser.displayPicture || '',
    privateInfo: {
      birthday: !currentUser.visibility?.birthday || true,
      hometown: !currentUser.visibility?.hometown || true,
      occupation: !currentUser.visibility?.occupation || true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useLogout();

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://socialise-seven.vercel.app/api/user/${currentUser.id}`);
        if (response.ok) {
          const userData = await response.json();
          
          const displayPicture = await fetchDisplayPicture(currentUser.id);

          setFormState({
            birthDay: userData.birthDay || '',
            birthMonth: userData.birthMonth || '',
            hometown: userData.hometown || '',
            occupation: userData.occupation || '',
            displayPicture: displayPicture || '',
            privateInfo: {
              birthday: !userData.visibility?.birthday || true,
              hometown: !userData.visibility?.hometown || true,
              occupation: !userData.visibility?.occupation || true,
            },
          });

          setLoading(false);
        } else {
          console.error('Failed to fetch user information');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserData();
  }, [currentUser.id]);

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

      setFormState((prevFormState) => ({
        ...prevFormState,
        [name]: value,
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
        displayPicture: file,
      }));
      setSelectedFile(file);
    }

    setChangesSaved(false);
    setUnsaved(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      const userInfoResponse = await fetch(`https://socialise-seven.vercel.app/api/user/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthDay: formState.birthDay || '',
          birthMonth: formState.birthMonth || '',
          hometown: formState.hometown || '',
          occupation: formState.occupation || '',
          privateInfo: formState.privateInfo,
        }),
      });

      if (!userInfoResponse.ok) {
        console.error('Failed to update user information', userInfoResponse);
      }

      if (formState.displayPicture instanceof File) {
        const token = user?.token;
  
        if (!token) {
          logout();
          return;
        }

        const displayPictureFormData = new FormData();
        displayPictureFormData.append('file', formState.displayPicture);
  
        const displayPictureResponse = await fetch(`https://socialise-seven.vercel.app/api/display-pictures/${user.id}`, {
          method: 'POST',
          body: displayPictureFormData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!displayPictureResponse.ok) {
          console.error('Failed to upload display picture', displayPictureResponse);
          throw new Error('Failed to upload display picture');
        }
      }
  
      setChangesSaved(true);
      setUnsaved(false);  
    } catch (error) {
      console.error('Error updating user information:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturnToProfile = () => {
    navigate(`/user/${currentUser.id}`);
  };


  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="profile-picture-section">
            <img
              src={
                formState.displayPicture !== null
                  ? typeof formState.displayPicture === 'string'
                    ? formState.displayPicture
                    : URL.createObjectURL(formState.displayPicture)
                  : blankImage
              }
              alt="Display picture"
              className="profile-picture"
            />
            <label htmlFor="file-input" className="file-upload-btn">
              Upload Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
              id="file-input"
            />
            {selectedFile && (
              <span className="selected-file-name">{selectedFile.name}</span>
            )}
          </div>
  
          <div className="form-group">
            <label>Date of Birth:</label>
            <BirthdayForm
              formState={formState}
              handleInputChange={handleInputChange}
            />
            <div className="checkbox-label">
              <input
                type="checkbox"
                name="birthday"
                checked={formState.privateInfo.birthday}
                onChange={handleInputChange}
              />
              <label>Private</label>
            </div>
          </div>
  
          <div className="form-group">
            <label>Hometown:</label>
            <input
              type="text"
              name="hometown"
              value={formState.hometown || ''}
              onChange={handleInputChange}
              className="text-input"
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
  
          <div className="form-group">
            <label>Occupation:</label>
            <input
              type="text"
              name="occupation"
              value={formState.occupation}
              onChange={handleInputChange}
              className="text-input"
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
            className={
              !isSaving && !changesSaved && unsaved
                ? 'save-changes-btn'
                : 'save-changes-btn inactive'
            }
            type="submit"
            disabled={!unsaved || isSaving}
          >
            {isSaving
              ? 'Saving...'
              : changesSaved && !unsaved
              ? 'Changes saved'
              : 'Save changes'}
          </button>
  
          <button
            className="return-btn"
            type="button"
            onClick={handleReturnToProfile}
          >
            Return to profile
          </button>
        </form>
      )}
    </div>
  );  
}

export default EditProfile;
