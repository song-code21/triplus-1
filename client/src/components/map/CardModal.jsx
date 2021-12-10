/*eslint-disable no-unused-vars*/

import React, { useState } from 'react';
import styled from 'styled-components';
import GuideContent from './cardModal/GuideContent';
import GuideImgs from './cardModal/GuideImgs';
import UserInfo from './cardModal/UserInfo';
import GuideBtn from './cardModal/GuideBtn';
import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { openGuideModal } from '../../redux/map/action';
import CheckModal from './cardModal/CheckModal';

const ModalWrapper = styled.section`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  z-index: 2;

  flex: 0 0 auto;
  width: 100%;
  height: 100%;
  border: 3px solid ${({ theme }) => theme.color.lightGray};
  background-color: #fff;
  overflow: auto;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media ${({ theme }) => theme.device.mobile} {
    top: unset;
    bottom: 0;
    width: 100vw;
    height: calc(100vh - ${({ theme }) => theme.size.navHeight});
    transform: translateX(0);
    z-index: 10;
  }
`;

const Wrapper = styled.div`
  padding: 1.5rem;
  padding-top: 0;
`;

const Title = styled.h1`
  margin: 1rem 0;
  font-size: 1.7rem;
  text-align: center;
  color: ${({ theme }) => theme.color.darkGray};
`;

const BtnWrapper = styled.div`
  text-align: right;
  position: sticky;
  top: 0;
  right: 0;
`;

const CloseBtn = styled.button`
  border: none;
  background-color: unset;
  padding: 0.5rem;
  font-size: 1.2rem;
  opacity: 0.5;

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

export default function CardModal({ modalInfo }) {
  const {
    title,
    address,
    gender,
    guideId,
    guideDate,
    tourImage,
    userImage,
    nickName,
    openDate,
    content,
    userParticipate,
    state,
  } = modalInfo;
  const [openModal, setOpenModal] = useState('');

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(openGuideModal({ isOpen: false }));
  };
  return (
    <>
      <ModalWrapper>
        <BtnWrapper onClick={closeModal}>
          <CloseBtn>
            <FaTimes />
          </CloseBtn>
        </BtnWrapper>
        <Wrapper>
          <Title>{title}</Title>
          <UserInfo nickName={nickName} gender={gender} userImage={userImage} />
          <GuideImgs tourImage={tourImage} title={title} />
          <GuideContent
            address={address}
            guideDate={guideDate}
            content={content}
            openDate={openDate}
          />
        </Wrapper>
        <GuideBtn
          guideId={guideId}
          userParticipate={userParticipate}
          state={state}
          closeModal={closeModal}
          compoleteModal={(result) => setOpenModal(result)}
        />
      </ModalWrapper>
      {openModal && <CheckModal openMsg={openModal} />}
    </>
  );
}
