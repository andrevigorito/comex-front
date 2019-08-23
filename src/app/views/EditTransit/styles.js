import styled from 'styled-components';
import imgChecked from '../../img/icons/icon-check.png';
import imgloading from '../../img/load.gif';

export const ContentTransit = styled.div`
  position: relative;
  form {
    max-width: 840px;
    .item {
      margin-bottom: 20px;
      position: relative;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 300;
      margin-bottom: 10px;
      text-align: left;
    }
    input,
    select {
      width: 100%;
      height: 50px;
      border: solid 1px #fff;
      box-sizing: border-box;
      border-radius: 6px;
      padding: 0 10px;
      font-size: 14px;
      font-weight: 400;
      transition: all ease 0.3s;
      &:focus {
        border: solid 1px #c2c2c2;
      }
    }
    input[type='checkbox'] {
      width: 18px;
      height: 18px;
      appearance: none;
      padding: 0;
      border: solid 2px #929292;
      background-position: center;
      &:checked {
        background: url(${imgChecked}) no-repeat center;
        border: solid 2px #292d41;
      }
    }
    .nfs {
      input {
        margin-right: 10px;
      }
      label {
        display: flex;
        align-items: center;
        font-size: 15px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;

export const Loadingbtn = styled.div`
  width: 44px;
  height: 44px;
  background: url(${imgloading}) no-repeat center;
  display: none;
`;
