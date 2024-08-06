// src/NavbarComponent.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from "./Assets/logo-2.jpeg";
import "./Styles/Topbar.css";
import { AuthContext } from '../Access/AuthContext';
import Logout from '../Access/Logout';

const Topbar = () => {
  const { isAuthenticated, username, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <Navbar bg="primary" expand="lg" className='text-dark p-3 bg-white'>
      <Navbar.Brand><img className='mno' src={logo} alt="Logo"  /></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto mx-2">
          <Nav.Link className='mx-5 fw-bold' as={Link} to="/homepage">DASHBOARD</Nav.Link>
          <NavDropdown title="MASTERFILTERS" className='mx-5 fw-bold' id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/classes" style={{ color: 'black', textDecoration: 'none' }}>Classes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/subjects" style={{ color: 'black', textDecoration: 'none' }}>Subjects</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/series" style={{ color: 'black', textDecoration: 'none' }}>Series</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/books" style={{ color: 'black', textDecoration: 'none' }}>Books</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/sections" style={{ color: 'black', textDecoration: 'none' }}>Section</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/units" style={{ color: 'black', textDecoration: 'none' }}>Units</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/chapters" style={{ color: 'black', textDecoration: 'none' }}>Chapters</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="RESOURCES" className='mx-5 fw-bold' id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/library" style={{ color: 'black', textDecoration: 'none' }}>Library</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bookpages" style={{ color: 'black', textDecoration: 'none' }}>Book Pages</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="USERS" className='mx-5 fw-bold' id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/schools" style={{ color: 'black', textDecoration: 'none' }}>School</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/students" style={{ color: 'black', textDecoration: 'none' }}>Student</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/teachers" style={{ color: 'black', textDecoration: 'none' }}>Teachers</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        {isAuthenticated && (
          <Nav className=" mx-4">
            <NavDropdown title={`Hi, ${username}!`} style={{ backgroundColor: "yellow", borderRadius: "5px", color: 'white' }} className='fw-bold shift-user-prof' id="user-nav-dropdown">
              <NavDropdown.Item as={Link} to="/change-password" style={{ color: 'black', textDecoration: 'none' }}>Change Password</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/report" style={{ color: 'black', textDecoration: 'none' }}>Report</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/report" style={{ color: 'black', textDecoration: 'none' }}>Post Notification</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/report" style={{ color: 'black', textDecoration: 'none' }}>Tickets</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/report" style={{ color: 'black', textDecoration: 'none' }}>Manage Newsletters</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/report" style={{ color: 'black', textDecoration: 'none' }}>Queries</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout} style={{ color: 'black', textDecoration: 'none' }}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Topbar;
