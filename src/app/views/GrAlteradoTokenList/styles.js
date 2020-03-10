import styled from 'styled-components';

const columnsSize = '1.0fr 1.5fr 4.5fr';

export const UserList = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 60px;
  p {
    font-size: 14px;
    line-height: 20px;
  }
  .header {
    padding: 10px 20px;
    display: grid;
    align-items: center;
    grid-template-columns: ${columnsSize};
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    @media (max-width: 620px) {
      grid-template-columns: 1fr;
    }
  }
  .item {
    background: #f7f7f7;
    padding: 10px 20px;
    margin-bottom: 4px;
    font-size: 14px;
    display: grid;
    align-items: center;
    grid-template-columns: ${columnsSize};
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    @media (max-width: 620px) {
      grid-template-columns: 1fr;
    }
  }
`
export const Header = styled.div`
  background: #292D41;
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h1{
    color: #fff;
  }
`
export const Title = styled.h1`
  font-size: 18px;
  margin: 40px auto;
  justify-content: center;
`
export const Erro = styled.div`
  font-size: 14px;
  background: rgb(180,58,83);
  background: linear-gradient(0deg, rgba(180,58,83,1) 0%, rgba(253,29,29,1) 100%);
  color: #fff;
  display: block;
  padding: 15px;
  width: 120px;
  margin: 80px auto;
  text-align: center;
`
