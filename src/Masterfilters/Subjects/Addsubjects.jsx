import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Topbar from '../../Dashboard/Topbar';
import config from '../../Access/config';

const Addsubjects = () => {
  const [subjectName, setSubjectName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-server/Masterfilter/Subjects/addsubjects.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectName }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Subject added successfully');
        navigate('/subjects');
      } else {
        alert('Failed to add subject');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding subject');
    }
  };

  return (
    <div className='bg-grey'>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <Topbar />
          {/* Main content */}
          <div className="col-md-12">
            <div className="container mt-3">
              {/* Topbar */}
              <div className="row">
                <div className="col-md-12 bg-white shadow-lg p-3 mb-5 bg-white rounded">
                <div className='text-grey h6'>Add Subject</div>
                <hr></hr>
                  <form onSubmit={handleSubmit}>
                    <label className= 'fw-bold'>Subject*</label><br />
                    <input
                      className='custom-input mt-3 cursor'
                      placeholder='Enter Subject Name'
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      required= "true"
                    /><br /><br></br>
                    <div className= 'd-flex justify-content-end'>
                      <button type="submit" className="btn btn-primary mt-3 mx-3">Add Subject</button>
                      <Link to = "/subjects"><button className="btn btn-danger mt-3">Cancel</button></Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addsubjects;
