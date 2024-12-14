import React from 'react';
import Modal from '@/components/Modal';
import data from '@/public/userdata.json' assert { type: 'json' };

interface UserData {
  email: string;
  nickName: string;
  gender: string;
  age: number;
  birthday: string;
  profileImg: string;
}

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | undefined;
}

const EditProfile: React.FC<EditProfileProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  // const users = userData as UserData[];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2>회원정보 수정</h2>
        <form>
          <div>
            <label>닉네임</label>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProfile;
