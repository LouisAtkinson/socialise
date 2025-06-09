import React, { useState, ChangeEvent, FormEvent, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import blankImage from '../../images/blank.png';
import { EditProfileProps, PrivateInfo, FormState } from '../../types/types';
import BirthdayForm from '../BirthdayForm/BirthdayForm';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import { fetchDisplayPicture, uploadDisplayPicture } from '../../services/displayPictureService';
import { fetchUserData, updateUserInfo } from '../../services/userService';
import './EditProfile.css';
import { apiBaseUrl } from '../../config';

function EditProfile({ currentUser }: EditProfileProps) {
  const [formState, setFormState] = useState<FormState>({
    birthDay: currentUser.birthDay || '',
    birthMonth: currentUser.birthMonth || '',
    hometown: currentUser.hometown || '',
    occupation: currentUser.occupation || '',
    displayPicture: currentUser.displayPicture || null,
    privateInfo: {
      birthday: !currentUser.visibility?.birthday,
      hometown: !currentUser.visibility?.hometown,
      occupation: !currentUser.visibility?.occupation,
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
    const fetchUserDataHandler = async () => {
      if (!currentUser?.id || !user?.token) return;

      try {
        const token = user.token;
        const userData = await fetchUserData(currentUser.id, token);
        const displayPicture = await fetchDisplayPicture(currentUser.id, 'full', token);

        setFormState({
          birthDay: userData.birthDay || '',
          birthMonth: userData.birthMonth || '',
          hometown: userData.hometown || '',
          occupation: userData.occupation || '',
          displayPicture: displayPicture || null,
          privateInfo: {
            birthday: !userData.visibility?.birthday,
            hometown: !userData.visibility?.hometown,
            occupation: !userData.visibility?.occupation,
          },
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserDataHandler();
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

    if (!user?.token) {
      logout();
      return;
    }

    try {
      setIsSaving(true);

      const updateData = {
        birthDay: formState.birthDay || '',
        birthMonth: formState.birthMonth || '',
        hometown: formState.hometown || '',
        occupation: formState.occupation || '',
        visibility: {
          birthday: !formState.privateInfo.birthday,
          hometown: !formState.privateInfo.hometown,
          occupation: !formState.privateInfo.occupation,
        },
      };

      await updateUserInfo(currentUser.id, user.token, updateData);

      if (formState.displayPicture instanceof File) {
        await uploadDisplayPicture(formState.displayPicture, user.token);
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
            <label htmlFor="file-input" className="file-upload-btn btn-transition">
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
            <label className='input-title'>Date of Birth:</label>
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
              <label className='private-label'>Private</label>
            </div>
          </div>
  
          <div className="form-group">
            <label className='input-title'>Hometown:</label>
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
              <label className='private-label'>Private</label>
            </div>
          </div>
  
          <div className="form-group">
            <label className='input-title'>Occupation:</label>
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
              <label className='private-label'>Private</label>
            </div>
          </div>
        </form>
      )}
      <div className='bottom-btns'>
        <button
          className={
            !isSaving && !changesSaved && unsaved
              ? 'save-changes-btn btn-transition'
              : 'save-changes-btn inactive'
          }
          type="submit"
          onClick={handleSubmit}
          disabled={!unsaved || isSaving}
        >
          {isSaving
            ? 'Saving...'
            : changesSaved && !unsaved
            ? 'Changes saved'
            : 'Save changes'}
        </button>

        <button
          className="return-btn btn-transition"
          type="button"
          onClick={handleReturnToProfile}
        >
          Return to profile
        </button>
      </div>
    </div>
  );  
}

export default EditProfile;
