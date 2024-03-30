import Navbar from "./components/Navbar";
import React from "react";
import renderer from "react-test-renderer";
import { render, screen ,fireEvent} from "@testing-library/react";
import "@testing-library/jest-dom";
import useAuth from "./auth/useAuth";
import useDrawer from "./hooks/Drawer/useDrawer";
import { BrowserRouter as Router } from 'react-router-dom';
import Board from "./components/Board";
import { setupJestCanvasMock } from 'jest-canvas-mock';
import { renderHook, act } from '@testing-library/react-hooks';
import jwtDecode from "jwt-decode";

jest.mock("./hooks/Drawer/useDrawer");
jest.mock("./auth/useAuth");


test("performs snapshot testing", () => {
  const mockToggleDrawer = jest.fn();
  // useDrawer.mockImplementation(()=>{
  //   return {
  //     drawer:false,
  //     toggleDrawer:mockToggleDrawer
  //   }
  // });

  useAuth.mockImplementation(()=>{
    return {
      user:{},
    }
  });
  
  const { getByText } = render(<Router><Navbar/></Router>);

  const drawer=screen.getByTestId('drawer');
  fireEvent.click(drawer)

  expect(mockToggleDrawer).toHaveBeenCalled()
  expect(getByText("<CodeShare / >")).toBeInTheDocument();
  expect(getByText("Home")).toBeInTheDocument();
  // expect(getByText("Login")).toBeInTheDocument();


});

const mockSocket = {
  on: jest.fn(),
  emit: jest.fn(),
};
beforeEach(() => {
  setupJestCanvasMock();
});
test("testing Board",()=>{

  render(<Board  roomid={1} socketc={mockSocket}/>)
  const clearCanvasbtn=screen.getByTestId('clearCanvas');

})

let mockedrawer;
let user=null;

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react')
  return {
    ...ActualReact,
    useContext: () => ({ drawer: false, 
      setDrawer: jest.fn((p)=>{
      mockedrawer=p
      //on calling result.current.toggleDrawer() setDrawer is called with param 
    }),
    user:null,
    setUser:jest.fn((p)=>{
      user=p
    })
   }), // what you want to return when useContext get fired goes here
  }
})
test("test useDrawer hook",()=>{
 
  const { result } = renderHook(() => useDrawer());
  console.log("result ",result.current)

  // expect(result.current.drawer).toBe(true);

  result.current.toggleDrawer();
    act(() => {
      result.current.toggleDrawer();
    });
    expect(mockedrawer).toBe(true);
})


jest.mock('jwt-decode', () => jest.fn());
test("test useAuth hook",()=>{
  jwtDecode.mockReturnValue('yuvi');

  const { result } = renderHook(() => useAuth());
  console.log("result auth",result.current)
  act(()=>{
    result.current.logIn("dummytoken")
  })
  // expect(user).toBe("yuvi")
  act(()=>{
    result.current.logOut()
  })

  expect(user).toBe(null)
  // expect(result.current.drawer).toBe(true);
  
})