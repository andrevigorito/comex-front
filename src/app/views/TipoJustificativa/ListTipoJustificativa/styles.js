import styled from 'styled-components';

const columnsSize = '4.5fr 3.5fr 2.5fr 1.5fr 1.5fr 0.5fr';

export const UserList = styled.div`
  p {
    font-size: 14px;
    line-height: 20px;
  }

  .btn.excluir {
    background-color: #ff5757;
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
    .date {
      &.altered {
        color: red;
      }
      &.current {
        color: #666;
      }
    }
  }
`;

export const BtnCadastrar = styled.button`
  border-radius: 6px;
  background: #1abc9c;
  border: solid 1px #1abc9c;
  padding: 10px 20px;
  font-size: 14px;
  color: #fff;
  transition: 0.2s;

  &:hover {
    background: transparent;
    border: solid 1px #1abc9c;
    color: #1abc9c;
  }
`;
