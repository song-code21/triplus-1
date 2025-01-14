import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';

import { useSelector, useDispatch } from 'react-redux';
import { logoutAdminUser } from '../redux/admin/action';

import { useNavigate } from 'react-router-dom';

import ModalTemplete from '../components/admin/adminmodal/ModalTemplete';
import Pagination from '../components/admin/Pagination';

import { getGuide } from '../network/admin/http';
import GuideInfoModal from '../components/admin/GuideInfoModal';
import { BorderBtn } from '../styles/common';

const Body = styled.div`
  display: flex;
  width: 100vw;
  height: 90vh;
  justify-content: center;
  align-items: center;
`;

const Section = styled.section`
  position: relative;
  margin-top: 8rem;
  width: 55rem;
  padding: 2rem;
  min-height: 35rem;
  box-shadow: -3px -3px 10px ${({ theme }) => theme.color.lightBlue};
`;

const Title = styled.h1`
  position: relative;
  text-align: center;
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 4rem;
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: -3rem;
  left: -4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  width: 18rem;
  height: 10rem;
  background-color: #fff;
  border-radius: 30%;
`;

const Img = styled.img`
  object-fit: contain;
  width: inherit;
`;

const LogoutBtn = styled(BorderBtn)`
  position: absolute;
  top: 2rem;
  right: 3rem;
  z-index: 10;
`;

const SubTitle = styled.p`
  height: 3rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.darkGray};
`;

const Table = styled.section`
  width: 100%;
  height: 20rem;
`;

const TableHeader = styled.ul`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  font-weight: bold;
  border-top: 2px solid ${({ theme }) => theme.color.black};
  border-bottom: 1px solid ${({ theme }) => theme.color.gray};
`;

const TableHeaderLi = styled.li`
  width: ${({ width }) => width};
  text-align: center;
  word-wrap: break-word;
  color: ${({ gray, theme }) => theme.color.black};
  height: 1.6rem;
`;

const TableGuideListContainer = styled.div`
  width: 100%;
  height: 17rem;
`;

const TableGuideList = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
`;
const TableGuideListLi = styled.li`
  width: ${({ width }) => width};
  text-align: center;
  color: ${({ gray, theme }) => (gray ? theme.color.gray : theme.color.black)};
  height: 1.6rem;
  word-wrap: break-word;
  margin: 1rem 0;
  ${({ title }) =>
    title &&
    css`
      &:hover {
        cursor: pointer;
        color: ${({ theme }) => theme.color.blue};
      }
    `}
`;

export default function AdminPage() {
  const isOpen = useSelector((state) => state.adminOpenReducer.isOpen);
  const [currentPage, setCurrentPage] = useState(0);
  const [count, setCount] = useState(0);
  const [guideList, setGuideList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const size = 4;

  const totalPageLength = Math.ceil(count / size);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getGuide(currentPage, size).then((res) => {
      if (res.data.data) {
        setGuideList(res.data.data);
        setCount(res.data.count);
      }
    });
  }, [currentPage, isOpen]);

  const getGuideInfo = (e) => {
    const selectedGuide = guideList.filter((el) => el.guideId === Number(e.target.id))[0];
    setSelectedGuide(selectedGuide);
    setOpenModal(true);
  };

  const changePageHandler = (changePage) => {
    setCurrentPage(changePage);
  };

  const handleLogoutClick = () => {
    dispatch(logoutAdminUser());
    navigate('/');
  };

  return (
    <Body>
      {isOpen ? (
        <>
          <Section>
            <LogoWrapper>
              <Img src='/asset/logo/logo.png' alt='로고' />
              <SubTitle>여행에 우리를 더하다</SubTitle>
            </LogoWrapper>
            <LogoutBtn palette='blue' onClick={handleLogoutClick}>
              로그아웃
            </LogoutBtn>
            <Title>가이드 진행 목록</Title>
            <Table>
              <TableHeader>
                <TableHeaderLi width='5%'>No.</TableHeaderLi>
                <TableHeaderLi width='20%'>작성자</TableHeaderLi>
                <TableHeaderLi width='45%'>가이드 제목</TableHeaderLi>
                <TableHeaderLi width='15%'>가이드 날짜</TableHeaderLi>
                <TableHeaderLi width='15%'>생성 날짜</TableHeaderLi>
              </TableHeader>
              <TableGuideListContainer>
                {guideList.map((guideInfo, i) => {
                  return (
                    <TableGuideList key={guideInfo.guideId}>
                      <TableGuideListLi width='5%'>{currentPage * size + i + 1}</TableGuideListLi>
                      <TableGuideListLi width='20%'>{guideInfo.userId}</TableGuideListLi>
                      <TableGuideListLi
                        id={guideInfo.guideId}
                        width='45%'
                        title='title'
                        onClick={getGuideInfo}
                      >
                        {guideInfo.title}
                      </TableGuideListLi>
                      <TableGuideListLi width='15%' gray='gray'>
                        {dayjs(guideInfo.guideDate).format('YYYY.MM.DD')}
                      </TableGuideListLi>
                      <TableGuideListLi width='15%' gray='gray'>
                        {dayjs(guideInfo.guideCreatedAt).format('YYYY.MM.DD')}
                      </TableGuideListLi>
                    </TableGuideList>
                  );
                })}
              </TableGuideListContainer>
            </Table>
            <Pagination
              totalPageLength={totalPageLength}
              currentPage={currentPage}
              changePageHandler={changePageHandler}
            ></Pagination>
          </Section>
          {openModal && (
            <GuideInfoModal
              selectedGuide={selectedGuide}
              setSelectedGuide={setSelectedGuide}
              setOpenModal={setOpenModal}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      ) : (
        <ModalTemplete></ModalTemplete>
      )}
    </Body>
  );
}
